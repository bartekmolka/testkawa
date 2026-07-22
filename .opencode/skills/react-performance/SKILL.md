---
name: react-performance
description: Ensures 60fps buttery smooth Framer Motion animations and prevents layout thrashing on mobile browsers.
---

## Instructions
- Animate ONLY GPU-accelerated CSS properties (`transform` and `opacity`).
- NEVER animate `height`, `width`, `margin`, `padding`, or `top` directly.
- Apply `will-change-transform` and `touch-action-manipulation` on key animated elements.
- Keep backdrop blur light (`backdrop-blur-md` max) to avoid rendering lag on mobile Safari/WebKit.
- Wrap heavy components in `React.memo` or use lightweight CSS hardware acceleration.
