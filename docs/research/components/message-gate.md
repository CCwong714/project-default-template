# MessageGate 组件规格

- 100vh 深色舞台，中心手机卡为 350×600px 上限，背景 `#1e2029`。
- 顶部通知图标约卡宽 20%，粉色未读圆点。
- `closed`：消息区为空，底部显示绿色 Open。
- `opened`：显示 Hortensia SVG 消息，底部显示 Reply。
- `replied`：短暂显示回复 loading，再显示 Gus SVG 与向下提示。
- Open 与 Reply 都必须阻止默认锚点跳转。
- Reply 后的继续提示不是 CSS 线条箭头。原站使用
  `5eb31b3ecf9abc7da7fe9bde_fleche_V2.json`，外层链接为
  `40×40px`，目标是 `#chap-01`。
- 手机处箭头以 `0.8s` 播放一轮（素材默认时长 `1s`，即
  `playbackRate=1.25`）并循环；解锁后延迟 `100ms`，用 `1s` 淡入。
- Reply 的 loading 先独立出现，约 `1.5s` 后才切换为 Gus 回复并挂载
  Chapter 1，避免后续场景在回复动画期间提前进入文档。
