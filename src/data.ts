export const scenes = [
  { id:'intro', en:'INTRO', title:'一城千面，', accent:'京彩由你。', subtitle:'发现北京，开启属于你的旅程。', description:'让 AI 读懂你的期待，让每一次出发，恰到好处。', image:'/assets/palace-classic.webp', location:'景山 · 紫禁城全景', word:'BEIJING', label:'THE BEGINNING OF YOUR JOURNEY' },
  { id:'culture', en:'CULTURE', title:'行至山海，', accent:'对话千年。', subtitle:'EXPLORE THE GREAT WALL', description:'循着群山的起伏，在一砖一石间，读懂时间的壮阔。', image:'/assets/wall-classic.webp', location:'慕田峪 · 长城', word:'EXPLORE', label:'WHERE HISTORY MEETS THE HORIZON' },
  { id:'experience', en:'EXPERIENCE', title:'走进胡同，', accent:'慢下来。', subtitle:'FEEL THE CULTURE', description:'拐进一条小巷，遇见院落、树影，和有温度的北京日常。', image:'/assets/hutong-c.webp', location:'老北京 · 胡同', word:'WANDER', label:'A LITTLE CLOSER TO EVERYDAY LIFE' },
  { id:'city', en:'CITY', title:'古都之外，', accent:'还有未来。', subtitle:'BEYOND THE CLASSIC', description:'从六百年的中轴线，到城市天际线，发现北京的另一面。', image:'/assets/city-classic.webp', location:'朝阳 · 国贸', word:'BEYOND', label:'A CITY THAT NEVER STOPS EVOLVING' },
  { id:'journey', en:'JOURNEY', title:'你的北京，', accent:'现在出发。', subtitle:'YOUR JOURNEY, REIMAGINED BY AI.', description:'把想去的地方、同行的人、心里的预算，交给京途。', image:'/assets/temple-classic.webp', location:'天坛 · 开启你的旅程', word:'JINGTU', label:'MAKE ROOM FOR THE UNEXPECTED' },
];
export const destinations = [
  { name:'故宫博物院', en:'THE PALACE MUSEUM', desc:'沿着红墙金瓦，走进六百年的时间', tag:'皇家文化', time:'建议 3–4 小时', image:'/assets/palace-sunny.webp', location:'东城区 · 景山前街', detail:'从午门出发，沿中轴线探索三大殿与宫廷院落。馆内步行较多，建议穿舒适的鞋，预留半天慢慢参观。', tip:'参观须提前核实实名预约、开放日期和入馆时段。' },
  { name:'慕田峪长城', en:'THE GREAT WALL', desc:'登高望远，在群山之间读懂壮阔', tag:'山河远行', time:'建议 4–5 小时', image:'/assets/wall-classic.webp', location:'怀柔区 · 慕田峪', detail:'沿着山势起伏的城墙行走，远眺北方群山。可结合体力选择步行路段与缆车，往返市区需单独预留交通时间。', tip:'山区天气变化较快，出行前查看天气与景区公告。' },
  { name:'天坛公园', en:'TEMPLE OF HEAVEN', desc:'在祈年殿下，感受东方秩序之美', tag:'文化漫游', time:'建议 2–3 小时', image:'/assets/temple-classic.webp', location:'东城区 · 天坛东路', detail:'祈年殿、回音壁与古柏林共同构成一段安静的文化漫游。清晨逛公园，能遇见另一种北京生活。', tip:'公园门票与部分院落门票范围不同，请核实联票与开放时间。' },
  { name:'颐和园', en:'THE SUMMER PALACE', desc:'借一湖山色，留半日闲情', tag:'园林山水', time:'建议 4–5 小时', image:'/assets/summer-scene.webp', location:'海淀区 · 新建宫门路', detail:'沿昆明湖漫步，在长廊与万寿山之间寻找皇家园林的层次。湖岸线路较长，可根据同行者体力分段游览。', tip:'游船等项目受季节与天气影响，以现场公告为准。' },
  { name:'什刹海', en:'SHICHAHAI', desc:'在水光与街巷之间，遇见慢生活', tag:'湖畔闲游', time:'建议 2–3 小时', image:'/assets/lake-classic.webp', location:'西城区 · 前海西街', detail:'沿湖岸散步，走过银锭桥，再拐进周边胡同。适合把行程留白，找一处喜欢的街角坐下来。', tip:'周末和晚间客流较多，请留意步行安全与消费价格。' },
  { name:'南锣鼓巷', en:'NANLUOGUXIANG', desc:'一条巷子，装得下京城烟火', tag:'街巷烟火', time:'建议 1–2 小时', image:'/assets/hutong-c.webp', location:'东城区 · 南锣鼓巷', detail:'从热闹主街走向两侧支巷，看青砖灰瓦与老城肌理。可与鼓楼、什刹海组合成一段步行路线。', tip:'胡同内仍有居民生活，请保持安静，尊重私人院落。' },
];
export type Destination = typeof destinations[number];
