import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faGamepad, faEllipsisH, faUserGraduate,faBook,faPlus,faCircleInfo,faCompass,faDumbbell,faGear } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navbarItems = [
    { name: "CONCOURS", mobileName: "CONCOURS", icon: faBook, to: "/concours/niveaux" },
    { name: "MON SCORE", mobileName: "SCORE", icon: faGauge, to: "/tableau-de-bord" },
    // { name: "APPRENDRE", icon: faUserGraduate, to: "/apprendre" },
    { name: "PRATIQUE", mobileName: "PRATIQUE", icon: faDumbbell, to: "/pratique " },
    // { name: "UNIVERSITÉS", mobileName: "UNIVERSITÉS", icon: faCircleInfo, to: "/universites" },
    // { name: "PLUS", mobileName: "PLUS", icon: faEllipsisH, to: "/plus" }
    { name: "SETTINGS", mobileName: "SETTINGS", icon: faGear, to: "/settings" }

  ];

  const location = useLocation();
  const activeIndex = navbarItems.findIndex(item => { 
    if (item.name === "CONCOURS") {
      return location.pathname.startsWith("/concours");
    }
    return item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to.trim());
  });

  return (
    <nav className="navbar">
      <div className="navbar__logo"><span className="navbar__logo--go">Con</span>Cours </div>
      <div className="navbar__items">
        {navbarItems.map((item, idx) => (
          <Link
            to={item.to}
            key={item.name}
            style={{ textDecoration: 'none', color: 'inherit', }}
          >
            <div className={`navbar__item${activeIndex === idx ? " navbar__item--active" : ""}`}>
              <div className={`navbar__item-img${activeIndex === idx ? " navbar__item-img--active" : ""}`}>
                <FontAwesomeIcon
                  icon={item.icon}
                  className="navbar__icon"
                  size="8x"
                />
              </div>
              <div
                className={`navbar__item-name${activeIndex === idx ? " navbar__item-name--active" : ""}`}
              >
                <span className="navbar__item-name--desktop">{item.name}</span>
                <span className="navbar__item-name--mobile">{item.mobileName}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;


