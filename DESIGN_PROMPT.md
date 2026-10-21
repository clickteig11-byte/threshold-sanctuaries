# THRESHOLD™ — Master Design & Engineering Prompt
*Architectural Cloud Sanctuaries & Full-Screen Scroll-Driven Frame Engine*

---

> **Open-Source Base Repository:**
> This project is open-source and public. **Always pull directly from the repository:**
> ```bash
> git clone https://github.com/clickteig11-byte/threshold-sanctuaries.git
> cd threshold-sanctuaries
> npm install
> npm run dev
> ```
> Repository: `https://github.com/clickteig11-byte/threshold-sanctuaries`
> Live Vercel Target: `https://threshold-sanctuaries.vercel.app`

---

## 1. System Overview & Creative Concept

**THRESHOLD™** is an architectural sanctuary brand and digital proof-of-concept exploring physical daylight doorways and high-altitude cloud chambers inside windowless urban structures.

The experience is centered around a **240-frame 1920×1080 cinematic camera dolly** moving across a dark volcanic basalt landscape, stepping through an illuminated portal, and emerging into sunlit cumulus clouds and an expansive alpine horizon.

Instead of a generic video player, the user directly drives time and space with their scroll wheel, touch swipe, or keyboard arrows.

---

## 2. Hard-Learned Engineering Lessons

### A. The 2GB GPU Bitmap Memory Trap
* **The Failure Mode:** Calling `await img.decode()` on all 240 frames in parallel creates ~2.0 GB of uncompressed RGBA bitmaps in browser memory. Chrome and Safari immediately thrash GPU texture caches, evict textures, cause micro-stutters, and crash mobile tabs.
* **The Solution:**
  1. Do **not** force bulk `img.decode()` on every frame.
  2. Cache native `HTMLImageElement` objects in a memory map (`Map<number, HTMLImageElement>`).
  3. Draw to a single full-screen `<canvas>` with `ctx.drawImage` inside a 60fps / 120fps `requestAnimationFrame` loop.
  4. Use a nearest-neighbor fallback if the exact target frame is still downloading, ensuring zero blank flashes.

### B. Progressive Keyframe Preloading (8-Worker Concurrency Pool)
* Scrubbing cannot wait for 240 sequential downloads.
* **The Algorithm (`useFramePreloader.ts`):**
  1. Load Frame 1 immediately so the hero renders instantly.
  2. Load keyframes across the timeline in decaying strides: **Step 8 → Step 4 → Step 2 → Step 1**. Within ~250ms, keyframes across the entire journey are cached.
  3. Run an **active lookahead window** prioritized around the user's real-time playhead: `[target - 3 .. target + 16]`. As the user scrolls forward, the preloader workers aggressively prioritize incoming frames.

### C. Strict Document Scroll-Lock Physics
* **Requirement:** The user must be physically prevented from skipping down the page until they have witnessed the complete crossing (Frame 240).
* **The Implementation (`CinematicViewport.tsx` & `App.tsx`):**
  1. Set `overflow: hidden; height: 100vh` on `document.documentElement` and `document.body` while `!isUnlocked`.
  2. Intercept `wheel`, `touchmove`, and `keydown` events (`e.preventDefault()`).
  3. Apply an exponential lerp damping function:
     ```ts
     const diff = targetProgress - smoothProgress;
     const maxStepPerTick = 0.032; // brisk ~7.5 frames per 60fps tick
     const rawStep = diff * 0.28;
     const step = Math.sign(rawStep) * Math.min(Math.abs(rawStep), maxStepPerTick);
     smoothProgress += step;
     ```
  4. Only trigger `isUnlocked = true` when `desiredFrame >= TOTAL_FRAMES && smoothProgress >= 0.992`.
  5. If the user scrolls back to `window.scrollY === 0` and scrolls upward, seamlessly re-lock the document and rewind the sequence.

### D. Eliminating AI Slop & Sci-Fi Clichés
* **What Went Wrong Previously:** Early iterations defaulted to "dark mode cyberpunk AI slop": wireframe 3D boxes, neon cyan/amber drop shadows, fake tech specs (`CRI 99.6`, `TiO2 nanoparticles`, `11.2 dBA`, `L1-L4 // SOLAR EMITTER`), and dark cards below the fold.
* **Why It Felt Broken:** At Frame 240, the camera emerges into a **radiant, sunlit cloudscape and golden mountain valley**. Abruptly dumping the user back into a black cyberpunk void broke the narrative immersion.
* **The Correction:**
  1. The lower half transitions into a **Sunlit Cloud & Alabaster Palette** (`#f4efe6` base, `#181715` deep charcoal ink, `#57534e` warm stone).
  2. Replace artificial 3D wireframes with a serene, organic **drifting cumulus mist canvas** (`Portal3DScene.tsx`).
  3. Frame the content with actual sequence photography (`frame_130.jpg`, `frame_140.jpg`, `frame_155.jpg`, `frame_180.jpg`, `frame_240.jpg`).
  4. Write restrained, human, architectural editorial copy (inspired by Peter Zumthor, James Turrell, and Aman Resorts).

---

## 3. Visual & Technical Design Specs

### Typography
* **Display Font:** `Syne` (800 weight, uppercase, letter-spacing `-0.03em`, tight line-height `0.88 - 0.95`).
* **Utility / Monospace Font:** `Space Mono` (400 & 700 weight, uppercase, letter-spacing `0.14em - 0.24em`).
* **Body Font:** High-legibility system sans-serif (`-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial`).

### Color Tokens
* **Dark Passage (Hero):** `#0c0c0e` obsidian black, `#ffffff` chalk white type.
* **Cloud World (Below Fold):**
  * Surface Base: `#f4efe6` (Warm Cloud Ivory)
  * Elevated Cards: `rgba(255, 253, 250, 0.82)` with `backdrop-filter: blur(24px)`
  * Ink Primary: `#181715` (Deep Charcoal)
  * Ink Secondary: `#57534e` (Warm Stone)
  * Border Hairline: `rgba(24, 23, 21, 0.08 - 0.12)`

### Navigation Header
* Floating rectangular pill (`border-radius: 10px`, `backdrop-filter: blur(20px)`).
* Auto-adapts color: dark translucent glass in the hero, transitioning smoothly to warm frosted ivory when scrolling past the fold (`inCloudZone`).
* Zero neon glowing status dots.

---

## 4. Replication Prompt for AI Agents

When replicating or extending this project, provide this instruction:

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
