import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faGamepad, faEllipsisH, faUserGraduate,faBook,faPlus,faCircleInfo,faCompass } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navbarItems = [
    { name: "CONCOURS", icon: faBook, to: "/concours/niveaux" },
    { name: "MON SCORE", icon: faGauge, to: "/dashboard" },
    { name: "APPRENDRE", icon: faUserGraduate, to: "/apprendre" },
    { name: "EXPLORER", icon: faCompass, to: "/explorer" },
    { name: "CRÉER QSM", icon: faPlus, to: "/qsm" },
    { name: "UNIVERSITÉS", icon: faCircleInfo, to: "/universites" },
    { name: "PLUS", icon: faEllipsisH, to: "/plus" }
  ];

  const location = useLocation();
  const activeIndex = navbarItems.findIndex(item =>
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
  );

  return (
    <nav className="navbar">
      <div className="navbar__logo"><span className="navbar__logo--go">Con</span>Cours</div>
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
                />
              </div>
              <div
                className={`navbar__item-name${activeIndex === idx ? " navbar__item-name--active" : ""}`}
              >
                {item.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;


