## Summary
- Compress brand and 40000 promo videos (~44 MB saved) and remove unused MOV source
- Lazy-load brand films when the video section nears the viewport instead of on initial page load
- Remove aggressive video preload from `index.html` and set scroll-zoom video to `preload="none"`
- Fix desktop product detail layout so flavor images no longer stretch with empty space below

## Deploy
Partial deploy is enough after `npm run build`: upload `index.html` plus new hashed files under `dist/assets/` (no need to re-upload images).

## Test plan
- [ ] Home page loads faster; brand video still plays on scroll
- [ ] `/products/topbar-40000-puffs` flavor image looks correct on desktop
- [ ] Promo MP4s serve compressed sizes from `/videos/`
