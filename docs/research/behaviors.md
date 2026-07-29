# 原站行为与验收基线

## 实测门槛

| 状态           | 原站文档高度（1440×900） | 允许动作                       | 解锁结果                                     |
| -------------- | -----------------------: | ------------------------------ | -------------------------------------------- |
| 初始消息门槛   |                  8,190px | Open                           | 显示第一条消息与 Reply；仍不能进入 Chapter 1 |
| Reply 完成     |                 12,825px | Reply                          | 解锁 Chapter 1、行装与背包                   |
| 物品门槛       |                 12,825px | 依次 Take Compass、Map、Potion | 前一件显示 OK，下一件才可点击                |
| 三件完成       |                 37,395px | 向下滚动                       | 解锁 Go、地图旅程、Chapter 2、树林和 Satyr   |
| Satyr 初始     |                 37,395px | Listen to the satyr            | 隐藏 Listen，按时间累积显示四段台词          |
| Satyr 对话结束 |                 37,395px | Attack !                       | 播放攻击与结尾台词，解锁 Chapter 3           |
| Attack 完成    |              约 50,895px | 向下滚动                       | 回家、The End、联系表单                      |

## Satyr 时间线

以用户第二段录像为视觉基线：

- 0.0s：`Satyr / Hey !`
- 约 2.0s：`What a pretty good bag you have here...`
- 约 4.0s：`Would you like…`
- 约 6.0s：`… to give me !`
- 约 7.5–8.0s：显示 `Attack !`
- Attack 后：白色冲击闪屏与拳击动画
- 随后：`Gus / Take that instead !`
- 再随后：`Satyr / Ouch ! No need to get upset…`
- 最后：`Satyr / You can go...`，解锁 Chapter 3

## 关键视觉截图

- `docs/design-references/original-desktop-1440.png`
- `docs/design-references/original-mobile-390.png`
- `docs/design-references/gate-open-original.png`
- `docs/design-references/gate-reply-original.png`
- `docs/design-references/gate-inventory-original.png`
- `docs/design-references/gate-inventory-1-original.png`
- `docs/design-references/gate-inventory-2-original.png`
- `docs/design-references/gate-inventory-3-original.png`
- `docs/design-references/gate-listen-original.png`
- `docs/design-references/gate-post-attack-original.png`
- `docs/design-references/finale-original.png`

## 验收路径

1. 页面加载显示环形预加载器，然后进入 Hero。
2. 未点击 Open 时，无法滚动进入 Chapter 1。
3. 点击 Open 后只出现 Reply，仍无法进入 Chapter 1。
4. 点击 Reply 后可到背包；Map 和 Potion 初始不可点击。
5. Compass、Map、Potion 依序完成后才出现后续旅程。
6. 未点击 Listen 时无法越过 Satyr。
7. Listen 后必须等待完整四段台词，Attack 才出现。
8. Attack 的收尾时间线完成后，Chapter 3 才挂载。
9. 桌面与 390px 手机布局都不横向溢出，联系表单可聚焦与填写。
