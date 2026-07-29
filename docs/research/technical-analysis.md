# A Tiny Adventure：原站技术拆解

## 1. 技术栈

原站是 Webflow 导出的静态网站。页面入口由 Webflow HTML 组成，样式来自一份站点级压缩 CSS，交互由 jQuery 3.5.1 与 Webflow Interactions 2（IX2）驱动。所有复杂画面都由普通 DOM、SVG、PNG 和 Bodymovin/Lottie JSON 组成；现场检测到 33 个内联 SVG、0 个 canvas，没有视频播放器。

- HTML：按章节排列所有叙事场景，并通过 `cache-01`、`cache-02`、`cache-03` 三组 class 控制章节解锁。
- CSS：负责深色舞台、全屏与超长滚动区、sticky 场景、断点布局和按钮视觉。
- Webflow IX2：把滚动进度、点击事件与 opacity/transform/display/Lottie 帧关联起来。
- Lottie：加载 27 个 JSON 动画，包括壁炉预加载、湖水、角色、背包、路径、树叶、山羊人、拳击、结尾等。
- 字体：Inter 用于正文和 UI，Montserrat 用于数字，Merriweather 用于章节的手写/斜体语气。

原始取证文件：

- `docs/research/original.html`：页面结构、文案、所有素材引用与 Lottie 参数。
- `docs/research/original-webflow.css`：原站视觉规则与 479/767/991/1280/1440/1920px 断点。
- `docs/research/original-webflow.js`：Webflow 运行时和 IX2 交互数据。
- `docs/research/live-extraction.json`：浏览器现场 DOM、样式、网络资源清单。
- `public/assets/unemini/original/asset-manifest.json`：67 个已本地化公开素材的来源、大小与状态。

## 2. 页面结构

1. `header`：2250px 的开场滚动区域。第一屏显示图案壁纸、双语旗帜、CSSDA 徽章、Logo 和滚动提示；后半段显示 Sartre 引言。
2. `histoire`：叙事主线，初始只开放湖边、湖景和手机消息。
3. `message`：手机卡片，`Open` 后出现 Hortensia 消息，`Reply` 后出现 Gus 回复，并解锁 `cache-01`。
4. `cache-01`：Chapter 1、Gus 收拾行装与三件物品的背包场景。
5. `cache-02`：Go、云层、超长等距地图旅程、Chapter 2、树林和 Satyr 场景。
6. `cache-03`：Chapter 3、回家、昼夜变换、The End 与联系表单。

## 3. 视觉系统

- 主背景：`#12141d`
- 卡片背景：`#1e2029`
- 成功绿：`#3ccf91`
- 路径蓝：`#3c5ccf`
- 通知粉：`#f63985`
- Satyr 珊瑚橙：`#ff715b`
- 正文字号：15px / 18px，标题多为 16px / 30px
- 按钮：40px 高，消息按钮 5px 圆角，物品按钮胶囊圆角，Satyr 按钮 240×40px

桌面场景以横向 SVG 为主；479px 以下切换为竖向湖景/结尾 SVG、竖排物品卡、移动端壁纸，并隐藏横向结尾画面。

## 4. 交互模型

原站并不全局禁用滚轮。未解锁章节直接为 `display:none`，文档在门槛处自然到达底部，因此用户无法继续下滑。点击完成后，下一组章节改为 `display:flex`，文档高度增长，滚动自然恢复。

消息门槛：

`Open → Hortensia 消息 → Reply → Gus 回复 → cache-01`

物品门槛严格串行：

`Compass Take → Compass OK / Map Take → Map OK / Potion Take → 全部 OK → cache-02`

Satyr 门槛：

`Listen → 约 8 秒累积显示四段台词 → Attack 出现 → Attack → 拳击和三段结尾台词 → cache-03`

## 5. React 复刻策略

复刻版保留原站信息架构、素材、色彩、断点和门槛语义，但把 Webflow 的隐式 class 切换改为显式 React 状态机。这样每个门槛都可测试、可访问，也不会依赖压缩后的 Webflow 运行时。

