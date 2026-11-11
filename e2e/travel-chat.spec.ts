import {test,expect} from '@playwright/test';
import {emptyRequirements,missingRequirements} from '../shared/travel';

test('test-only provider fixtures: follow-up, updates, consent, reload and preference reuse',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  let calls=0;
  await page.route('**/api/chat',async route=>{
    calls++;const input=route.request().postDataJSON();
    const r={...emptyRequirements(),destination:'北京',people:{total:2,adults:2,children:0},days:calls===1?3:5,budget:{amount:calls===1?8000:6000,scope:calls===1?'unknown' as const:'total' as const,currency:'CNY' as const,flexible:false},dates:{startDate:null,endDate:null,flexible:true},interests:['历史建筑'],dietaryRestrictions:['不吃花生'],pace:'relaxed' as const};
    if(calls===2)expect(input.conversationId).toBe('a1111111-1111-4111-8111-111111111111');
    if(calls===3){expect(input.conversationId).toBeNull();expect(input.preferences.dietaryRestrictions).toEqual(['不吃花生']);}
    const missing=missingRequirements(r);
    await route.fulfill({json:{conversationId:'a1111111-1111-4111-8111-111111111111',reply:calls===1?'已记录预算，需要确认预算口径。':'已更新需求，其他偏好保留。',requirements:r,missing,questions:missing.slice(0,2).map(x=>x.question),status:missing.length?'collecting':'ready'}});
  });
  await page.goto('/');await page.locator('.nav-cta').click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('button',{name:'关闭',exact:true})).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(dialog.locator('.travel-preferences summary')).toBeFocused();
  await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'关闭',exact:true})).toBeFocused();
  const input=dialog.getByRole('textbox',{name:'我的旅行想法'});await input.fill('两人去北京三天，预算8000，日期未定，喜欢历史建筑，不吃花生。');await dialog.getByRole('button',{name:'发送',exact:true}).click();
  await expect(dialog.getByText('这笔预算是全部人的总预算，还是每人预算？')).toBeVisible();
  const next=dialog.getByRole('textbox',{name:'继续补充或修改需求'});await next.fill('改成五天，总预算6000元。');await dialog.getByRole('button',{name:'发送',exact:true}).click();
  await expect(dialog.getByText('总预算 6000 元',{exact:true})).toBeVisible();await expect(dialog.getByText('5 天',{exact:true})).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('jingtu.preferences.v1'))).toBeNull();
  await dialog.locator('.travel-preferences summary').click();await dialog.getByRole('button',{name:'保存偏好到本机'}).click();await expect(dialog.getByText('偏好已保存到本机，下次新对话可复用。')).toBeVisible();
  await page.keyboard.press('Escape');await page.locator('.nav-cta').click();await expect(dialog.getByText('总预算 6000 元',{exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'新对话',exact:true}).click();await expect(dialog.getByRole('checkbox')).toBeChecked();await dialog.getByRole('textbox',{name:'我的旅行想法'}).fill('下次也去北京');await dialog.getByRole('button',{name:'发送',exact:true}).click();await expect(dialog.getByText('已更新需求，其他偏好保留。')).toBeVisible();
  await page.reload();await page.locator('.nav-cta').click();await expect(dialog.getByRole('checkbox')).toBeChecked();await dialog.locator('.travel-preferences summary').click();await expect(dialog.getByLabel('忌口',{exact:true})).toHaveValue('不吃花生');
  await dialog.getByRole('button',{name:'清除已保存偏好'}).click();await expect(dialog.getByText('本机偏好已清除，当前会话需求仍保留。')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('jingtu.preferences.v1'))).toBeNull();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);expect(errors).toEqual([]);
});

test('unconfigured real API reports failure, retains draft and produces no assistant message',async({page,request})=>{
  const health=await request.get('http://127.0.0.1:3001/api/health');test.skip((await health.json()).aiConfigured,'Real key configured: missing-key scenario does not apply.');
  await page.goto('/');await page.locator('.nav-cta').click();const dialog=page.getByRole('dialog');const text='我想去北京玩三天';
  await dialog.getByRole('textbox',{name:'我的旅行想法'}).fill(text);await dialog.getByRole('button',{name:'发送',exact:true}).click();
  await expect(dialog.getByRole('alert')).toContainText('AI 服务尚未配置');await expect(dialog.getByRole('textbox',{name:'我的旅行想法'})).toHaveValue(text);await expect(dialog.locator('.travel-message.assistant')).toHaveCount(0);
  await expect(dialog.getByRole('button',{name:'重试发送'})).toBeEnabled();await page.screenshot({path:test.info().outputPath('unconfigured-api.png'),fullPage:false});
});
