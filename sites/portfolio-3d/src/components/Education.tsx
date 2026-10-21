import { portfolio } from "../content/portfolio";
const Education = () => <section className="content-section section-container" id="education"><h2>{portfolio.education.heading}</h2>
<div className="education-list">{portfolio.education.items.map(item=><article key={item.id}><div><h3>{item.qualification}</h3><p>{item.institution}</p></div><div><p className="education-period">{item.period}</p><p>{item.score}</p></div></article>)}</div></section>;
export default Education;
