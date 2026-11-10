# 京途 AI · 沉浸式北京旅行首页

React 19 + TypeScript + Vite + Tailwind CSS + GSAP ScrollTrigger。

```sh
npm ci
npm run dev
```

打开 Vite 输出的本地链接（默认 http://localhost:5173/）。构建：`npm run build`。

## 交互

- 桌面端五幕固定舞台，滚动驱动图片缩放、位移、转场与文字错速移动。
- 鼠标驱动照片与描边文字不同方向的微视差，最大偏移 23px。
- 右侧章节按钮跳转，首屏与固定导航均可打开旅行需求表单。
- 六个景点详情、添加旅行想法、快捷需求、天数与预算选择。
- 移动端分段场景、汉堡导航；减少动态效果偏好下关闭固定滚动动画。
- 弹窗支持 Escape、焦点循环和关闭后返回原触发点。

当前 AI 规划保留为明确标记的前端演示，未连接模型、地图、预订或实时旅游数据接口。

## 设计

Figma：https://www.figma.com/design/JdRlCdP1qSNHQLTtPnIdKX
宫墙红 #8D2925 / 琉璃金 #D6B56D / 宣纸白 #F5F1E8 / 科技墨蓝 #202D3B。

图片在 public/assets 本地提供；来源与署名见 public/assets/CREDITS.md。
