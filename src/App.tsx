import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Menu, X } from "lucide-react";

import ExperienceStudio from './components/studio/ExperienceStudio';
import PlannerStudio from './components/studio/PlannerStudio';
import PlannerDialog from './components/studio/PlannerDialog';
import CinematicHero from './components/CinematicHero';
import {destinations, type Destination} from './data';
import {usePageMotion} from './hooks/usePageMotion';
import {useTravelChat} from './hooks/useTravelChat';



export default function App() {
  usePageMotion();
  const [selected, setSelected] = useState<Destination|null>(null);
  const [navSolid,setNavSolid] = useState(false);
  const [activeNav,setActiveNav] = useState('home');
  const modalRef=useRef<HTMLElement>(null);
  useEffect(()=>{const scroll=()=>setNavSolid(window.scrollY>80);scroll();window.addEventListener('scroll',scroll,{passive:true});
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActiveNav(e.target.id);}),{rootMargin:'-15% 0px -55% 0px'});
    ['home','how','discover','about'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el);});
    return()=>{window.removeEventListener('scroll',scroll);observer.disconnect();};},[]);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const chat = useTravelChat();

  useEffect(()=>{
    if(!plannerOpen&&!selected)return;
    const previous=document.activeElement as HTMLElement;
    const original=document.body.style.overflow; document.body.style.overflow='hidden';
    const timer=window.setTimeout(()=>modalRef.current?.querySelector<HTMLElement>('button,textarea')?.focus(),0);
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){setPlannerOpen(false);setSelected(null);}
      if(e.key==='Tab'){
        const els=Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea:not(:disabled),input:not(:disabled),select:not(:disabled),summary,a[href]') || []).filter(el=>{const closed=el.closest('details:not([open])');return (!closed || el===closed.querySelector('summary')) && el.getClientRects().length>0 && el.tabIndex>=0;});
        if(!els.length)return;const first=els[0],last=els[els.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };document.addEventListener('keydown',key);
    return()=>{clearTimeout(timer);document.body.style.overflow=original;document.removeEventListener('keydown',key);previous?.focus();};
  },[plannerOpen,selected]);
  const startPlanning = (value = prompt) => {
    setPrompt(value);
    setPlannerOpen(true);
  };

  return <div className="site-shell">
    <a href="#how" className="skip-link">跳至旅行规划</a>
    <header className={"nav-wrap cinema-nav "+(navSolid?"solid":"")}>
      <a className="brand" href="#"><span className="brand-seal">京</span><span><b>京途 AI</b><small>JINGTU · BEIJING TRAVEL</small></span></a>
      <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
        <a className={activeNav==='home'?'active':''} href="#home" onClick={() => setMobileOpen(false)}>首页</a>
        <a className={activeNav==='discover'?'active':''} href="#discover" onClick={() => setMobileOpen(false)}>发现北京</a>
        <a className={activeNav==='how'?'active':''} href="#how" onClick={() => setMobileOpen(false)}>智能规划</a>
        <a className={activeNav==='about'?'active':''} href="#about" onClick={() => setMobileOpen(false)}>关于京途</a>
      </nav>
      <div className="nav-actions"><span className="status"><i/> 旅行灵感，随时开启</span><button className="nav-cta" onClick={() => startPlanning()}>开始规划 <ArrowUpRight size={15}/></button></div>
      <button className="mobile-menu" aria-label="打开菜单" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <CinematicHero onPlan={()=>startPlanning()}/>
      <div className="journey-strip"><span>一座城，无数种打开方式。</span><span>文化寻踪 <i>✳</i> 胡同漫步 <i>✳</i> 山河远行 <i>✳</i> 智能规划</span></div>
      <ExperienceStudio onPlan={(value)=>startPlanning(value)}/>

      <section className="discover section-pad" id="discover">
        <div className="discover-heading reveal"><div><div className="section-kicker"><span>02</span><i/> CURATED BEIJING</div><h2>循着城市的脉络，<br/><em>发现北京。</em></h2></div><p>从皇家气韵到市井烟火，<br/>每一处风景，都有自己的故事。</p></div>
        <div className="destination-grid">{destinations.map((item, index) => <article className="destination-card reveal" key={item.name}><button className="destination-photo" onClick={()=>setSelected(item)} aria-label={`查看${item.name}详情`}><img src={item.image} alt={item.name} loading="lazy" width="700" height="500"/><span className="photo-index">0{index + 1}</span><span className="photo-tag">{item.tag}</span><span className="view-destination">探索这里 <ArrowUpRight size={18}/></span></button><div className="destination-info"><div><small>{item.en}</small><h3>{item.name}</h3><p>{item.desc}</p><span className="destination-location"><MapPin size={12}/>{item.location}</span></div><div className="destination-foot"><span><CalendarDays size={13}/> {item.time}</span><button aria-label={`规划${item.name}行程`} onClick={() => startPlanning(`我想去${item.name}，请帮我安排周边行程`)}><ArrowUpRight size={18}/></button></div></div></article>)}</div>
        <div className="center-action"><button className="outline-button" onClick={() => startPlanning("帮我探索北京值得去的地方")}>探索更多目的地 <ArrowRight size={16}/></button></div>
      </section>

      <PlannerStudio prompt={prompt} onChange={setPrompt} onPlan={()=>startPlanning()}/>
      <section className="planner-band" id="about"><div className="planner-text"><div className="section-kicker light"><span>04</span><i/> YOUR JOURNEY, REIMAGINED</div><h2>北京很大，<br/><em>不必一个人做攻略。</em></h2><p>把想去的地方、同行的人、心里的预算告诉京途。<br/>剩下的交给 AI，一起把旅程安排妥当。</p><button className="button-gold" onClick={() => startPlanning()}>和京途聊一聊 <ArrowRight size={17}/></button></div><div className="planner-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-seal">京<span>途</span><small>AI TRAVEL</small></div><div className="art-caption">TRAVEL WITH<br/>A LITTLE MORE MEANING.</div></div></section>
    </main>

    <footer><a className="brand footer-brand" href="#"><span className="brand-seal">京</span><span><b>京途 AI</b><small>JINGTU · BEIJING TRAVEL</small></span></a><span>让 AI 理解每一位游客，让北京之旅更智能。</span><span>© 2026 JINGTU AI · <a href="/assets/CREDITS.md" target="_blank" rel="noreferrer" style={{color:"inherit"}}>摄影署名</a></span></footer>

    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section ref={modalRef} className="planner-modal destination-modal" role="dialog" aria-modal="true" aria-labelledby="destination-title"><button className="modal-close" onClick={()=>setSelected(null)} aria-label="关闭详情"><X/></button><img src={selected.image} alt={selected.name}/><div className="detail-copy"><div className="modal-kicker">{selected.en}</div><h2 id="destination-title">{selected.name}</h2><p className="destination-location"><MapPin size={13}/>{selected.location} · {selected.time}</p><p>{selected.detail}</p><p className="detail-tip">出行提示：{selected.tip}</p><button className="button-red" onClick={()=>{const name=selected.name;setSelected(null);startPlanning(`我想去${name}，请帮我安排周边行程`);}}>加入我的旅行想法 <ArrowRight size={17}/></button></div></section></div>}
    {plannerOpen && <PlannerDialog dialogRef={modalRef} prompt={prompt} setPrompt={setPrompt} chat={chat} onClose={()=>setPlannerOpen(false)}/>}

  </div>;
}