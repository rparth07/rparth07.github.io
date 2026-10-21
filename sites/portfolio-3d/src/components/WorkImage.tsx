import { MdArrowOutward } from "react-icons/md";

interface Props { image: string; alt?: string; link?: string; }

const WorkImage = ({image, alt, link}: Props) => (
  <div className="work-image">
    {link ? <a className="work-image-in" href={link} target="_blank" rel="noopener noreferrer"
      aria-label={`Open ${alt || "project"}`} data-cursor="disable">
      <div className="work-link"><MdArrowOutward aria-hidden="true" /></div>
      <img src={image} alt={alt} />
    </a> : <div className="work-image-in"><img src={image} alt={alt} /></div>}
  </div>
);
export default WorkImage;
