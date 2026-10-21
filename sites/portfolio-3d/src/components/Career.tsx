import { portfolio } from "../content/portfolio";
import "./styles/Career.css";
const Career = () => <div className="career-section section-container" id="experience"><div className="career-container">
<h2>{portfolio.career.heading}{portfolio.career.connector && <> <span>{portfolio.career.connector}</span></>}{portfolio.career.headingSecond && <><br />{portfolio.career.headingSecond}</>}</h2>
<div className="career-info"><div className="career-timeline"><div className="career-dot" /></div>
{portfolio.career.items.map(item => <div className="career-info-box" key={item.id}>
<div className="career-info-in"><div className="career-role"><h4>{item.role}</h4><h5>{item.organization}</h5></div><h3>{item.period}</h3></div>
<div className="career-details">{item.description && <p>{item.description}</p>}{item.highlights.length > 0 && <ul>{item.highlights.map((text,i)=><li key={i}>{text}</li>)}</ul>}{item.projects.map(project=><div className="career-project" key={project.id}><h6>{project.name}</h6><ul>{project.highlights.map((text,i)=><li key={i}>{text}</li>)}</ul></div>)}</div>
</div>)}</div></div></div>;
export default Career;
