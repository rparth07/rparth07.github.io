import { portfolio, safeUrl } from "../content/portfolio";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Navbar.css";

export let smoother: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // -------------------------
    // Smooth Scroll (SAFE)
    // -------------------------
    smoother = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let frame = 0;
    smoother.on("scroll", ScrollTrigger.update);
    function raf(time: number) {
      smoother?.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    smoother.scrollTo(0);

    // -------------------------
    // NAV LINK SCROLLING
    // -------------------------
    const links = document.querySelectorAll(".header ul a");

    const handlers: Array<() => void> = [];
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;

      const onClick = (e: MouseEvent) => {
        const section = element.getAttribute("data-href");
        if (window.innerWidth > 1024 && section?.startsWith("#") && document.getElementById(section.slice(1))) {
          e.preventDefault();
          smoother?.scrollTo(section, { offset: -90 });
        }
      };
      element.addEventListener("click", onClick);
      handlers.push(() => element.removeEventListener("click", onClick));
    });

    // -------------------------
    // CLEANUP (IMPORTANT)
    // -------------------------
    return () => {
      cancelAnimationFrame(frame);
      handlers.forEach(remove => remove());
      smoother?.destroy();
      smoother = null;
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href={import.meta.env.BASE_URL + "#"} className="navbar-title" data-cursor="disable">
          {portfolio.site.logo}
        </a>

        <a
          href={safeUrl(`mailto:${portfolio.contact.email}`)}
          className="navbar-connect"
          data-cursor="disable"
        >
          {portfolio.contact.email}
        </a>

        <ul>{portfolio.navigation.map(link => <li key={link.id}><a data-href={safeUrl(link.href)} href={safeUrl(link.href)}><HoverLinks text={link.label} /></a></li>)}</ul>
      </div>

      <a href="/" className="portfolio-switch" data-cursor="disable" aria-label="Switch to classic portfolio">View classic portfolio <span aria-hidden="true">&rarr;</span></a>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
