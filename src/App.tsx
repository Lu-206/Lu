import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Compass, MapPin, Menu, MessageCircle, Sparkles, TrainFront, Wallet, X } from "lucide-react";

const destinations = [
  { name: "故宫博物院", en: "THE PALACE MUSEUM", desc: "沿着红墙金瓦，走进六百年的时间", tag: "初见北京", time: "建议 3–4 小时", image: "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1000&q=85" },
  { name: "八达岭长城", en: "THE GREAT WALL", desc: "登高望远，在群山之间读懂壮阔", tag: "山河远行", time: "建议 4–5 小时", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=85" },
  { name: "天坛公园", en: "TEMPLE OF HEAVEN", desc: "在古老的祈年殿下，感受东方秩序之美", tag: "文化漫游", time: "建议 2–3 小时", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1000&q=85" },
];

const quickPrompts = ["第一次来北京，经典景点都想去", "带父母慢节奏逛北京", "预算 2000 元，玩 3 天"];

export default function App() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [days, setDays] = useState("3 天");
  const [budget, setBudget] = useState("人均 2000 元");
  const [submitted, setSubmitted] = useState(false);

  const startPlanning = (value = prompt) => {
    setPrompt(value);
    setSubmitted(false);
    setPlannerOpen(true);
  };

  return <div className="site-shell">
    <div className="topline"><span>京城有约 · 智慧旅程</span><span>AN INTELLIGENT JOURNEY THROUGH BEIJING</span><span>北京 · 中国</span></div>
    <header className="nav-wrap">
      <a className="brand" href="#"><span className="brand-seal">京</span><span><b>京途 AI</b><small>JINGTU · BEIJING TRAVEL</small></span></a>
      <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
        <a className="active" href="#home" onClick={() => setMobileOpen(false)}>首页</a>
        <a href="#discover" onClick={() => setMobileOpen(false)}>发现北京</a>
        <a href="#how" onClick={() => setMobileOpen(false)}>智能规划</a>
        <a href="#about" onClick={() => setMobileOpen(false)}>关于京途</a>
      </nav>
      <div className="nav-actions"><span className="status"><i/> AI 在线</span><button className="nav-cta" onClick={() => startPlanning()}>开始规划 <ArrowUpRight size={15}/></button></div>
      <button className="mobile-menu" aria-label="打开菜单" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image"/>
        <div className="hero-shade"/>
        <div className="hero-content">
          <div className="eyebrow light"><span/> YOUR PERSONAL BEIJING GUIDE <span/></div>
          <h1>一城千面，<br/><em>京</em>彩由你。</h1>
          <p className="hero-sub">不止于抵达，更在于懂得如何体验。<br/>让 AI 为你读懂北京，规划一场恰到好处的旅程。</p>
          <div className="hero-buttons"><button className="button-gold" onClick={() => startPlanning()}>开启智能旅程 <ArrowRight size={17}/></button><a className="text-link" href="#discover">探索北京 <span>↓</span></a></div>
          <div className="hero-note"><span className="note-line"/> 从一座城的故事，开始你的旅程 <span className="note-en">EST. 2026</span></div>
        </div>
        <div className="hero-side-label">BEIJING · 39°54′N 116°24′E</div>
        <div className="hero-bottom"><span>01 / 04</span><span className="hero-bottom-line"/><span>古都新韵 · 智行北京</span></div>
        <div className="floating-card"><div className="floating-icon"><Sparkles size={17}/></div><div><b>你的 AI 旅行管家</b><small>理解偏好 · 实时规划 · 灵活调整</small></div><span className="pulse-dot"/></div>
      </section>

      <section className="intro section-pad" id="how">
        <div className="section-kicker"><span>01</span><i/> THE ART OF TRAVEL</div>
        <div className="intro-grid"><h2>让每一次出发，<br/><em>都有迹可循。</em></h2><div className="intro-copy"><p>北京值得慢慢探索，而你的时间值得被认真安排。告诉京途你的想法，AI 将结合真实景点信息、出行偏好与预算，为你编织专属旅程。</p><button className="under-link" onClick={() => startPlanning()}>认识你的旅行伙伴 <ArrowUpRight size={16}/></button></div></div>
        <div className="feature-row">
          <div className="feature"><Compass/><b>懂你的偏好</b><span>自然语言理解，主动补全旅行需求</span></div>
          <div className="feature"><MapPin/><b>路线有章法</b><span>结合地理位置，合理编排行程</span></div>
          <div className="feature"><Wallet/><b>预算看得见</b><span>费用拆解与预算动态管理</span></div>
          <div className="feature"><MessageCircle/><b>旅途有回应</b><span>随时问答，变化及时提醒</span></div>
        </div>
      </section>

      <section className="discover section-pad" id="discover">
        <div className="discover-heading"><div><div className="section-kicker"><span>02</span><i/> CURATED BEIJING</div><h2>循着城市的脉络，<br/><em>发现北京。</em></h2></div><p>从皇家气韵到市井烟火，<br/>每一处风景，都有自己的故事。</p></div>
        <div className="destination-grid">{destinations.map((item, index) => <article className="destination-card" key={item.name}><div className="destination-photo"><img src={item.image} alt={item.name}/><span className="photo-index">0{index + 1}</span><span className="photo-tag">{item.tag}</span></div><div className="destination-info"><div><small>{item.en}</small><h3>{item.name}</h3><p>{item.desc}</p></div><div className="destination-foot"><span><CalendarDays size={13}/> {item.time}</span><button aria-label={`规划${item.name}行程`} onClick={() => startPlanning(`我想去${item.name}，请帮我安排周边行程`)}><ArrowUpRight size={18}/></button></div></div></article>)}</div>
        <div className="center-action"><button className="outline-button" onClick={() => startPlanning("帮我探索北京值得去的地方")}>探索更多目的地 <ArrowRight size={16}/></button></div>
      </section>

      <section className="planner-band" id="about"><div className="planner-text"><div className="section-kicker light"><span>03</span><i/> YOUR JOURNEY, REIMAGINED</div><h2>北京很大，<br/><em>不必一个人做攻略。</em></h2><p>把想去的地方、同行的人、心里的预算告诉京途。<br/>剩下的交给 AI，一起把旅程安排妥当。</p><button className="button-gold" onClick={() => startPlanning()}>和京途聊一聊 <ArrowRight size={17}/></button></div><div className="planner-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-seal">京<span>途</span><small>AI TRAVEL</small></div><div className="art-caption">TRAVEL WITH<br/>A LITTLE MORE MEANING.</div></div></section>
    </main>

    <footer><a className="brand footer-brand" href="#"><span className="brand-seal">京</span><span><b>京途 AI</b><small>JINGTU · BEIJING TRAVEL</small></span></a><span>让 AI 理解每一位游客，让北京之旅更智能。</span><span>© 2026 JINGTU AI</span></footer>

    {plannerOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setPlannerOpen(false); }}><section className="planner-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setPlannerOpen(false)} aria-label="关闭"><X/></button><div className="modal-kicker"><Sparkles size={15}/> JINGTU AI · TRAVEL ASSISTANT</div><h2 id="modal-title">下一站，去北京。</h2><p className="modal-desc">说说你的旅行想法，京途会帮你整理成一份专属计划。</p>{submitted ? <div className="submitted"><div className="success-mark"><Sparkles/></div><h3>需求已整理</h3><p>这是首页交互演示。接入 AI 服务后，这里将进入智能需求补全与行程生成流程。</p><button className="button-red" onClick={() => { setSubmitted(false); setPlannerOpen(false); }}>好的，知道了</button></div> : <><label className="field-label">你想怎样开启这趟旅程？</label><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="例如：我和朋友计划周末去北京玩三天，想看故宫和长城，人均预算 2000 元……"/><div className="quick-prompts">{quickPrompts.map(q => <button key={q} onClick={() => setPrompt(q)}>{q}</button>)}</div><div className="form-row"><label><span>出行天数</span><select value={days} onChange={e => setDays(e.target.value)}><option>2 天</option><option>3 天</option><option>4 天</option><option>5 天</option><option>7 天</option></select></label><label><span>人均预算</span><select value={budget} onChange={e => setBudget(e.target.value)}><option>人均 1000 元</option><option>人均 2000 元</option><option>人均 3000 元</option><option>人均 5000 元</option><option>预算灵活</option></select></label></div><button className="button-red modal-submit" onClick={() => setSubmitted(true)} disabled={!prompt.trim()}>整理我的旅行需求 <ArrowRight size={17}/></button><small className="privacy-note">当前为首页交互原型，尚未连接真实 AI 接口。</small></>}</section></div>}
  </div>;
}