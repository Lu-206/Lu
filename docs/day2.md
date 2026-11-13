# Day 2 · DeepSeek 旅行需求智能体

## 范围与任务修订

保留 Day 1 首页、摄影、视差和景点交互，复用摄影侧栏规划弹窗。今天完成需求收集与确认，不提前声称生成真实行程、查询票价或完成预订。

原任务增加以下验收约束：

- 人数不猜测；总预算与人均预算明确区分。仅说“预算 8000”时追问口径。
- 未填写条件保持未知，删除旧表单默认的 3 天、2000 元与轻松节奏。
- 用户明确说“日期未定”“预算灵活”可结束对应追问。
- 必需项：目的地、人数、天数、预算及口径、出发日期或日期灵活。兴趣、住宿、节奏可选，不反复逼问。
- 新要求覆盖旧要求；当前需求优先于保存偏好。失败的 AI 响应不更新会话。
- 长期偏好由用户查看、编辑并主动保存，不自动保存整个对话。

## 本地启动（Windows PowerShell）

需要 Node.js 22.19 或更新的 LTS 版本，建议 Node 24 LTS。先进入项目目录。

```powershell
cd C:\Users\ASUS\Lu
npm.cmd ci
Copy-Item .env.example .env
notepad .env
```

仅首次创建 .env 时复制示例；已配置过不要覆盖。在本地编辑器填写：

```dotenv
DEEPSEEK_API_KEY=在本机填写你的真实密钥
AI_BASE_URL=https://api.deepseek.com/v1
AI_MODEL=deepseek-chat
API_PORT=3001
COOKIE_SECURE=false
```

从 DeepSeek 开放平台获取并确保账户可用：https://platform.deepseek.com/ 。不要在聊天、截图、源码、GitHub 或以 VITE_ 开头的变量中放密钥。.env 已被 Git 忽略。

```powershell
npm.cmd run dev
```

此命令同时启动 API（127.0.0.1:3001）与 Vite（默认 5173）。打开 Vite 实际打印的地址。关闭之前的开发服务，避免端口被占用。3001 应保持默认值以匹配 Vite 代理；若改端口，同时修改 vite.config.ts 中代理目标。

API 会从 .env 读取密钥；修改 .env 后停止并重新启动服务。未配置密钥时首页仍可浏览，发送消息会明确显示 AI_NOT_CONFIGURED，不会返回模拟成功回复。

## 模块

- shared/travel.ts：TypeScript + Zod 共享模型，严格字段、长度、合法日期、人数/日期/预算一致性校验，服务端必需条件规则。
- server/model.ts：真实 DeepSeek Chat Completions，JSON 输出模式、35 秒超时、上游数据上限和结构化校验。只传最近 12 条历史及完整当前需求，避免上下文无限增长。
- server/app.ts：POST /api/chat、GET /api/health。客户端仅提交本轮消息、会话 ID 和首次可选偏好，不可传入助手角色或伪造服务端需求。
- src/hooks/useTravelChat.ts：请求状态、失败重试、显式保存/清除偏好，版本化 localStorage 数据读取与校验。
- PlannerDialog.tsx：保留摄影侧栏，加入多轮对话、最多两个追问、实时需求摘要、偏好编辑器。

模型负责理解自然语言、更新完整需求和生成确认语；服务端负责校验、判定是否齐全并生成确定的缺失条件追问。这里的规则问句不是模拟 AI 回复；没有成功模型调用就不会出现成功对话。

JSON 数据包括 destination、people（total/adults/children）、days、budget（amount/scope/currency/flexible）、dates（startDate/endDate/flexible）、interests、dietaryRestrictions、transportPreferences、accommodation（style/area/nightlyBudget）、pace。金额人民币元，日期 ISO YYYY-MM-DD，未知值为 null 或空数组。

响应包含 conversationId、reply、requirements、missing、questions、status（collecting/ready/out_of_scope）。需求齐全仅表示可用于下一阶段规划，不代表行程已经生成。

## 偏好和会话

偏好仅保存兴趣、忌口、交通、住宿类型/区域、节奏，不保存日期、人数或本次预算。用户可取消新对话复用、手动修改或清除；复用时随消息发送给 DeepSeek。仅当前浏览器保存，不等于登录账号、数据库或跨设备同步。

聊天记录和结构化状态保存在 API 内存中，通过 HttpOnly / SameSite=Strict Cookie 绑定；关闭弹窗后仍可继续，刷新页面会开始新的前端会话，闲置两小时或重启服务后旧会话失效。最多 40 轮；过期/达上限后明确提示新建。偏好不因刷新或服务重启丢失。不会把对话或上游错误正文写入日志。

服务端限制 24KB 请求、每 IP 每分钟 20 次请求、4 个并发模型调用、200 个驻留会话。同源限制和输入校验用于本地开发。此版 API 默认只监听本机；正式部署需同源反向代理 /api、HTTPS、COOKIE_SECURE=true，另加登录、按用户配额及持久数据库后再开放公共调用。npm run preview 仅预览静态构建，不提供 API 代理。

## 错误处理

未配置密钥、认证失败、余额不足、限流、超时、网络错误、模型输出无效、会话过期都有明确错误码和中文提示。请求失败保留输入，已有有效需求和历史不变。没有固定模拟回复、假行程或模拟数据回退。

## 验证与验收

```powershell
npm.cmd test
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run test:live
```

单元/接口测试使用显式测试 transport 和网络拦截，覆盖状态合并、偏好、预算歧义、人数/日期、会话隔离与失效、错误响应和失败回滚。浏览器测试分桌面 1440 和手机 390，测试追问、修改、保存/清除、刷新读取、新会话复用，以及真实无密钥服务的错误界面。它们均不证明模型的真实语言理解能力；测试夹具只在测试文件内启用，生产代码没有模拟开关。

test:live 通过真实 DeepSeek API 依次验证“首轮结构化 → 修改天数与总预算并保留忌口 → 模糊输入保持缺失”。它会消耗三次模型调用。未配置密钥时明确退出码 2，不能视为通过。当前开发环境未提供密钥，真实模型验收尚待在本地配置后执行。

手工验收：

1. 输入“带家人去北京，预算8000”：不能猜人数，应追问人数和预算口径。
2. 补充“两位成人，三天，总预算8000，日期未定，不吃花生，节奏轻松”：摘要应齐全，忌口正确。
3. 输入“改成五天，人均3000，其他不变”：只更新天数及预算，保留人数、忌口、节奏。
4. 编辑并保存偏好，刷新、新建对话，检查复用；清除后刷新确认消失。
5. 使用无效密钥或断开 API，确认显示真实错误、保留输入、不出现成功摘要。

## Trip.com 的边界

ChatGPT 的 Trip.com 插件可在本次聊天中协助查询产品，不能作为网站自动获取插件凭据或长期调用的后端。Day 3 再选择景点/地图真实数据接口；商业票务、酒店、交通搜索需独立申请官方 API/合作资质。Day 2 不抓取网页、不伪造实时价格或库存。
