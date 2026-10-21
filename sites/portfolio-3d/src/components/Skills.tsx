import { portfolio, safeUrl } from "../content/portfolio";
const Skills = () => <section className="content-section skills-section" id="skills"><div className="skills-inner"><h2>{portfolio.skills.heading}</h2>
<div className="skill-groups">{portfolio.skills.groups.map(group=><div className="skill-group" key={group.id}><h3>{group.title}</h3><ul>{group.items.map(item=><li key={item.id}><img src={safeUrl(item.image)} alt="" width="32" height="32" loading="lazy" /><span>{item.name}</span></li>)}</ul></div>)}</div></div></section>;
export default Skills;
