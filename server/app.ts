import {createServer,type IncomingMessage,type ServerResponse} from 'node:http';
import {randomUUID} from 'node:crypto';
import {ChatInputSchema,ChatResponseSchema,ModelOutputSchema,applyPreferences,emptyRequirements,missingRequirements,type Message,type Requirements} from '../shared/travel';
import {ApiError,callModel,type Model} from './model';

type Conversation = {id:string;owner:string;requirements:Requirements;messages:Message[];updated:number;busy:boolean;turns:number};
const MAX_BODY = 24000, TTL = 2 * 60 * 60 * 1000;
const json = (res:ServerResponse,status:number,body:unknown) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
async function readBody(req:IncomingMessage){
  if(!req.headers['content-type']?.startsWith('application/json')) throw new ApiError(415,'INVALID_CONTENT_TYPE','请使用 JSON 格式提交。');
  const chunks:Buffer[] = [];let size=0;
  for await(const chunk of req){size += chunk.length;if(size > MAX_BODY) throw new ApiError(413,'INPUT_TOO_LARGE','输入内容过长，请精简后再试。');chunks.push(chunk);}
  try{return JSON.parse(Buffer.concat(chunks).toString());}catch{throw new ApiError(400,'INVALID_JSON','提交的数据格式不正确。');}
}
export function createApp({model=callModel,now=Date.now}:{model?:Model;now?:()=>number}={}){
  const conversations = new Map<string,Conversation>();
  const rates = new Map<string,{count:number;at:number}>();
  let active = 0;
  const server = createServer(async(req,res)=>{
    let conversation:Conversation|undefined;let locked=false;
    try{
      if(req.url === '/api/health' && req.method === 'GET') return json(res,200,{ok:true,aiConfigured:Boolean(process.env.DEEPSEEK_API_KEY?.trim())});
      if(req.url !== '/api/chat' || req.method !== 'POST') return json(res,404,{error:{code:'NOT_FOUND',message:'接口不存在。'}});
      // No CORS: browser requests must originate from this app. Vite forwards the original host.
      if(req.headers.origin){
        const expectedHost=req.headers.host;
        if(new URL(req.headers.origin).host !== expectedHost) throw new ApiError(403,'ORIGIN_DENIED','请从京途页面发起请求。');
      }
      const time=now();
      for(const [id,item] of conversations) if(!item.busy && time-item.updated > TTL) conversations.delete(id);
      for(const [ip,rate] of rates) if(time-rate.at >= 60000) rates.delete(ip);
      const ip=req.socket.remoteAddress || 'local';
      const rate=rates.get(ip) || {count:0,at:time};
      if(++rate.count > 20) throw new ApiError(429,'RATE_LIMIT','请求过于频繁，请一分钟后再试。');rates.set(ip,rate);
      if(active >= 4) throw new ApiError(429,'SERVER_BUSY','当前请求较多，请稍后重试。');
      const input=ChatInputSchema.safeParse(await readBody(req));
      if(!input.success) throw new ApiError(400,'INVALID_INPUT','输入不符合要求：消息需为 1–3000 字，偏好需符合数据格式。');
      const session=req.headers.cookie?.match(/(?:^|;\s*)jingtu_session=([a-f0-9-]{36})(?:;|$)/)?.[1] || randomUUID();
      if(!req.headers.cookie?.includes('jingtu_session='+session)) res.setHeader('Set-Cookie','jingtu_session='+session+'; HttpOnly; SameSite=Strict; Path=/api; Max-Age=7200'+(process.env.COOKIE_SECURE === 'true'?'; Secure':''));
      if(input.data.conversationId){
        conversation=conversations.get(input.data.conversationId);
        if(!conversation || conversation.owner !== session) throw new ApiError(409,'CONVERSATION_EXPIRED','会话已过期或不可访问，请开始新对话；已保存偏好仍可使用。');
        if(conversation.busy) throw new ApiError(409,'CONVERSATION_BUSY','上一条消息正在处理，请稍候。');
        if(conversation.turns >= 40) throw new ApiError(409,'TURN_LIMIT','本次对话已达 40 轮，请保存偏好后开始新对话。');
      }else{
        if(conversations.size >= 200) throw new ApiError(503,'CAPACITY_LIMIT','会话暂时已满，请稍后重试。');
        conversation={id:randomUUID(),owner:session,requirements:input.data.preferences?applyPreferences(emptyRequirements(),input.data.preferences):emptyRequirements(),messages:[],updated:time,busy:false,turns:0};
        conversations.set(conversation.id,conversation);
      }
      conversation.busy=true;locked=true;active++;
      const messages:Message[]=[...conversation.messages.slice(-12),{role:'user',content:input.data.message}];
      // Validate even injected transports; invalid data must never mutate the conversation.
      const output=ModelOutputSchema.safeParse(await model({requirements:structuredClone(conversation.requirements),messages,today:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date(time))}));
      if(!output.success) throw new ApiError(502,'AI_INVALID_OUTPUT','AI 返回的数据未通过校验，本轮未保存，请重试。');
      const requirements=output.data.requirements;
      const outOfScope=!!requirements.destination && !/^(北京|北京市|beijing)$/i.test(requirements.destination);
      const missing=missingRequirements(requirements);
      const questions=outOfScope?['京途目前只支持北京，是否改为规划北京之旅？']:missing.slice(0,2).map(x=>x.question);
      const result=ChatResponseSchema.parse({conversationId:conversation.id,reply:output.data.reply,requirements,missing,questions,status:outOfScope?'out_of_scope':missing.length?'collecting':'ready'});
      conversation.requirements=requirements;
      conversation.messages=[...messages,{role:'assistant',content:result.reply+'\n'+questions.join('\n')}];
      conversation.turns++;conversation.updated=now();
      return json(res,200,result);
    }catch(error){
      // Do not retain failed new sessions or put provider details into responses/logs.
      if(conversation?.turns === 0) conversations.delete(conversation.id);
      const safe=error instanceof ApiError?error:new ApiError(500,'INTERNAL_ERROR','服务暂时无法处理请求，请稍后重试。');
      return json(res,safe.status,{error:{code:safe.code,message:safe.message}});
    }finally{if(locked && conversation){conversation.busy=false;active--;}}
  });
  server.requestTimeout=15000;server.headersTimeout=10000;
  server.keepAliveTimeout=5000;
  return server;
}
