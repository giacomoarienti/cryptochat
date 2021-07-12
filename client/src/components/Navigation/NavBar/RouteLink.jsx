import { Link } from "react-router-dom";

function RouteLink({name, href, active}) {
  return (
    <li
    className={`nav-item  ${
      href !== "/" ?
        active.includes(href) ? "link-active" : ""
      : 
        active === href ? "link-active" : ""
    }`}
    >

      <Link className="nav-link" to={href}>
        {name}
        <span className="sr-only">(current)</span>
      </Link>

    </li>
  );
};

export default RouteLink;