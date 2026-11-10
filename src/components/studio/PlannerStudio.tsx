import {useState} from 'react';
import {ArrowUpRight,Check,MapPin,Sparkles} from 'lucide-react';
const moods=[{name:'文化寻踪',text:'我想去北京看故宫、天坛，喜欢历史文化和建筑摄影。',image:'/assets/temple-classic.webp',place:'天坛 · 一眼千年'},{name:'山河远行',text:'我想去北京爬长城，喜欢自然风景，希望留足休息时间。',image:'/assets/wall-classic.webp',place:'长城 · 山河入画'},{name:'街巷烟火',text:'我想慢慢逛北京的胡同和什刹海，找地道美食和城市生活。',image:'/assets/hutong-c.webp',place:'胡同 · 人间烟火'}];
export default function PlannerStudio({prompt,onChange,onPlan}:{prompt:string;onChange:(v:string)=>void;onPlan:()=>void}){
 const [mood,setMood]=useState(0);
 return <section className="planner-studio" aria-labelledby="planner-heading">
  <div className="planner-photo"><img src={moods[mood].image} alt={moods[mood].place} loading="lazy" key={mood}/><div className="planner-photo-shade"/><span className="planner-photo-edition">JINGTU JOURNAL / VOL. 01</span><div className="planner-photo-copy"><span>从心动，到出发。</span><h2>你的北京，<br/>应该有你的样子。</h2><p><MapPin size={13}/>{moods[mood].place}</p></div><div className="photo-pass"><span>BOARDING PASS</span><b>此刻 <i>→</i> 北京</b><small>DESTINATION / BEIJING · YOUR WAY</small></div></div>
  <div className="planner-workspace"><div className="section-kicker"><span>03</span><i/> DESIGN YOUR JOURNEY</div><div className="planner-workspace-heading"><div><h2 id="planner-heading">一个想法，<em>就能出发。</em></h2><p>不必想好所有细节。从一个心愿开始就好。</p></div><span className="planner-emblem"><Sparkles size={25}/></span></div>
   <div className="planning-steps"><span className="current"><b>01</b> 说说想法</span><i/><span><b>02</b> 完善偏好</span><i/><span><b>03</b> 准备出发</span></div>
   <form onSubmit={e=>{e.preventDefault();onPlan();}}><label htmlFor="travel-idea"><Sparkles size={15}/> 这次，你想怎样遇见北京？</label><textarea id="travel-idea" value={prompt} onChange={e=>onChange(e.target.value)} placeholder="例如：带父母去北京玩三天，想去故宫，希望节奏轻松一点……"/><div className="input-footnote"><span>一句话也可以，稍后再补充天数与预算。</span><span>{prompt.length} 字</span></div>
    <div className="mood-label">还没想好？跟着心情选一个方向</div><div className="mood-choices">{moods.map((m,i)=><button key={m.name} type="button" aria-pressed={mood===i} className={mood===i?'selected':''} onClick={()=>{setMood(i);onChange(m.text);}}>{m.name}{mood===i?<Check size={12}/>:<ArrowUpRight size={12}/>}</button>)}</div>
    <div className="planner-workspace-submit"><span>YOUR NEXT CHAPTER<br/><b>从这里，开启你的专属旅程</b></span><button className="light-trail-button" type="submit"><span>开始规划 <ArrowUpRight size={18}/></span></button></div>
   </form>
  </div>
 </section>;
}
