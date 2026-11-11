import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MockAgent,getGlobalDispatcher,setGlobalDispatcher} from 'undici';
import {callModel} from './model';
import {emptyRequirements} from '../shared/travel';

test('DeepSeek transport: JSON mode, validation, provider errors and no-key behavior',async()=>{
  const saved={key:process.env.DEEPSEEK_API_KEY,base:process.env.AI_BASE_URL,https:process.env.HTTPS_PROXY,http:process.env.HTTP_PROXY};
  const dispatcher=getGlobalDispatcher(),mock=new MockAgent();mock.disableNetConnect();setGlobalDispatcher(mock);
  delete process.env.HTTPS_PROXY;delete process.env.HTTP_PROXY;process.env.AI_BASE_URL='https://api.deepseek.com/v1';
  const input={requirements:emptyRequirements(),messages:[{role:'user' as const,content:'去北京'}],today:'2026-11-11'};
  try{
    delete process.env.DEEPSEEK_API_KEY;
    await assert.rejects(callModel(input),{code:'AI_NOT_CONFIGURED',status:503});
    process.env.DEEPSEEK_API_KEY='test-only-not-a-real-key';
    const pool=mock.get('https://api.deepseek.com');
    pool.intercept({path:'/v1/chat/completions',method:'POST'}).reply(200,opts=>{
      const body=JSON.parse(String(opts.body));assert.equal(body.response_format.type,'json_object');assert.equal(body.model,'deepseek-chat');assert.equal(body.messages.at(-1).role,'user');
      return {choices:[{finish_reason:'stop',message:{content:JSON.stringify({reply:'已记录北京。',requirements:{...emptyRequirements(),destination:'北京'}})}}]};
    });
    assert.equal((await callModel(input)).requirements.destination,'北京');
    for(const [status,code] of [[401,'AI_AUTH_ERROR'],[402,'AI_BALANCE_ERROR'],[429,'AI_RATE_LIMIT'],[500,'AI_UPSTREAM_ERROR']] as const){
      pool.intercept({path:'/v1/chat/completions',method:'POST'}).reply(status,'private provider payload');await assert.rejects(callModel(input),{code});
    }
    for(const content of ['not JSON',JSON.stringify({reply:'invalid',requirements:{...emptyRequirements(),days:-1}})]){
      pool.intercept({path:'/v1/chat/completions',method:'POST'}).reply(200,{choices:[{finish_reason:'stop',message:{content}}]});await assert.rejects(callModel(input),{code:'AI_INVALID_OUTPUT'});
    }
    pool.intercept({path:'/v1/chat/completions',method:'POST'}).reply(200,{choices:[{finish_reason:'length',message:{content:'{}'}}]});await assert.rejects(callModel(input),{code:'AI_INVALID_OUTPUT'});
    mock.assertNoPendingInterceptors();
  }finally{
    setGlobalDispatcher(dispatcher);await mock.close();
    for(const [key,value] of Object.entries({DEEPSEEK_API_KEY:saved.key,AI_BASE_URL:saved.base,HTTPS_PROXY:saved.https,HTTP_PROXY:saved.http})){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
});
