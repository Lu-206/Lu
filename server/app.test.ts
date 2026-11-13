import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {AddressInfo} from 'node:net';
import {createApp} from './app';
import {ApiError,type Model} from './model';
import {emptyRequirements,emptyPreferences,type Requirements} from '../shared/travel';
async function withServer(model:Model,run:(url:string)=>Promise<void>,now?:()=>number){
  const app=createApp({model,now});await new Promise<void>(resolve=>app.listen(0,'127.0.0.1',resolve));
  try{await run('http://127.0.0.1:'+(app.address() as AddressInfo).port);}finally{await new Promise<void>(resolve=>app.close(()=>resolve()));}
}
const request=(url:string,body:unknown,cookie='')=>fetch(url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});
const full=():Requirements=>({...emptyRequirements(),destination:'北京',people:{total:2,adults:2,children:0},days:3,budget:{amount:2000,scope:'per_person',currency:'CNY',flexible:false},dates:{startDate:null,endDate:null,flexible:true}});
test('multi-turn updates preserve state, history and opt-in preferences; isolate sessions',async()=>{
  let calls=0;
  // Test-only transport fixtures. Production always calls DeepSeek; no simulated fallback exists.
  const model:Model=async input=>{
    calls++;
    if(calls===1){assert.deepEqual(input.requirements.dietaryRestrictions,['不吃花生']);return {reply:'已记录这次的旅行想法。',requirements:{...input.requirements,destination:'北京'}};}
    assert.equal(input.messages.length,3);assert.equal(input.requirements.destination,'北京');assert.deepEqual(input.requirements.dietaryRestrictions,['不吃花生']);
    return {reply:'已更新天数和预算。',requirements:{...full(),dietaryRestrictions:input.requirements.dietaryRestrictions}};
  };
  await withServer(model,async url=>{
    const first=await request(url,{message:'想去北京',preferences:{...emptyPreferences(),dietaryRestrictions:['不吃花生']}});assert.equal(first.status,200);
    const cookie=first.headers.get('set-cookie')!.split(';')[0];assert.match(first.headers.get('set-cookie')!,/HttpOnly; SameSite=Strict/);
    const a=await first.json();assert.equal(a.status,'collecting');assert.equal(a.questions.length,2);
    const denied=await request(url,{message:'偷读',conversationId:a.conversationId});assert.equal(denied.status,409);
    const next=await request(url,{message:'两位成人，三天，人均2000，日期未定',conversationId:a.conversationId},cookie);const b=await next.json();assert.equal(next.status,200);assert.equal(b.status,'ready');assert.equal(b.requirements.days,3);assert.deepEqual(b.requirements.dietaryRestrictions,['不吃花生']);
    assert.equal(calls,2);
  });
});
test('failed model validation does not overwrite previous requirements or history',async()=>{
  let calls=0;const model:Model=async input=>{calls++;if(calls===1)return {reply:'记录完成。',requirements:full()};if(calls===2)return {reply:'坏数据',requirements:{...full(),days:-1}};
    assert.equal(input.requirements.days,3);assert.equal(input.messages.length,3);return {reply:'已改为五天。',requirements:{...input.requirements,days:5}};
  };
  await withServer(model,async url=>{const a=await request(url,{message:'初始需求'});const cookie=a.headers.get('set-cookie')!.split(';')[0],id=(await a.json()).conversationId;
    const bad=await request(url,{message:'改为五天',conversationId:id},cookie);assert.equal(bad.status,502);assert.equal((await bad.json()).error.code,'AI_INVALID_OUTPUT');
    const retry=await request(url,{message:'改为五天',conversationId:id},cookie);assert.equal((await retry.json()).requirements.days,5);
  });
});
test('bad input, cross-origin and body-size failures never reach model',async()=>{
  await withServer(async()=>{throw new Error('must not call');},async url=>{
    assert.equal((await request(url,{message:'  '})).status,400);
    assert.equal((await request(url,{message:'x'.repeat(3001)})).status,400);
    assert.equal((await request(url,{message:'x'.repeat(25000)})).status,413);
    assert.equal((await request(url,{message:'hi',requirements:full()})).status,400);
    assert.equal((await fetch(url+'/api/chat',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'})).status,403);
  });
});
test('expiration gives explicit error instead of silently discarding context',async()=>{
  let time=1000000;
  await withServer(async()=>({reply:'记录完成。',requirements:full()}),async url=>{const a=await request(url,{message:'去北京'});const cookie=a.headers.get('set-cookie')!.split(';')[0];const id=(await a.json()).conversationId;
    time+=7200001;const expired=await request(url,{message:'更新',conversationId:id},cookie);assert.equal(expired.status,409);assert.equal((await expired.json()).error.code,'CONVERSATION_EXPIRED');
  },()=>time);
});
test('unavailable provider is explicit; no fabricated successful reply',async()=>{
  await withServer(async()=>{throw new ApiError(503,'AI_NOT_CONFIGURED','AI 服务尚未配置。');},async url=>{const r=await request(url,{message:'去北京'});assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:{code:'AI_NOT_CONFIGURED',message:'AI 服务尚未配置。'}});});
});
