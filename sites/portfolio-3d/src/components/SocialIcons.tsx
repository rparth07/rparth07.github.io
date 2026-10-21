import { portfolio, safeUrl } from "../content/portfolio";
import {
  FaGithub,
  FaFacebook,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { FaLink, FaGoogle } from "react-icons/fa6";
const socialIcons: Record<string, typeof FaGithub> = { github: FaGithub, facebook: FaFacebook, linkedin: FaLinkedinIn, twitter: FaXTwitter, link: FaLink, google: FaGoogle };
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups: Array<() => void> = [];
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      let frame = 0;
      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        frame = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const bounds = elem.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        document.removeEventListener("mousemove", onMouseMove);
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {portfolio.socialLinks.map(link => { const Icon = socialIcons[link.icon] || FaLink; return <span key={link.id}><a href={safeUrl(link.url)} aria-label={link.label} target="_blank" rel="noopener noreferrer"><Icon /></a></span>; })}
      </div>
      <a
        className="resume-button"
        download={/\.(pdf|docx?)(?:[?#]|$)/i.test(portfolio.resume.url) || undefined}
        target="_blank"
        href={safeUrl(portfolio.resume.url)}
        rel="noopener noreferrer"
        aria-label={portfolio.resume.label}
      >
        <HoverLinks text={portfolio.resume.label} />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
