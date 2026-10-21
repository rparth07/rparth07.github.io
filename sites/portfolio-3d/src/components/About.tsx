import { portfolio, safeUrl } from "../content/portfolio";
import "./styles/About.css";
import { MdWorkOutline, MdCode, MdSchool } from "react-icons/md";
const highlightIcons = { experience: MdWorkOutline, opensource: MdCode, mentor: MdSchool };
const About = () => <div className="about-section" id="about"><div className="about-me">
<div className="about-profile"><img src={safeUrl(portfolio.about.photo)} alt={portfolio.about.photoAlt} width="64" height="64" /><h3 className="title">{portfolio.about.heading}</h3></div>
{portfolio.about.paragraphs.map((text, i) => <p className="para" key={i}>{text}</p>)}
<div className="about-highlights">{portfolio.about.highlights.map(item => {
const Icon = highlightIcons[item.icon as keyof typeof highlightIcons] || MdCode;
return <div key={item.id}><h4><a className="highlight-icon" href={safeUrl(item.href)} aria-label={`Explore ${item.title}`} title={`Explore ${item.title}`} target={item.href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer"><Icon aria-hidden="true" /></a>{item.title}</h4>{item.lines.map((line,i)=><div key={i}>{line}</div>)}</div>;
})}</div>
</div></div>;
export default About;
