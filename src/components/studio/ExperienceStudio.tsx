import {useState} from 'react';
import {ArrowUpRight,Compass,Route,Wallet,MessageCircle,MapPin,Check,Navigation} from 'lucide-react';
import TerrainCanvas from './TerrainCanvas';
const features=[
 {icon:Compass,title:'懂你的偏好',en:'MADE FOR YOU',desc:'想追一场落日，还是慢逛一条胡同？从你的喜好开始。',image:'/assets/palace-sunset.jpg',caption:'在故宫，等一束属于你的光',chips:['建筑与光影','慢慢走','避开人潮'],kind:'preference'},
 {icon:Route,title:'路线有章法',en:'A BETTER WAY',desc:'让想去的地方连成一条线，给路上的惊喜留一点时间。',image:'/assets/palace-contest.jpg',caption:'循着中轴线，走进北京',chips:['故宫','景山','鼓楼'],kind:'route'},
 {icon:Wallet,title:'预算看得见',en:'ROOM FOR MORE',desc:'住得舒服，吃得地道。每一笔预算，都花在你的期待上。',image:'/assets/temple-portrait.jpg',caption:'把预算，留给真正喜欢的体验',chips:['住宿','餐饮','交通'],kind:'budget'},
 {icon:MessageCircle,title:'旅途有回应',en:'ALWAYS WITH YOU',desc:'下一站怎么去，附近吃什么？把路上的小问题交给京途。',image:'/assets/palace-snow.jpg',caption:'随时提问，继续你的旅程',chips:['交通怎么走','附近吃什么','出行提醒'],kind:'chat'},
];
export default function ExperienceStudio({onPlan}:{onPlan:(value?:string)=>void}){
 const [active,setActive]=useState(0),[spot,setSpot]=useState(0);const f=features[active];
 return <section className="experience-studio" id="how">
  <TerrainCanvas/>
  <div className="studio-section-label"><span>01 / THE ART OF TRAVEL</span><span>BEIJING · 39°54′N 116°24′E</span></div>
  <div className="experience-layout">
   <div className="experience-copy"><div className="studio-eyebrow"><span/> A LITTLE LESS PLANNING</div><h2>把时间留给风景，<br/><em>把期待交给京途。</em></h2><p>一座城的千万种可能，<br/>找到属于你的那一种。</p>
    <div className="experience-options" aria-label="体验京途的旅行功能">{features.map((item,i)=><button key={item.kind} aria-pressed={active===i} onClick={()=>{setActive(i);setSpot(0);}} className={active===i?'active':''}><span className="experience-number">0{i+1}</span><item.icon size={18}/><span><b>{item.title}</b>{active===i&&<small>{item.desc}</small>}</span><ArrowUpRight size={17}/></button>)}</div>
   </div>
   <div className="experience-visual">
    <div className="photo-frame"><div className="photo-frame-image" key={f.image}><img src={f.image} alt={f.caption} loading="lazy"/></div><div className="photo-vignette"/><span className="frame-coordinate">PEK / YOUR PERSONAL EDITION</span><div className="photo-frame-title"><span>{f.en}</span><h3>{f.caption}</h3></div><span className="photo-corner corner-a"/><span className="photo-corner corner-b"/>
     <div className="preview-panel" key={f.kind} aria-live="polite"><div className="preview-panel-heading"><span className="studio-pulse"/><span>{f.kind==='route'?'中轴漫游':f.kind==='budget'?'预算分配':f.kind==='chat'?'旅途问答':'你的旅行偏好'}</span><small>体验示意</small></div>
      {f.kind==='route'?<><div className="route-mini">{['故宫','景山','鼓楼'].map((name,i)=><button key={name} onClick={()=>setSpot(i)} aria-pressed={spot===i} className={spot===i?'active':''}><span>{i+1}</span>{name}</button>)}</div><p className="route-caption"><Navigation size={12}/>{['穿过红墙，遇见六百年的故事','登上万春亭，把紫禁城收入眼底','在钟鼓楼下，听一段老北京日常'][spot]}</p></>:
       f.kind==='budget'?<><div className="budget-preview"><span>参考分配比例</span><b>45 / 30 / 25</b></div><div className="budget-bars"><i/><i/><i/></div><div className="budget-legend"><span>住宿 45%</span><span>餐饮 30%</span><span>交通等 25%</span></div></>:
       f.kind==='chat'?<div className="chat-preview"><p>想在故宫附近看日落，有什么想法？</p><span><MessageCircle size={14}/> 把你的问题带给京途，开启旅行问答。</span></div>:
       <div className="preference-preview">{f.chips.map(t=><span key={t}><Check size={12}/>{t}</span>)}<p>让行程，跟上你的节奏。</p></div>}
     </div>
    </div>
    <div className="experience-footer"><span><MapPin size={12}/> 北京，比想象更值得探索</span><button onClick={()=>onPlan('我想安排一趟适合自己偏好的北京旅行')}>开启我的旅程 <ArrowUpRight size={15}/></button></div>
   </div>
  </div>
 </section>;
}
