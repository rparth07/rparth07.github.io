import { portfolio, safeUrl } from "../content/portfolio";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
const Contact = () => <div className="contact-section section-container" id="contact"><div className="contact-container">
<h3>{portfolio.contact.heading}</h3><div className="contact-intro">{portfolio.contact.lines.map((line,i)=><p key={i}>{line}</p>)}<a className="contact-cta" href={safeUrl(`mailto:${portfolio.contact.email}`)}>{portfolio.contact.buttonLabel} <MdArrowOutward /></a></div><div className="contact-flex">
<div className="contact-box"><h4>{portfolio.contact.emailLabel}</h4><p><a href={safeUrl(`mailto:${portfolio.contact.email}`)} data-cursor="disable">{portfolio.contact.email}</a></p>
</div>
<div className="contact-box"><h4>{portfolio.contact.socialLabel}</h4>{portfolio.socialLinks.map(link=><a key={link.id} href={safeUrl(link.url)} target="_blank" rel="noopener noreferrer" data-cursor="disable" className="contact-social">{link.label} <MdArrowOutward /></a>)}</div>
<div className="contact-box"><h2>{portfolio.footer.credit}<br />{portfolio.footer.by} <span>{portfolio.footer.author}</span></h2><h5><MdCopyright /> {portfolio.footer.year}</h5></div>
</div></div></div>;
export default Contact;
