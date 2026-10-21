import { portfolio, safeUrl } from "../content/portfolio";
import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{portfolio.hero.greeting}</h2>
            <h1>
              {portfolio.hero.nameLines.map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
            </h1>
          </div>
          <div className="landing-info">
            <h3>{portfolio.hero.subtitle}</h3>
            <h2 className="landing-info-h2">
              {portfolio.hero.roles.map((role,i) => <div className={`role-entry ${i === 0 ? "landing-h2-1" : i === 1 ? "landing-h2-2" : ""}`} key={i}>{role}</div>)}
            </h2>
            <h2>
              {[...portfolio.hero.roles].reverse().map((role,i) => <div className={`role-entry ${i === 0 ? "landing-h2-info" : i === 1 ? "landing-h2-info-1" : ""}`} key={i}>{role}</div>)}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
