# AdventurePage 组件规格

## 职责

页面级状态机，管理 `messageStep`、`inventoryStep`、`satyrPhase`、`finaleUnlocked`，并决定后续章节是否挂载。它不直接绘制复杂场景。

## 状态

- `messageStep: 'closed' | 'opened' | 'replied'`
- `inventoryStep: 0 | 1 | 2 | 3`
- `satyrPhase: 'idle' | 'listening' | 'ready' | 'attacking' | 'done'`

## 不变量

- `messageStep !== 'replied'` 时不得挂载 Chapter 1。
- `inventoryStep < 3` 时不得挂载 Journey。
- `satyrPhase !== 'done'` 时不得挂载 Finale。
- 每次解锁使用 `aria-live` 提示，但不自动抢夺焦点。
