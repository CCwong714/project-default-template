# Page topology

The experience uses one fixed WebGL canvas plus fixed DOM overlays. A long scroll
document drives 20 source-authored sections:

|   # | Act                     | Logical units | Normalized range |
| --: | ----------------------- | ------------: | ---------------: |
|   1 | Hero                    |           100 |    0.0000–0.0236 |
|   2 | Hero dissolve           |           150 |    0.0236–0.0591 |
|   3 | Shifting                |           300 |    0.0591–0.1300 |
|   4 | Guidance                |           300 |    0.1300–0.2009 |
|   5 | Guidance transition     |           200 |    0.2009–0.2482 |
|   6 | Narrative               |           300 |    0.2482–0.3191 |
|   7 | Emergence               |           500 |    0.3191–0.4374 |
|   8 | Light                   |           200 |    0.4374–0.4846 |
|   9 | Spirit                  |            80 |    0.4846–0.5035 |
|  10 | Sound                   |            80 |    0.5035–0.5225 |
|  11 | Invitation              |           170 |    0.5225–0.5626 |
|  12 | Night transition        |           190 |    0.5626–0.6076 |
|  13 | Principles              |           280 |    0.6076–0.6738 |
|  14 | Principles continuation |            50 |    0.6738–0.6856 |
|  15 | Principles finale       |            50 |    0.6856–0.6974 |
|  16 | Experiences             |           100 |    0.6974–0.7210 |
|  17 | Crystals                |           140 |    0.7210–0.7541 |
|  18 | Spark and fire          |           560 |    0.7541–0.8865 |
|  19 | Ember Phoenix           |           200 |    0.8865–0.9338 |
|  20 | Contact                 |           280 |    0.9338–1.0000 |

The exact machine-readable map is `.clone-ui/plan/section-map.json`.

## Responsive topology

- Desktop and mobile share the narrative order.
- Each viewport loads its source-authored camera timeline.
- Mobile replaces desktop navigation with a glass `Menu` pill and source
  full-screen menu.
- The final footer appears over the ember Phoenix.
