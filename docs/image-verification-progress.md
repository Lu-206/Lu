# 图片核验进度

本轮先记录与地点明确对应的候选图。候选图在完成许可证/平台使用条款核验前，不进入 `public/assets`，也不替换线上卡片。

## 已找到候选

| 地点 | 候选来源 | 图片内容 | 下一步 |
|---|---|---|---|
| 天坛公园 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AHall_of_Prayer_for_Good_Harvest.JPG) | 祈年殿实景 | 核对公版授权并下载 |
| 中山公园 | [北京市政府天安门地区管理委员会](https://tamgw.beijing.gov.cn/diqufuwu/zjtam/201912/W020210812394954085631.jpg) | 中山公园保卫和平坊 | 核对图片使用条件 |
| 玉渊潭公园 | [Wikimedia Commons 分类](https://commons.wikimedia.org/wiki/Category:Yuyuantan) | 樱花、湖面和园区实景 | 选择具体文件并核对授权 |
| 故宫博物院 | [北京旅游官方文章](https://www.visitbeijing.com.cn/article/4A2VLfZBM3t) | 午门和故宫入口 | 核对文章图片授权 |
| 颐和园 | [Pelago 景点页](https://www.pelago.com/th/activity/pg9dp-beijing-summer-palace-entrance-ticket-with-optional-guided-service-beijing/) | 昆明湖石桥和游船 | 不能直接复制，寻找 Commons/官方授权版本 |
| 什刹海 | [北京日报游船报道](https://xinwen.bjd.com.cn/content/s67d4fdd9e4b068c68f11082d.html) | 什刹海游船 | 核对图片使用条件 |
| 五道营胡同 | [携程景点页](https://you.ctrip.com/sight/beijing1/108461.html) | 带“五道营胡同”标识的街景 | 不能直接复制，寻找可授权版本 |
| 护国寺小吃 | [Top China Travel](https://www.topchinatravel.com/beijing/china-travel-top-reasons-to-visit-beijing.htm) | 带“护国寺小吃”门头 | 核对图片授权或寻找官方版本 |
| 四季民福 | [北京日报报道](https://news.bjd.com.cn/2023/07/07/10488116.shtml) | 带“四季民福烤鸭店”门头 | 不能直接复制，寻找官方门头图 |
| 南门涮肉 | [中国品牌网报道](https://www.cbrand.com.cn/content-13-32114-1.html) | 带“南门涮肉”牌匾 | 核对图片授权或寻找官方版本 |
| 王府井文华东方酒店 | [搜狐酒店介绍](https://www.sohu.com/a/785723277_381525) | 酒店外观 | 核对图片授权或使用官方媒体素材 |
| 北京饭店 | [北京市政府酒店介绍](https://japanese.beijing.gov.cn/travellinginbeijing/accommodation/202012/t20201230_2190393.html) | 北京饭店外观 | 核对图片使用条件 |
| 东直门智选假日酒店 | [IHG 官方页面](https://www.ihg.com/holidayinnexpress/hotels/us/en/beijing/pegdz/hoteldetail) | 酒店外观 | 核对官方素材使用条款 |
| 前门大街亚朵酒店 | [Booking 页面](https://www.booking.com/hotel/cn/bei-jing-qian-men-da-jie-ya-duo-jiu-dian.de.html) | 酒店外观 | 不能直接复制，寻找亚朵官方素材 |

## 尚未找到可直接使用的图片

其他景点、其余餐厅和 16 家酒店仍需逐条搜索。当前代码中的复用图不视为核验通过，后续会替换或暂时隐藏，避免出现地点与图片不一致。

## 使用规则

- 搜索结果可以用于确认地点，但平台用户图不能直接下载进项目。
- Wikimedia Commons 需要记录具体文件、作者和许可证。
- 官方网站图片需要确认媒体使用条款；不能因为图片来自官方页面就默认可以再发布。
- 没有可确认来源的条目显示“待补图片”，不使用其他地点图片占位。

## 已下载到本地（第一批）

- `public/assets/verified/temple-heaven.webp`：天坛祈年殿，Wikimedia Commons 公版候选。
- `public/assets/verified/zhongshan-park.jpg`：中山公园保卫和平坊，北京市政府页面图片。
- `public/assets/verified/huguosi-sign.jpg`：护国寺小吃门头，Top China Travel 来源。
- `public/assets/verified/siji-minfu-sign.jpg`：四季民福烤鸭店门头，北京日报来源。
- `public/assets/verified/hotel-dongzhimen.jpg`：东直门智选假日酒店，IHG 官方图片。
- `public/assets/verified/hotel-beijing.jpg`：北京饭店，北京市政府页面图片。

这些资源仅用于本地私用演示，来源链接已保留；其余卡片仍待逐条替换。
