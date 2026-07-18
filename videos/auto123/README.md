# Auto123 case study — video slots

Drop `.mp4` files in **this folder** using the exact filenames below.

The page checks for each file on load. If it exists, that panel automatically becomes
a looping, muted, autoplaying `<video>` (only the one on screen decodes). If it does
not exist, the exported still image is shown instead — so the page always looks complete.

**No code change needed. Upload the file and hard-refresh (Ctrl+Shift+R).**

## Filenames

| File to upload            | Panel                     | Aspect ratio        |
|---------------------------|---------------------------|---------------------|
| `hero.mp4`                | Hero (top, full width)    | 16:9   (2560×1440)  |
| `tab-navigations.mp4`     | Tab navigation            | 788:985 (portrait)  |
| `ai-search.mp4`           | AI-powered search         | 788:985 (portrait)  |
| `car-details.mp4`         | Vehicle detail            | 8:5    (1600×1000)  |
| `buying-a-car.mp4`        | Buying a car              | 788:985 (portrait)  |
| `selling-a-car.mp4`       | Selling a car             | 788:985 (portrait)  |
| `filters.mp4`             | Filters                   | 8:5    (1600×1000)  |
| `token-systems.mp4`       | Token system              | 788:985 (portrait)  |
| `bg-text-tokens.mp4`      | Background & text tokens  | 788:985 (portrait)  |
| `light-mode.mp4`          | Light mode                | 8:5    (1600×1000)  |
| `dark-mode.mp4`           | Dark mode                 | 8:5    (1600×1000)  |
| `components.mp4`          | Components                | 8:5    (1600×1000)  |
| `figma.mp4`               | Figma file                | 8:5    (1600×1000)  |

Only upload the ones that should actually move — the rest stay as stills.

## Tips

- Match the aspect ratio above, or the video gets cropped (`object-fit: cover`).
- Keep them light: 1080p-ish, ~2–4 Mbps. These autoplay, so file size matters.
- The exported still doubles as the video's `poster`, so there's no flash of empty space.
