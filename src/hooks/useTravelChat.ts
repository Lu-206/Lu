import {useRef,useState} from 'react';
import {ChatResponseSchema,PreferencesSchema,type ChatResponse,type Message,type Preferences} from '../../shared/travel';
const STORAGE_KEY='jingtu.preferences.v1';
function loadPreferences(){
  try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw || raw.length>16000)return null;const parsed=JSON.parse(raw);if(parsed.version!==1)return null;const result=PreferencesSchema.safeParse(parsed.preferences);return result.success?result.data:null;}catch{return null;}
}
export function useTravelChat(){
  const sending=useRef(false);
  const [result,setResult]=useState<ChatResponse|null>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  const [preferences,setPreferences]=useState<Preferences|null>(loadPreferences);
  const [useSaved,setUseSaved]=useState(true);
  const [busy,setBusy]=useState(false);
  const [pending,setPending]=useState('');
  const [error,setError]=useState<{code:string;message:string}|null>(null);
  const [storageNotice,setStorageNotice]=useState('');
  async function send(message:string){
    if(sending.current || !message.trim())return false;
    sending.current=true;
    setBusy(true);setPending(message.trim());setError(null);
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(45000),body:JSON.stringify({conversationId:result?.conversationId ?? null,message:message.trim(),...(!result && useSaved && preferences?{preferences}:{})})});
      const raw=await response.text();let data;
      try{data=JSON.parse(raw);}catch{throw {code:'API_UNAVAILABLE',message:'无法读取 AI 服务响应，请确认后端已启动，并通过 npm.cmd run dev 启动项目。'};}
      if(!response.ok)throw {code:typeof data?.error?.code==='string'?data.error.code:'API_ERROR',message:typeof data?.error?.message==='string'?data.error.message:'AI 请求失败，请稍后重试。'};
      const parsed=ChatResponseSchema.safeParse(data);
      if(!parsed.success)throw {code:'INVALID_RESPONSE',message:'服务返回的数据不完整，本轮未显示，请重试。'};
      setResult(parsed.data);setMessages(items=>[...items,{role:'user',content:message.trim()},{role:'assistant',content:parsed.data.reply}]);return true;
    }catch(e){const err=e as {code?:string;message?:string;name?:string};setError(err.code&&err.message?{code:err.code,message:err.message}:{code:'NETWORK_ERROR',message:err.name==='TimeoutError'?'请求超时，请稍后重试。':'无法连接 AI 后端，请确认服务已启动并检查网络。'});return false;}
    finally{sending.current=false;setBusy(false);setPending('');}
  }
  function savePreferences(value:Preferences){
    const parsed=PreferencesSchema.safeParse(value);if(!parsed.success){setStorageNotice('偏好格式不正确：每项最多 160 字，每类最多 20 项。');return;}
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,preferences:parsed.data}));setPreferences(parsed.data);setStorageNotice('偏好已保存到本机，下次新对话可复用。');}catch{setStorageNotice('浏览器禁止保存或存储空间不足，偏好未保存。');}
  }
  function clearPreferences(){try{localStorage.removeItem(STORAGE_KEY);setPreferences(null);setStorageNotice('本机偏好已清除，当前会话需求仍保留。');}catch{setStorageNotice('浏览器禁止访问存储，无法清除，请检查浏览器设置。');}}
  function reset(){if(busy)return;setResult(null);setMessages([]);setError(null);setStorageNotice('');}
  return {result,messages,preferences,useSaved,setUseSaved,busy,pending,error,send,reset,savePreferences,clearPreferences,storageNotice};
}
export type TravelChat = ReturnType<typeof useTravelChat>;
