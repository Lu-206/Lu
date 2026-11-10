import {useEffect,useRef} from 'react';
import {vertexShader,fragmentShader} from './topoShaders';

/** Scoped ThreeUI terrain: limited DPR, pointer response, offscreen pause and cleanup. */
export default function TerrainCanvas(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!;const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false});
  if(!gl)return;
  const shader=(type:number,source:string)=>{const s=gl.createShader(type);if(!s)return null;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;};
  const vs=shader(gl.VERTEX_SHADER,vertexShader),fs=shader(gl.FRAGMENT_SHADER,fragmentShader);
  if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);return;}
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time'),dprUniform=gl.getUniformLocation(program,'u_dpr'),pointer=gl.getUniformLocation(program,'u_pointer');
  let frame=0,visible=false,last=0,elapsed=0,px=0,py=0,tx=0,ty=0;const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const draw=(stamp:number)=>{frame=0;if(!visible||document.hidden)return;const dt=last?Math.min(stamp-last,50):0;
   if(dt>=30||!last){last=stamp;elapsed+=motion.matches?0:dt*.00022;px+=(tx-px)*.08;py+=(ty-py)*.08;gl.uniform1f(time,elapsed);gl.uniform2f(pointer,px,py);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
   if(!motion.matches)frame=requestAnimationFrame(draw);
  };
  const wake=()=>{if(frame)cancelAnimationFrame(frame);last=0;frame=requestAnimationFrame(draw);};
  const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(dprUniform,dpr);wake();};
  const move=(e:PointerEvent)=>{if(motion.matches||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;};
  const parent=canvas.parentElement!;parent.addEventListener('pointermove',move);const ro=new ResizeObserver(resize);ro.observe(canvas);const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;wake();});io.observe(canvas);document.addEventListener('visibilitychange',wake);motion.addEventListener('change',wake);resize();
  return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();parent.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',wake);motion.removeEventListener('change',wake);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[]);
 return <canvas className="terrain-canvas" ref={ref} aria-hidden="true"/>;
}
