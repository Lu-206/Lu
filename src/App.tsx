import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Compass, MapPin, Menu, MessageCircle, Sparkles, TrainFront, Wallet, X } from "lucide-react";

import CinematicHero from './components/CinematicHero';
import {destinations, type Destination} from './data';
import {usePageMotion} from './hooks/usePageMotion';

const quickPrompts = ["第一次来北京，经典景点都想去", "带父母慢节奏逛北京", "预算 2000 元，玩 3 天"];

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
  const [days, setDays] = useState("3 天");
  const [budget, setBudget] = useState("人均 2000 元");
  const [submitted, setSubmitted] = useState(false);

  useEffect(()=>{
    if(!plannerOpen&&!selected)return;
    const previous=document.activeElement as HTMLElement;
    const original=document.body.style.overflow; document.body.style.overflow='hidden';
    const timer=window.setTimeout(()=>modalRef.current?.querySelector<HTMLElement>('button,textarea')?.focus(),0);
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){setPlannerOpen(false);setSelected(null);}
      if(e.key==='Tab'){
        const els=modalRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,select,a[href]');
        if(!els?.length)return;const first=els[0],last=els[els.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };document.addEventListener('keydown',key);
    return()=>{clearTimeout(timer);document.body.style.overflow=original;document.removeEventListener('keydown',key);previous?.focus();};
  },[plannerOpen,selected]);
  const startPlanning = (value = prompt) => {
    setPrompt(value);
    setSubmitted(false);
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
      <section className="intro section-pad" id="how">
        <div className="section-kicker"><span>01</span><i/> THE ART OF TRAVEL</div>
        <div className="intro-grid reveal"><h2>让每一次出发，<br/><em>都有迹可循。</em></h2><div className="intro-copy"><p>北京值得慢慢探索，而你的时间值得被认真安排。告诉京途你的想法，京途将帮助你梳理出行偏好与预算，把期待变成清晰的旅行计划。</p><button className="under-link" onClick={() => startPlanning()}>认识你的旅行伙伴 <ArrowUpRight size={16}/></button></div></div>
        <div className="feature-row reveal">
          <div className="feature"><Compass/><b>懂你的偏好</b><span>自然语言理解，主动补全旅行需求</span></div>
          <div className="feature"><MapPin/><b>路线有章法</b><span>结合地理位置，合理编排行程</span></div>
          <div className="feature"><Wallet/><b>预算看得见</b><span>费用拆解与预算动态管理</span></div>
          <div className="feature"><MessageCircle/><b>旅途有回应</b><span>随时问答，变化及时提醒</span></div>
        </div>
      </section>

      <section className="discover section-pad" id="discover">
        <div className="discover-heading reveal"><div><div className="section-kicker"><span>02</span><i/> CURATED BEIJING</div><h2>循着城市的脉络，<br/><em>发现北京。</em></h2></div><p>从皇家气韵到市井烟火，<br/>每一处风景，都有自己的故事。</p></div>
        <div className="destination-grid">{destinations.map((item, index) => <article className="destination-card reveal" key={item.name}><button className="destination-photo" onClick={()=>setSelected(item)} aria-label={`查看${item.name}详情`}><img src={item.image} alt={item.name} loading="lazy" width="700" height="500"/><span className="photo-index">0{index + 1}</span><span className="photo-tag">{item.tag}</span><span className="view-destination">探索这里 <ArrowUpRight size={18}/></span></button><div className="destination-info"><div><small>{item.en}</small><h3>{item.name}</h3><p>{item.desc}</p><span className="destination-location"><MapPin size={12}/>{item.location}</span></div><div className="destination-foot"><span><CalendarDays size={13}/> {item.time}</span><button aria-label={`规划${item.name}行程`} onClick={() => startPlanning(`我想去${item.name}，请帮我安排周边行程`)}><ArrowUpRight size={18}/></button></div></div></article>)}</div>
        <div className="center-action"><button className="outline-button" onClick={() => startPlanning("帮我探索北京值得去的地方")}>探索更多目的地 <ArrowRight size={16}/></button></div>
      </section>

      <section className="inline-planner section-pad" aria-labelledby="planner-heading">
       <div className="section-kicker"><span>03</span><i/> LESS PLANNING. MORE LIVING.</div>
       <div className="planner-layout reveal"><div><h2 id="planner-heading">一个想法，<br/><em>就能出发。</em></h2><p>告诉我们你的旅行想法，剩下的交给京途。</p><small>YOUR JOURNEY, REIMAGINED BY AI.</small></div>
       <form onSubmit={e=>{e.preventDefault();startPlanning();}}><label htmlFor="travel-idea"><Sparkles size={18}/> 北京之旅，从这里开始</label><textarea id="travel-idea" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="我想和家人去北京玩五天，预算 8000 元，希望轻松一点，想去故宫和长城。"/><div className="quick-prompts">{quickPrompts.map(q=><button type="button" key={q} onClick={()=>setPrompt(q)}>{q}</button>)}</div><div className="planner-form-bottom"><span>偏好 · 天数 · 预算，一起安排</span><button className="button-red" type="submit">开始规划 <ArrowUpRight size={17}/></button></div></form></div>
      </section>
      <section className="planner-band" id="about"><div className="planner-text"><div className="section-kicker light"><span>04</span><i/> YOUR JOURNEY, REIMAGINED</div><h2>北京很大，<br/><em>不必一个人做攻略。</em></h2><p>把想去的地方、同行的人、心里的预算告诉京途。<br/>剩下的交给 AI，一起把旅程安排妥当。</p><button className="button-gold" onClick={() => startPlanning()}>和京途聊一聊 <ArrowRight size={17}/></button></div><div className="planner-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-seal">京<span>途</span><small>AI TRAVEL</small></div><div className="art-caption">TRAVEL WITH<br/>A LITTLE MORE MEANING.</div></div></section>
    </main>

    <footer><a className="brand footer-brand" href="#"><span className="brand-seal">京</span><span><b>京途 AI</b><small>JINGTU · BEIJING TRAVEL</small></span></a><span>让 AI 理解每一位游客，让北京之旅更智能。</span><span>© 2026 JINGTU AI</span></footer>

    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section ref={modalRef} className="planner-modal destination-modal" role="dialog" aria-modal="true" aria-labelledby="destination-title"><button className="modal-close" onClick={()=>setSelected(null)} aria-label="关闭详情"><X/></button><img src={selected.image} alt={selected.name}/><div className="detail-copy"><div className="modal-kicker">{selected.en}</div><h2 id="destination-title">{selected.name}</h2><p className="destination-location"><MapPin size={13}/>{selected.location} · {selected.time}</p><p>{selected.detail}</p><p className="detail-tip">出行提示：{selected.tip}</p><button className="button-red" onClick={()=>{const name=selected.name;setSelected(null);startPlanning(`我想去${name}，请帮我安排周边行程`);}}>加入我的旅行想法 <ArrowRight size={17}/></button></div></section></div>}
    {plannerOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setPlannerOpen(false); }}><section ref={modalRef} className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setPlannerOpen(false)} aria-label="关闭"><X/></button><div className="modal-kicker"><Sparkles size={15}/> JINGTU AI · TRAVEL ASSISTANT</div><h2 id="modal-title">下一站，去北京。</h2><p className="modal-desc">说说你的旅行想法，京途会帮你整理成一份专属计划。</p>{submitted ? <div className="submitted"><div className="success-mark"><Sparkles/></div><h3>旅行想法已整理</h3><p className="request-summary">{prompt}</p><p>{days} · {budget}</p><p>当前为交互演示，尚未生成真实行程。接入 AI 服务后，将继续补全需求并安排路线。</p><button className="button-red" onClick={() => { setSubmitted(false); setPlannerOpen(false); }}>好的，知道了</button></div> : <><label htmlFor="modal-prompt" className="field-label">你想怎样开启这趟旅程？</label><textarea id="modal-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="例如：我和朋友计划周末去北京玩三天，想看故宫和长城，人均预算 2000 元……"/><div className="quick-prompts">{quickPrompts.map(q => <button key={q} onClick={() => setPrompt(q)}>{q}</button>)}</div><div className="form-row"><label><span>出行天数</span><select value={days} onChange={e => setDays(e.target.value)}><option>2 天</option><option>3 天</option><option>4 天</option><option>5 天</option><option>7 天</option></select></label><label><span>人均预算</span><select value={budget} onChange={e => setBudget(e.target.value)}><option>人均 1000 元</option><option>人均 2000 元</option><option>人均 3000 元</option><option>人均 5000 元</option><option>预算灵活</option></select></label></div><button className="button-red modal-submit" onClick={() => setSubmitted(true)} disabled={!prompt.trim()}>整理我的旅行需求 <ArrowRight size={17}/></button><small className="privacy-note">当前为首页交互原型，尚未连接真实 AI 接口。</small></>}</section></div>}
  </div>;
}