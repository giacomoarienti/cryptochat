import { Link } from "react-router-dom";

function RouteLink({ name, href, active }) {
  return (
    <Link className={`nav-link ${
      href !== "/" ?
        active.includes(href) ? "link-active" : ""
      : 
        active === href ? "link-active" : ""
    }`} to={href}>
      {name}
      <span className="sr-only">(current)</span>
    </Link>
  );
};

export default RouteLink;