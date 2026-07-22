# Awards and Facts

## Awards hover hero

- The hero occupies one viewport height and vertically centers an interactive title area.
- The `AWARDS` wordmark spans the viewport width. At desktop widths its visual box matches the source ratio (1673 × 310), with roughly `1.39vw` horizontal and `10.19vw` vertical padding around it.
- Award artwork is not placed visibly on initial render. The source site keeps an eight-image pool hidden from layout: Laus, FWA, Awwwards, CSS Design Awards, Lovie, Mindsparkle, CSS Winner, and a second Awwwards entry.
- Fine-pointer devices listen on the title area for `mouseenter` and `mousemove`. A new image is created only after the pointer has moved more than 100px (Euclidean distance) from the previous creation point.
- Each image is chosen randomly from the hidden pool and centered on the pointer. Its base width is `17.361111vw`, random scale is `0.7–1.2`, and random rotation is `-45deg–45deg`.
- Spawned images sit above the wordmark and never intercept pointer input.
- An image remains fully visible for 1.2 seconds, then fades to zero opacity and scales to `0.5` over 300ms with a Power3-style ease before being removed.
- Touch/coarse-pointer devices do not create hover artwork; the wordmark remains clean.

## Remaining section

- Award rows use 1px separators; facts pair large numbers with short labels.
- The studio image is square on desktop and portrait-friendly on mobile.
