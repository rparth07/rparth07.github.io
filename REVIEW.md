# Portfolio review — 22 October 2026

Reviewed the classic `/` portfolio and the production `/portfolio-3d/` build.
The classic desktop and phone design restored in the previous change is retained;
this review changes its tablet gutters only, plus behavior and accessibility.

## Fixed

| Finding | Correction |
| --- | --- |
| Failed avatar requests could leave the 3D loader blocking the whole page | Handle model errors; after 30 seconds release the intro while slow loading continues, allowing late success instead of permanently discarding the model |
| WebGL creation or tech-stack rendering errors could crash the experience | Handle renderer creation failures and isolate the optional tech-stack preview with an error boundary |
| The model loader's async compilation callback could reject outside its outer promise | Catch callback errors and reject the actual load promise; tolerate missing optional foot nodes |
| Loading timers were scheduled during render | Schedule transitions in effects and cancel timers on cleanup |
| Scene, custom cursor, and social pointer effects left timers/listeners/render loops behind | Add cleanup for progress, touch listeners, cursor/social loops, geometry/material resources, and renderer disposal |
| Physics continued running offscreen, with repeated per-click polling timers | Determine visibility from the tech-stack section, pause hidden physics, and use the existing scroll event |
| Excessive pixel density amplified GPU work | Cap the avatar renderer pixel ratio at 2 |
| Direct 3D section URLs were forced back to home after loading | Restore the requested section after initialization and keep section clicks in the URL |
| Keyboard focus entered offscreen carousel cards | Mark inactive slides inert and hidden to assistive technology; expose the active pagination button |
| Project screenshots looked interactive but had no destination | Link screenshots to the demo or repository; use a plain wrapper when neither exists; omit unavailable demo/source buttons |
| Desktop classic menu links had no accessible name after their text was visually hidden | Add explicit names to dynamic and static navigation; avoid doubled 3D navigation labels |
| Classic keyboard selection could leave focus in the closed mobile menu | Move keyboard focus to the selected section and update its URL hash |
| The fixed switch covered the mobile 3D role text | Reserve space above the switch for role text, and respect the device bottom safe area |
| 820px classic layout used 430px of horizontal padding | Use narrower gutters only between 769px and 991.98px, preserving phone and desktop layouts |
| Stalled JSON requests could delay initialization indefinitely | Apply an eight-second request deadline; preserve classic HTML or bundled 3D content as fallback |
| Classic AOS content could be hidden without JavaScript | Reveal fallback sections in noscript mode and provide a static role; add a route back to classic when the 3D app has no JavaScript |
| 3D automatic role/marquee/pointer/character motion ignored reduced-motion preferences | Disable those automatic effects at startup for reduced motion; keep text and section navigation available |
| The 3D page prevented selecting/copying text | Restore text selection and add visible keyboard focus indicators |
| A button labeled Resume opened GitHub, with a download attribute | Relabel it GITHUB, name it accessibly, and apply download only for document URLs |
| About/service sections visibly contained authoring placeholders | Replace them with summaries of the existing supplied experience, projects, and skills; add no new qualifications |

## Verification

- Classic tests: JSON rendering, added content, invalid input, unsafe links, optional buttons,
  balanced project-card markup, and HTTP/network fallback.
- 3D checks: TypeScript production build, JSON schema validation, content rendering tests,
  unsafe URLs, extra entries, hidden-slide semantics, missing project URLs, and branding/
  approved-avatar integrity audit.
- Static deployment tests: independent entries and JSON, scoped scripts/styles/fonts,
  model, environment map, decoder, and retained license.
- Browser: normal classic and 3D pages, zero broken images in inspected views, valid
  classic menu targets, keyboard tablet menu selection and focus, classic lightbox
  opening/closing, 3D direct education URL, section URL updates, project pagination,
  offscreen inert slides, and switching between both portfolio routes.
- A temporary local server deliberately returned HTTP 503 for the approved avatar.
  The loading screen cleared, scrolling returned, content stayed available, and the
  fallback status appeared. This test does not claim to emulate every GPU failure.
- All five public demo URLs and all five public repository URLs returned HTTP 200.
  This verifies reachability, not every feature inside those separate applications.

## Remaining limitations / content to provide

- The approved avatar is about 26.5 MB, and the existing Three.js/physics bundles are
  large. Slow first visits remain possible. No avatar geometry, texture quality, or
  approved-model checksum was changed during this review.
- A real resume file/URL has not been supplied. The current profile action is honestly
  labeled GitHub; change the JSON label and URL when a CV is available.
- Employment dates, job titles, and the supplied “2+ years” summary were preserved.
  Confirm factual updates before publishing if the career information has changed.
- Browser rendering and interaction checks were performed locally in the available
  browser. This is not a certification for every browser, device, accessibility
  configuration, or GPU. Reduced-motion handling is implemented but was not tested
  with an OS-level preference change.
- Contact actions open the visitor's email application. No message was sent and no
  mail-delivery service was added.
- These changes are local commits until pushed to the GitHub Pages publishing branch.
