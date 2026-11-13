import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scenes } from '../data';
gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero({onPlan}:{onPlan:()=>void}) {
 const root=useRef<HTMLElement>(null), stage=useRef<HTMLDivElement>(null);
 const trigger=useRef<ScrollTrigger|null>(null);
 const [active,setActive]=useState(0);
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)',()=>{
   const panels=gsap.utils.toArray<HTMLElement>('.scene',root.current);
   const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:'+=400%',pin:stage.current,scrub:0.8,invalidateOnRefresh:true,onUpdate:self=>{setActive(Math.min(4,Math.floor(self.progress*4+0.25)));gsap.set('.journey-progress',{scaleX:self.progress});}}});
   trigger.current=tl.scrollTrigger!;
   panels.forEach((panel,i)=>{
    const picture=panel.querySelector('.scene-picture');
    const copy=panel.querySelector('.scene-copy');
    if(i>0) tl.fromTo(panel,{autoAlpha:0},{autoAlpha:1,duration:.2},i-.28);
    tl.fromTo(picture,{scale:1.06,yPercent:3},{scale:1.2,yPercent:-5,duration:1.1,ease:'none'},Math.max(0,i-.25));
    if(i>0) tl.fromTo(copy,{y:70,autoAlpha:0},{y:0,autoAlpha:1,duration:.3},i-.2);
    if(i<4)tl.to(copy,{y:-65,autoAlpha:0,duration:.22},i+.65);
   });
   // Each chapter gets an equal scroll interval, including the opening and final frame.
   tl.duration(4.85);
   const xTo=gsap.quickTo(stage.current,'--mx',{duration:1,ease:'power3.out'});
   const yTo=gsap.quickTo(stage.current,'--my',{duration:1,ease:'power3.out'});
   const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;xTo((e.clientX/window.innerWidth-.5)*32);yTo((e.clientY/window.innerHeight-.5)*24);};
   const leave=()=>{xTo(0);yTo(0);};
   const el=stage.current!;el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
   return()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);trigger.current=null;};
  });
  media.add('(max-width: 768px), (prefers-reduced-motion: reduce)',()=>{
   const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.index));});},{threshold:.55});
   root.current!.querySelectorAll('.scene').forEach(el=>observer.observe(el));return()=>observer.disconnect();
  });
  return()=>media.revert();
 },[]);
 const go=(i:number)=>{
  const t=trigger.current;
  if(t)window.scrollTo({top:t.start+(t.end-t.start)*(i===0?0:(i+.12)/4.85),behavior:'smooth'});
  else document.getElementById('scene-'+i)?.scrollIntoView({behavior:'smooth'});
 };
 return <section className="cinematic" id="home" ref={root} aria-label="滚动探索北京">
  <div className="cinema-stage" ref={stage}>
   {scenes.map((s,i)=><article className={'scene scene-'+i} key={s.id} id={'scene-'+i} data-index={i} aria-label={s.location}>
    <div className="scene-picture"><img src={s.image} alt={s.location} fetchPriority={i===0?'high':'auto'} loading={i<2?'eager':'lazy'}/></div>
    <div className="scene-shade"/>
    <div className="scene-word" aria-hidden="true">{s.word}</div>
    <div className="scene-copy">
     <div className="cinema-kicker"><span/> {s.label}</div>
     {i===0?<h1>{s.title}<br/><em>{s.accent}</em></h1>:<h2>{s.title}<br/><em>{s.accent}</em></h2>}
     <p className="scene-subtitle">{s.subtitle}</p><p className="scene-description">{s.description}</p>
     {i===4&&<div className="scene-buttons final-scene-actions"><button className="button-gold magnetic" onClick={onPlan}>开启智能旅游 <ArrowUpRight size={18}/></button><a href="#/discover">探索北京 <ArrowDown size={15}/></a></div>}
    </div>
    <div className="scene-caption"><MapPin size={13}/>{s.location}<span>39°54′ N / 116°24′ E</span></div>
   </article>)}
   <div className="cinema-top-label">BEIJING, THROUGH YOUR EYES.</div>
   <nav className="chapter-nav" aria-label="场景导航">{scenes.map((s,i)=><button key={s.id} className={active===i?'selected':''} aria-current={active===i?'step':undefined} aria-label={`第${i+1}幕：${s.location}`} onClick={()=>go(i)}><span>0{i+1}</span><i/><small>{s.en}</small></button>)}</nav>
   <div className="cinema-bottom"><button className="scroll-cue" onClick={()=>go(Math.min(active+1,4))}><ArrowDown size={17}/><span>SCROLL TO EXPLORE</span></button><span className="chapter-count">0{active+1}<small> / 05</small></span><button className="cinema-assistant" onClick={onPlan}><Sparkles size={19}/><span>你的 AI 旅行伙伴<small>从一个想法，到一段旅程</small></span><ArrowRight size={17}/></button></div>
   <div className="journey-progress"/>
  </div>
 </section>;
}
