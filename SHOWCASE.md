# Project Showcase: THRESHOLD™ Cloud Sanctuaries
*Scroll-Driven 240-Frame Cinematic Gateway & Architectural Cloud Atmosphere*

---

## Live Demo & Repository
* **Live Deployment:** [threshold-sanctuaries.vercel.app](https://threshold-sanctuaries.vercel.app)
* **GitHub Repository (Public):** [github.com/clickteig11-byte/threshold-sanctuaries](https://github.com/clickteig11-byte/threshold-sanctuaries)
* **Stack:** React 18, Vite 5, TypeScript, Canvas 2D, Vercel

---

## Interactive Embed

Embed this responsive iframe directly on your portfolio or showcase site:

```html
<!-- THRESHOLD™ Interactive 3D/Canvas Scroll Embed -->
<div style="position: relative; width: 100%; aspect-ratio: 16/9; min-height: 600px; max-height: 90vh; border-radius: 14px; overflow: hidden; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25); border: 1px solid rgba(0, 0, 0, 0.1);">
  <iframe
    src="https://threshold-sanctuaries.vercel.app"
    title="THRESHOLD™ Cloud Sanctuaries"
    loading="lazy"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
  ></iframe>
</div>
```

---

## Project Highlights

1. **240-Frame Full-Screen Dolly Sequence:**
   * A camera moves across Icelandic volcanic basalt, steps through a glowing light aperture, and emerges above golden-hour clouds overlooking an alpine valley.
   * Frame-by-frame scrub speed is driven entirely by scroll physics, touch swiping, or keyboard navigation.
2. **Zero-Slop Architectural Cloud Transition:**
   * Stepping through the doorway releases the viewport lock and transitions into a tranquil, warm alabaster (`#f4efe6`) and charcoal editorial layout.
   * Background features real sequence photography (`frame_130.jpg`, `frame_140.jpg`, `frame_155.jpg`, `frame_180.jpg`) paired with a custom drifting cumulus canvas.
3. **Adaptive Floating Pill Navigation:**
   * Rectangular pill header (`border-radius: 10px`, translucent blur) that smoothly transforms from dark glass into warm frosted ivory as you scroll into the cloud rooms below.
4. **60 FPS Memory Architecture:**
   * Custom 8-worker preloader with stride keyframing (`8 → 4 → 2 → 1`) and active lookahead (`[target - 3 .. target + 16]`).
   * Eliminates the 2.0GB GPU texture memory crash caused by bulk `img.decode()`.

---

## Project Replication & Design Prompt

```markdown
Build a high-performance scroll-driven cinematic website based on:
https://github.com/clickteig11-byte/threshold-sanctuaries

1. Pull code directly from https://github.com/clickteig11-byte/threshold-sanctuaries.git
2. Use the 240-frame sequence located in public/frames/ (frame_001.jpg to frame_240.jpg).
3. Do not decode all frames simultaneously; follow useFramePreloader.ts with an 8-worker stride preloader (steps 8 -> 4 -> 2 -> 1) and localized lookahead window.
4. Render on a single 2D canvas with DPR clamping (max 2) and focal height lerp.
5. Lock the window scroll until frame 240 is reached (smoothProgress >= 0.992).
6. Transition from the dark basalt opening sequence into a luminous, sunlit cloud-themed architectural editorial below the fold (no neon glowing AI slop, no 3D wireframe boxes).
7. Ensure clean Vercel deployment with long-term immutable caching on /frames/(.*).
```

---

## Local Development & Setup

```bash
# 1. Clone the open repository
git clone https://github.com/clickteig11-byte/threshold-sanctuaries.git
cd threshold-sanctuaries

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Create production build
npm run build
```

---
*Created for the THRESHOLD™ Architectural Cloud Sanctuary Showcase.*
