# THRESHOLD™ — Architectural Cloud Sanctuaries
*A full-screen scroll-driven cinematic frame engine and architectural daylight sanctuary experience.*

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://threshold-sanctuaries.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

**THRESHOLD™** is an architectural sanctuary brand and digital proof-of-concept exploring physical daylight doorways and high-altitude cloud chambers inside windowless urban structures.

The experience is centered around a **240-frame 1920×1080 cinematic camera dolly** moving across a dark volcanic basalt landscape, stepping through an illuminated portal, and emerging into sunlit cumulus clouds and an expansive alpine horizon.

Instead of a generic video player, the user directly drives time and space with their scroll wheel, touch swipe, or keyboard arrows.

---

## Key Features

- **Strict Document Scroll-Lock Physics**: The viewport is locked to the 240-frame sequence (`overflow: hidden; height: 100vh`) until the crossing is completed (Frame 240, `smoothProgress >= 0.992`). Scrolling down then unlocks the rest of the site. Scrolling back up to the top re-locks and rewinds.
- **High-Performance 2D Canvas Engine**: Avoids the 2.0GB GPU bitmap memory crash of bulk `img.decode()` by caching native `HTMLImageElement`s and drawing to a single `<canvas>` at 60/120fps.
- **8-Worker Progressive Preloader**: Instant Frame 1 load, rapid keyframe stride preloading (`8 → 4 → 2 → 1`), and an active forward lookahead window (`[target - 3 .. target + 16]`).
- **Cloud-Themed Editorial Design**: Clean, sunlit architectural aesthetic with warm alabaster tones (`#f4efe6`), deep charcoal typography (`#181715`), and soft procedural drifting cumulus clouds.
- **Floating Rectangular Pill Navigation**: Adapts automatically between the dark hero and the bright cloud rooms below.

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/clickteig11-byte/threshold-sanctuaries.git
cd threshold-sanctuaries

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## Master Design & Prompt Guide

See [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md) for the complete engineering lessons, performance blueprints, and replication prompts.
See [`SHOWCASE.md`](./SHOWCASE.md) for portfolio embed snippets and showcase cards.

---
© 2026 THRESHOLD™ Sanctuaries.
