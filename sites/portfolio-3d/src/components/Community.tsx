import { portfolio, safeUrl } from "../content/portfolio";
type Community = typeof portfolio.community;
type Photo = Community["speaking"]["events"][number]["photos"][number];
const External = ({url,children}: {url:string;children:React.ReactNode}) => <a href={safeUrl(url)} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
const PhotoLink = ({photo}: {photo:Photo}) => <a className="community-photo" href={safeUrl(photo.src)} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt} — open full photo`}><img src={safeUrl(photo.src)} alt={photo.alt} loading="lazy" decoding="async" /></a>;
const Heading = ({eyebrow,heading,intro}: {eyebrow:string;heading:string;intro:string}) => <header className="community-heading"><p className="community-eyebrow">{eyebrow}</p><h2>{heading}</h2><p>{intro}</p></header>;
export const OpenSource = () => {
 const c=portfolio.community.openSource;
 return <section id="open-source" className="community-block" data-theme="dark"><div className="community-inner">
 <Heading eyebrow="Contributing in public" heading={c.heading} intro={c.intro}/>
 {c.featured.map(repo=><article className="community-repo" key={repo.id}><div className="community-repo-heading"><div><p className="community-eyebrow">{repo.organization}</p><h3><External url={repo.url}>{repo.name}</External></h3></div><span className="community-stars">★ {repo.stars.toLocaleString('en-US')} stars</span></div><p>{repo.summary}</p><p className="community-scope">{repo.scope}</p><div className="community-areas">{repo.areas.map(area=><div key={area.title}><h4>{area.title}</h4><p>{area.description}</p><div className="community-links">{area.links.map(link=><External url={link.url} key={link.url}>{link.label}</External>)}</div></div>)}</div></article>)}
 <h3 className="community-other-title">Other open-source work</h3><div className="community-other">{c.other.map(repo=><article key={repo.id}><p className="community-eyebrow">{repo.organization} · ★ {repo.stars.toLocaleString('en-US')}</p><h4><External url={repo.url}>{repo.name}</External></h4><strong className="community-status">{repo.status}</strong><p>{repo.description}</p></article>)}</div><div className="community-writing"><h3>Developer writing &amp; featured work</h3><div className="community-writing-list">{c.writing.map(article=><article key={article.id}><p className="community-eyebrow">{article.kind} · {article.date}</p><h4><External url={article.url}>{article.title}</External></h4><p>{article.description}</p></article>)}</div></div>
 </div></section>;
};
export const Speaking = () => {
 const c=portfolio.community.speaking;
 return <section id="speaking" className="community-block" data-theme="dark"><div className="community-inner"><Heading eyebrow="Beyond the code" heading={c.heading} intro={c.intro}/><div className="community-events">
 {c.events.map(event=><article className={`community-event${event.clip?' community-mentoring':''}`} key={event.id}><PhotoLink photo={event.photos[0]}/><div className="community-event-copy"><p className="community-eyebrow">{event.event}{event.date?` · ${event.date}`:''}</p><h3>{event.title}</h3><p>{event.description}</p><div className="community-links">{event.videoUrl&&<External url={event.videoUrl}>Watch presentation</External>}{event.sourceUrl&&<External url={event.sourceUrl}>Event programme</External>}</div>{event.clip&&<video controls preload="none" playsInline aria-label="Short clip from Parth’s seminar"><source src={safeUrl(event.clip)} type="video/mp4"/>Your browser cannot play this video. <a href={safeUrl(event.clip)}>Open seminar clip</a>.</video>}</div>{event.photos.length>1&&<details className="community-gallery"><summary>More photos ({event.photos.length-1})</summary><div>{event.photos.slice(1).map(photo=><PhotoLink key={photo.src} photo={photo}/>)}</div></details>}</article>)}
 </div></div></section>;
};
