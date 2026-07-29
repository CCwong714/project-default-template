# A Tiny Adventure — Page Topology

## Runtime structure

The clone is a single React route with a progressively mounted document. Every
gate controls whether the next large block exists in the DOM, so a locked gate
also becomes the natural bottom of the page. This reproduces the original
Webflow page's inability to scroll past an unfinished interaction without
intercepting wheel or touch events.

| Order | Section / component | Scroll model                                            | State dependency                              |
| ----- | ------------------- | ------------------------------------------------------- | --------------------------------------------- |
| 1     | `HeroScene`         | 250vh, 100vh sticky opening followed by quote           | Always mounted                                |
| 2     | `LakeScene`         | Long sticky landscape and animated fishing sequence     | Always mounted                                |
| 3     | `MessageGate`       | 100vh centered phone card                               | `closed → opened → replied`                   |
| 4     | Chapter 1           | Sticky chapter card                                     | Mounted after `replied`                       |
| 5     | `TravelPrepScene`   | Tall character preparation scene                        | Mounted after `replied`                       |
| 6     | `InventoryGate`     | Sticky 100vh desktop / 150vh mobile                     | `Compass → Map → Potion`                      |
| 7     | `JourneyScene`      | Clouds, “Go”, route map, and event captions             | Mounted after all 3 items                     |
| 8     | Chapter 2           | Sticky chapter card                                     | Mounted after all 3 items                     |
| 9     | `ForestScene`       | Bush reveal and question mark                           | Mounted after all 3 items                     |
| 10    | `SatyrGate`         | 100vh encounter with timed dialogue                     | `idle → listening → ready → attacking → done` |
| 11    | Chapter 3           | Sticky chapter card                                     | Mounted after the attack sequence             |
| 12    | `FinaleScene`       | Walk home, night clouds, 600vh homecoming, contact card | Mounted after Satyr completion                |

## Gate state machine

```text
Open
  → Reply
    → Take Compass
      → Take Map
        → Take Potion
          → Listen to the satyr
            → timed lines at 0.0 / 1.8 / 3.7 / 5.6 seconds
              → Attack! enabled at 7.6 seconds
                → impact and closing lines
                  → final chapter mounted at 5.2 seconds
```

The unavailable inventory actions are real disabled buttons. During the Satyr
dialogue, the next action is not rendered until its timer completes.

## Visual layers

- Foundation: `#12141d`, white copy, local Inter/Merriweather/Montserrat fonts.
- Full-page frame: fixed one-pixel translucent border with rounded bottom corners.
- Sticky story scenes: foreground SVG/PNG layers plus lazily loaded Lottie JSON.
- Interaction panels: `#1e2029` and `#20232f`; green, blue, pink, and orange
  accents match the extracted Webflow palette.
- Satyr dialogue phase: a 50vh upper panel is revealed while the story art and
  button remain aligned to the viewport.

## Responsive variants

- Desktop: horizontal inventory cards and landscape story art.
- Tablet: preserved horizontal inventory with reduced card margins and scaled map.
- Mobile: stacked inventory rows, portrait lake and homecoming art, narrower phone,
  hidden decorative progress rail, and safe-area-aware controls.

## Asset and code dependencies

- 67 source assets downloaded from the original deployment, including 29 Lottie
  animations and the original SVG/PNG artwork.
- `lottie-react` is dynamically imported only when animation content is needed.
- Animation JSON requests are cached by URL in `LottieAsset`.
- Static story and asset declarations live in
  `src/features/home/data/adventureData.ts`; visual behavior lives in
  `src/features/home/adventure.css`.
