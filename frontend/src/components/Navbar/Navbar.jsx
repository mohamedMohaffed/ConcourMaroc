import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faGamepad, faEllipsisH, faUserGraduate, faBook, faPlus, faCircleInfo, faCompass, faDumbbell, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Navbar = () => {
  const navbarItems = [
    { name: "CONCOURS", mobileName: "CONCOURS", icon: faBook, to: "/concours/Bac/universites" },
    { name: "MON SCORE", mobileName: "SCORE", icon: faGauge, to: "/tableau-de-bord" },
    { name: "PRATIQUE", mobileName: "PRATIQUE", icon: faDumbbell, to: "/pratique " },
    // { name: "APPRENDRE", icon: faUserGraduate, to: "/apprendre" },
    // { name: "UNIVERSITÉS", mobileName: "UNIVERSITÉS", icon: faCircleInfo, to: "/universites" },
    { name: "PLUS", mobileName: "PLUS", icon: faEllipsisH, to: "/plus" }
  ];

  const plusDropdownItems = [
    { name: "SETTINGS", mobileName: "SETTINGS", icon: faGear, to: "/settings" },
    { name: "LOGOUT", mobileName: "LOGOUT", icon: faRightFromBracket, to: "/logout"}
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = navbarItems.findIndex(item => { 
    if (item.name === "CONCOURS") {
      return location.pathname.startsWith("/concours");
    }
    return item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to.trim());
  });

  const [plusHover, setPlusHover] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo"><span className="navbar__logo--go">Con</span>Cours </div>
      <div className="navbar__items">
        {navbarItems.map((item, idx) => {
          const isPlus = item.name === "PLUS";
          if (!isPlus) {
            return (
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
            );
          }
          // PLUS item with dropdown
          return (
            <div
              key={item.name}
              style={{ position: 'relative' }}
              onMouseEnter={() => setPlusHover(true)}
              onMouseLeave={() => setPlusHover(false)}
            >
              <Link
                to={item.to}
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
              {plusHover && (
                <div className="navbar__plus-dropdown">
                  {plusDropdownItems.map((dropItem, dropIdx) =>
                      <Link
                        to={dropItem.to}
                        key={dropItem.name}
                        style={{ textDecoration: 'none', color: 'inherit', }}
                      >
                        <div className="navbar__item">
                          <div className="navbar__item-img">
                            <FontAwesomeIcon icon={dropItem.icon} className="navbar__icon" size="8x" />
                          </div>
                          <div className="navbar__item-name">
                            <span className="navbar__item-name--desktop">{dropItem.name}</span>
                            <span className="navbar__item-name--mobile">{dropItem.mobileName}</span>
                          </div>
                        </div>
                      </Link>
                    
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;


