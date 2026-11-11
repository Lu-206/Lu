import 'dotenv/config';
import assert from 'node:assert/strict';
import {callModel} from '../server/model';
import {emptyRequirements,missingRequirements} from '../shared/travel';
if(!process.env.DEEPSEEK_API_KEY?.trim()){
  console.error('未运行真实模型验收：请先在本地 .env 配置 DEEPSEEK_API_KEY。');process.exit(2);
}
const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
const firstMessage='我们两位成人去北京玩三天，人均2000元，日期未定，喜欢历史建筑，不吃花生，节奏轻松。';
const first=await callModel({today,requirements:emptyRequirements(),messages:[{role:'user',content:firstMessage}]});
assert.equal(first.requirements.destination,'北京');assert.equal(first.requirements.people.total,2);assert.equal(first.requirements.days,3);assert.equal(first.requirements.budget.amount,2000);assert.equal(first.requirements.budget.scope,'per_person');assert.equal(first.requirements.dates.flexible,true);assert.equal(missingRequirements(first.requirements).length,0);assert.ok(first.requirements.dietaryRestrictions.some(x=>x.includes('花生')));
const second=await callModel({today,requirements:first.requirements,messages:[{role:'user',content:firstMessage},{role:'assistant',content:first.reply},{role:'user',content:'改成五天，总预算8000元，其他条件不变。'}]});
assert.equal(second.requirements.days,5);assert.equal(second.requirements.budget.amount,8000);assert.equal(second.requirements.budget.scope,'total');assert.equal(second.requirements.people.total,2);assert.ok(second.requirements.dietaryRestrictions.some(x=>x.includes('花生')));
const third=await callModel({today,requirements:emptyRequirements(),messages:[{role:'user',content:'想带家人去北京逛逛'}]});assert.equal(third.requirements.people.total,null);assert.equal(third.requirements.budget.amount,null);assert.ok(missingRequirements(third.requirements).length>=3);
console.log('PASS：真实 DeepSeek 三次调用，完成结构化解析、预算口径更新、忌口保留及缺失条件检测。');
