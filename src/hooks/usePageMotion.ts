import {useLayoutEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function usePageMotion(){
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}}));
  });
  return()=>media.revert();
 },[]);
}
