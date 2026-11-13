import {useEffect,useRef,useState,type RefObject} from 'react';
import {ArrowRight,MapPin,Sparkles,X} from 'lucide-react';
import {emptyPreferences,paceLabels,preferencesFrom,type Preferences,type Requirements} from '../../../shared/travel';
import type {TravelChat} from '../../hooks/useTravelChat';
type Props={dialogRef:RefObject<HTMLElement|null>;prompt:string;setPrompt:(v:string)=>void;chat:TravelChat;onClose:()=>void};
const inspirations=['我们两位成人想去北京玩三天，人均预算 2000 元，日期未定，喜欢历史建筑，节奏轻松。','带父母去北京，想看故宫和颐和园，多安排休息。','周末去北京逛胡同、找美食，两个人，总预算 3000 元。'];
function RequirementSummary({r}:{r:Requirements}){
  const budget=r.budget.flexible?'预算灵活':r.budget.amount===null?'待补充':(r.budget.scope==='total'?'总预算 ':r.budget.scope==='per_person'?'人均 ':'口径待确认 · ')+r.budget.amount+' 元';
  const dates=r.dates.flexible?'日期未定 / 灵活':r.dates.startDate?(r.dates.startDate+(r.dates.endDate?' 至 '+r.dates.endDate:'')):null;
  const rows=[['目的地',r.destination],['同行人数',r.people.total?r.people.total+' 人'+(r.people.adults!==null?'（成人 '+r.people.adults+(r.people.children!==null?'，儿童 '+r.people.children:'')+'）':''):null],['旅行时长',r.days?r.days+' 天':null],['预算',budget],['出行日期',dates],['兴趣偏好',r.interests.join('、')],['忌口',r.dietaryRestrictions.join('、')],['交通偏好',r.transportPreferences.join('、')],['住宿偏好',[r.accommodation.style,r.accommodation.area,r.accommodation.nightlyBudget?'每晚约 '+r.accommodation.nightlyBudget+' 元':null].filter(Boolean).join(' · ')],['旅行节奏',r.pace?paceLabels[r.pace]:null]];
  return <dl className="travel-requirements">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'待补充'}</dd></div>)}</dl>;
}
function PreferenceEditor({initial,onSave,onClear,busy,hasSaved}:{initial:Preferences;onSave:(p:Preferences)=>void;onClear:()=>void;busy:boolean;hasSaved:boolean}){
  const [interests,setInterests]=useState(initial.interests.join('、')),[diet,setDiet]=useState(initial.dietaryRestrictions.join('、')),[transport,setTransport]=useState(initial.transportPreferences.join('、'));
  const [style,setStyle]=useState(initial.accommodationStyle||''),[area,setArea]=useState(initial.accommodationArea||''),[pace,setPace]=useState(initial.pace||'');
  const split=(s:string)=>s.split(/[、，,\n]/).map(x=>x.trim()).filter(Boolean);
  return <details className="travel-preferences"><summary>查看 / 编辑长期偏好{hasSaved?' · 本机已保存':''}</summary><p>仅保存下面的偏好；日期、人数和本次预算不会保存。可先修改再保存。</p>
    <fieldset disabled={busy}><label>兴趣（用顿号分隔）<input value={interests} onChange={e=>setInterests(e.target.value)} maxLength={1000}/></label><label>忌口<input value={diet} onChange={e=>setDiet(e.target.value)} maxLength={1000}/></label><label>交通偏好<input value={transport} onChange={e=>setTransport(e.target.value)} maxLength={1000}/></label><label>住宿类型<input value={style} onChange={e=>setStyle(e.target.value)} maxLength={160}/></label><label>住宿区域<input value={area} onChange={e=>setArea(e.target.value)} maxLength={160}/></label><label>旅行节奏<select value={pace} onChange={e=>setPace(e.target.value)}><option value="">未设置</option>{Object.entries(paceLabels).map(([v,label])=><option value={v} key={v}>{label}</option>)}</select></label>
    <div className="preference-actions"><button type="button" onClick={()=>onSave({interests:split(interests),dietaryRestrictions:split(diet),transportPreferences:split(transport),accommodationStyle:style.trim()||null,accommodationArea:area.trim()||null,pace:(pace||null) as Preferences['pace']})}>保存偏好到本机</button>{hasSaved&&<button type="button" onClick={onClear}>清除已保存偏好</button>}</div></fieldset>
    <p>保存在当前浏览器，可随时清除；用于新对话时会随消息发送给 DeepSeek。本机保存不等于账号云同步。</p>
  </details>;
}
export default function PlannerDialog({dialogRef,prompt,setPrompt,chat,onClose}:Props){
  const bottom=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottom.current?.scrollIntoView({block:'nearest'});},[chat.messages.length,chat.busy]);
  const initial=chat.result?preferencesFrom(chat.result.requirements):chat.preferences||emptyPreferences();
  const send=async()=>{const text=prompt;if(await chat.send(text))setPrompt('');};
  return <div className="modal-backdrop atelier-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section ref={dialogRef} className="planner-modal atelier-dialog travel-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button className="modal-close atelier-close" onClick={onClose} aria-label="关闭"><X size={21}/></button>
    <aside className="dialog-destination"><img src="/assets/palace-sunny.webp" alt="晴日里的故宫铜狮与金瓦，摄影：CEphoto, Uwe Aranas"/><div className="dialog-photo-shade"/><a className="dialog-brand" href="#home" onClick={onClose}><span>京</span>京途 AI</a><div className="dialog-destination-copy"><span>BEIJING, YOUR WAY.</span><h2>下一站，<br/>遇见你的北京。</h2><p>把旅行想法，<br/>慢慢聊成清晰的计划。</p></div><div className="dialog-ticket"><MapPin size={15}/> 北京 / BEIJING<small>YOUR JOURNEY STARTS WITH AN IDEA</small></div></aside>
    <div className="dialog-form-area travel-form-area"><div className="dialog-kicker"><Sparkles size={14}/> DEEPSEEK · TRAVEL ASSISTANT</div><div className="travel-heading"><h2 id="modal-title">一起，聊清这趟旅行。</h2><button onClick={()=>{chat.reset();setPrompt('');}} disabled={chat.busy}>新对话</button></div><p className="dialog-intro">描述需求，京途会确认条件并继续追问。此阶段尚不生成完整行程或查询实时预订信息。</p>
      {!chat.result&&chat.preferences&&<label className="reuse-preferences"><input type="checkbox" checked={chat.useSaved} onChange={e=>chat.setUseSaved(e.target.checked)} disabled={chat.busy}/>使用本机已保存偏好（当前需求优先）</label>}
      <div className="travel-thread" role="log" aria-label="旅行需求对话" aria-live="polite" aria-busy={chat.busy}>
        {!chat.messages.length&&!chat.busy&&<div className="travel-welcome">你好，说说想和谁去北京、玩几天，以及预算或想去的地方。还没想好的条件可以继续聊。</div>}
        {chat.messages.map((m,i)=><div className={'travel-message '+m.role} key={i}><small>{m.role==='user'?'你':'京途 AI'}</small><p>{m.content}</p></div>)}
        {chat.busy&&<><div className="travel-message user"><small>你</small><p>{chat.pending}</p></div><p className="travel-waiting" role="status">正在理解旅行需求……</p></>}
        {!chat.busy&&chat.result&&<div className="travel-followup">{chat.result.status==='ready'?<p>✓ 必需条件已齐全，可继续补充偏好或修改需求。完整行程将在后续模块生成。</p>:<><b>{chat.result.status==='out_of_scope'?'当前仅支持北京':'还需要确认'}</b>{chat.result.questions.map(q=><p key={q}>{q}</p>)}</>}</div>}
        <div ref={bottom}/>
      </div>
      {chat.error&&<div className="travel-error" role="alert"><b>本轮未完成</b><p>{chat.error.message}</p><small>{chat.error.code}</small>{['CONVERSATION_EXPIRED','TURN_LIMIT'].includes(chat.error.code)&&<button onClick={()=>chat.reset()}>开始新对话，保留输入</button>}</div>}
      {!chat.messages.length&&<div className="travel-inspirations">{inspirations.map((text,i)=><button type="button" key={text} disabled={chat.busy} onClick={()=>setPrompt(text)}>{['初见北京','陪父母慢游','周末散步'][i]}</button>)}</div>}
      <form className="travel-compose" onSubmit={e=>{e.preventDefault();void send();}}><label htmlFor="modal-prompt">{chat.messages.length?'继续补充或修改需求':'我的旅行想法'}</label><textarea id="modal-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} maxLength={3000} disabled={chat.busy} placeholder="例如：我们两个人去北京玩三天，总预算 5000 元，日期未定……" required/><div><small>{prompt.length} / 3000 · 仅发送后才调用 AI</small><button type="submit" disabled={chat.busy||!prompt.trim()}>{chat.busy?'理解中…':chat.error?'重试发送':'发送'}<ArrowRight size={16}/></button></div></form>
      {chat.result&&<details className="travel-summary" open><summary>结构化旅行需求 · 已确认 {5-chat.result.missing.length} / 5 项必需条件</summary><RequirementSummary r={chat.result.requirements}/><p>兴趣、住宿和旅行节奏为可选项，不会替你默认填写。</p></details>}
      <PreferenceEditor key={JSON.stringify(initial)} initial={initial} onSave={chat.savePreferences} onClear={chat.clearPreferences} busy={chat.busy} hasSaved={!!chat.preferences}/>
      <p role="status" className="travel-storage-notice">{chat.storageNotice}</p><small className="travel-privacy">消息会发送至 DeepSeek 以理解需求，请勿输入身份证号、支付信息或密钥。会话保存在服务端内存中，闲置两小时或服务重启后失效。</small>
    </div>
  </section></div>;
}