- 未解锁章节不挂载，复刻原站的文档高度锁。
- Lottie 使用本地 JSON，由一个统一的 `LottieAsset` 组件延迟读取。
- 滚动场景以 CSS `position: sticky` 和长 section 实现。
- `prefers-reduced-motion` 下禁用非必要动画并缩短时间线。
- 交互按钮使用真正的 `button`，带明确 `aria-label` 与 focus 样式。
- 所有大型静态数据放入 `src/features/home/data/adventureData.ts`，与行为组件分离。

## 6. 复刻版逐文件代码地图

| 文件                  | 职责                                                                             |
| --------------------- | -------------------------------------------------------------------------------- |
| `HomePage.tsx`        | 路由入口，只挂载完整冒险页面。                                                   |
| `AdventurePage.tsx`   | 顶层状态机；保存消息、背包和结尾的解锁状态，并决定哪些章节进入 DOM。             |
| `HeroScene.tsx`       | Logo、语言入口、CSSDA 徽章、滚动提示和 Sartre 引言。                             |
| `LakeScene.tsx`       | 湖边正文、波纹、横竖屏湖景和钓鱼滚动舞台。                                       |
| `MessageGate.tsx`     | `closed / opened / replied` 三态手机门槛与 1.2 秒回复动画。                      |
| `ChapterScene.tsx`    | 复用 Chapter 1/2/3 的数字、标题和 Lottie 背景。                                  |
| `TravelPrepScene.tsx` | Gus 收拾行装的角色动画与章节过渡。                                               |
| `InventoryGate.tsx`   | 由 `completed` 数字派生当前物品、禁用状态、OK 状态和解锁信号。                   |
| `JourneyScene.tsx`    | Go 动画、云层、地图、路线和旅途文案。                                            |
| `ForestScene.tsx`     | 树丛显现、问号和 Satyr 前的悬念。                                                |
| `SatyrGate.tsx`       | `idle / listening / ready / attacking / done` 五态时间线，统一清理所有 timeout。 |
| `FinaleScene.tsx`     | 回家、夜景、火光、The End 与本地成功态联系表单。                                 |
| `LottieAsset.tsx`     | 按需 import `lottie-react`、缓存 JSON Promise、处理加载占位和失败降级。          |
| `Preloader.tsx`       | 首屏 1.8 秒预加载视觉与状态播报。                                                |
| `adventureData.ts`    | 资产 URL、物品清单、地图事件、Satyr 台词；不包含行为。                           |
| `adventure.css`       | 颜色 token、sticky 场景、断点、门槛布局、焦点与 reduced-motion 规则。            |
| `App.test.tsx`        | 验证首屏和 `Open → Reply → Compass → Map → Potion → Satyr` 顺序。                |

## 7. 状态与性能细节

`AdventurePage` 不保存可以从其他状态推导出的重复布尔值：

- `chapterOneUnlocked = messageStep === 'replied'`
- `chapterTwoUnlocked = inventoryStep === inventoryItems.length`
- `finaleUnlocked` 只在 Satyr 收尾完成后变为 `true`

后续章节使用条件渲染而不是 CSS 隐藏。这同时实现了原站的滚动锁、减少
初始 DOM 体积，也让后续 Lottie 在解锁前完全不请求。`LottieAsset`
再把播放器拆成独立异步 chunk，并以 URL 为键缓存 JSON 请求，避免相同动画重复下载。

所有按钮都使用原生 `button`。物品门槛以原生 `disabled` 表达不可操作状态；
消息、物品和章节解锁通过 `aria-live="polite"` 播报。图片声明固有尺寸，
首屏 Logo 使用高优先级加载，其余长页素材延迟加载。CSS 动画仅改变
`transform`、`opacity` 或 `visibility`，并在 `prefers-reduced-motion`
下缩短为近乎即时。
