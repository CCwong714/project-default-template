# SatyrGate 组件规格

- 至少 100vh，中心 jungle SVG 与 Satyr Lottie 叠加；图片高度约 35vh。
- 场景上方为累积对话，场景下方为叙述和 240×40px 珊瑚色按钮。
- Listen 点击后立刻消失；约 0/2/4/6 秒依次显示四段台词；约 7.6 秒显示 Attack。
- Attack 后显示全屏短闪，并播放 punch Lottie；约 1/2.8/4.4 秒显示三段收尾台词；约 5.2 秒标记 done。
- 时间线必须在组件卸载时清理所有 timer。
