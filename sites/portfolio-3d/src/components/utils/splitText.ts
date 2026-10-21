import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
gsap.registerPlugin(ScrollTrigger);
let cleanup = () => {};
export default function setSplitText() {
  cleanup();
  const splits: SplitType[] = [];
  const context = gsap.context(() => {
    if (window.innerWidth < 900) return;
    document.querySelectorAll<HTMLElement>(".para, .title").forEach(el => {
      const title = el.classList.contains("title");
      // Keep authored block/line structure intact.
      const split = new SplitType(el, { types: title ? "chars" : "words" });
      splits.push(split);
      gsap.fromTo(title ? split.chars : split.words,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: title ? 0.025 : 0.015,
          ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
    });
  });
  cleanup = () => { context.revert(); splits.forEach(split => split.revert()); };
  ScrollTrigger.refresh();
  return () => cleanup();
}
