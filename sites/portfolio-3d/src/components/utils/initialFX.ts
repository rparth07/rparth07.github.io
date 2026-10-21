import gsap from "gsap";
import SplitType from "split-type";
import { smoother } from "../Navbar";

let intro: gsap.Context | undefined;
let splits: SplitType[] = [];

export function initialFX() {
  if (!document.querySelector("main")) return;
  intro?.revert();
  splits.forEach(split => split.revert());
  splits = [];
  document.body.style.overflowY = "auto";
  smoother?.scrollTo(0, { immediate: true });
  document.querySelector("main")?.classList.add("main-active");
  intro = gsap.context(() => {
    gsap.to("body", { backgroundColor: "#0a0e17", duration: 0.5 });
    gsap.fromTo([".header", ".icons-section", ".nav-fade"], { opacity: 0 }, { opacity: 1, duration: 1.2 });
    gsap.fromTo(".landing-info h3", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 });
    document.querySelectorAll<HTMLElement>(".landing-info h2").forEach(row => {
      const entries = Array.from(row.children) as HTMLElement[];
      entries.forEach((entry, i) => {
        const split = new SplitType(entry, { types: "chars" }); splits.push(split);
        gsap.set(entry, { autoAlpha: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 100 });
      });
      if (entries.length < 2) return;
      const timeline = gsap.timeline({ repeat: -1 });
      entries.forEach((entry, i) => {
        const next = entries[(i + 1) % entries.length];
        const at = 4 + i * 4.7;
        timeline.to(entry, { yPercent: -100, autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, at)
          .fromTo(next, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.inOut", immediateRender: false }, at);
      });
    });
  });
}
