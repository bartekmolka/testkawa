---
name: mobile-first-design
description: Enforces mobile-first responsive design, touch targets, and overflow prevention for small screens.
---

## Instructions
- Build for 375px–430px viewports first before applying `md:` or `lg:` breakpoints.
- Prevent horizontal scroll leaks by enforcing `overflow-x-hidden` on wrappers.
- All interactive buttons and touch targets must be at least 48px by 48px.
- Use mobile-friendly layouts (`flex-col`, sticky bottom bars, swipe gesture containers).
