# 京途 AI：ThreeUI 筛选与主题改造

检索仓库：https://github.com/MengTo/threeui
审阅版本：68802d5428071ada5c20db8094b1649e6bb770ed（GitHub main 检索时的提交）。

| 模板 | 筛选结论 | 京途改造 |
| --- | --- | --- |
| Topo Field | 采用地形线 shader | 金色等高线与墨蓝底色；容器内鼠标响应；限制 DPR；离屏与后台停止；减少动态效果时静止 |
| Gateway Flow | 借鉴连接与流动的交互思路，未复制原模板代码 | 把复杂的信息汇聚转成可操作的中轴漫游节点，点击故宫、景山、鼓楼查看地点说明 |
| Thinking Button | 借鉴环绕光轨，未复制原模板代码 | CSS 金色光轨围绕宫墙红提交按钮；禁用时停止；保持原生按钮与键盘语义 |
| Editorial Intro Section | 参考编辑式版面组织 | 改为北京摄影＋功能选择器＋联动体验面板，避免原模板内容和品牌进入京途 |
| Sylva Hero | 未采用 | 原生物景观和资产不适合北京文化主题，也无需为内容表单引入完整 3D 场景 |

Topo Field 原始源码：
https://github.com/MengTo/threeui/blob/main/src/shaders/neuform-isolated/sources/topo-field.html

参考模板：
- https://github.com/MengTo/threeui/blob/main/src/shaders/neuform-isolated/sources/gateway-flow.html
- https://github.com/MengTo/threeui/blob/main/src/shaders/neuform-isolated/sources/thinking-button.html
- https://github.com/MengTo/threeui/blob/main/src/shaders/section-elements/SectionElements.tsx

地形 shader 按 MIT 使用并保留署名，完整许可见 public/assets/THREEUI-LICENSE.txt。参考模板的网页内容、外部字体和远程图片未复制到京途。

## 图片筛选

检查了 Wiki Loves Monuments 参赛照片与 Commons 推荐图片。选择参赛作品不代表其获奖，不把页面标为“获奖摄影”。保留原有未替换场景，仅加入与排版匹配的照片：

- 故宫落日：戏剧性的天光和金色建筑，用于开场与体验台。
- 故宫雪景：WLM 2013 参赛作品，红墙飞雪用于规划弹窗。
- 故宫全景：WLM 2017 参赛作品，用于中轴线示意及最后一幕。
- 天坛建筑特写：用于规划主题与目的地封面。

来源、摄影师与逐张许可见 public/assets/CREDITS.md。所有展示图均为本地文件。

当前规划、预算分配和旅途问答仍是前端交互示意，未接入 AI、地图、预订或实时数据。
