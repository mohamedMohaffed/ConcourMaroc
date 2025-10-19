import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faGamepad, faEllipsisH, faUserGraduate, faBook, faPlus, faCircleInfo, faCompass, faDumbbell, faGear, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { isLoggedIn } from '../../utils/axiosInstance';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plusHover, setPlusHover] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  React.useEffect(() => {
    isLoggedIn({ skipRedirect: true }).then(setUserLoggedIn);
    // console.log('isLoggedIn called');

  }, []);

  const navbarItems = [
    { name: "CONCOURS", mobileName: "CONCOURS", icon: faBook, to: "/concours/Bac/universites" },
    { name: "MON SCORE", mobileName: "SCORE", icon: faGauge, to: "/tableau-de-bord" },
    { name: "PRATIQUE", mobileName: "PRATIQUE", icon: faDumbbell, to: "/pratique " },
    // { name: "APPRENDRE", icon: faUserGraduate, to: "/apprendre" },
    // { name: "UNIVERSITÉS", mobileName: "UNIVERSITÉS", icon: faCircleInfo, to: "/universites" },
    { name: "CONNEXION", mobileName: "CONNEXION", icon: faRightToBracket, to: "/connexion" },
    { name: "PLUS", mobileName: "PLUS", icon: faEllipsisH }
  ];

  const plusDropdownItems = [
    { name: "À PROPOS", mobileName: "À PROPOS", icon: faCircleInfo, to: "/apropos" },
    { name: "PARAMÈTRES", mobileName: "PtARAMÈTRES", icon: faGear, to: "/parametres" },
    { name: "DÉCONNEXION", mobileName: "DÉCONNEXION", icon: faRightFromBracket, to: "/deconnexion"}
  ];

  const activeIndex = navbarItems.findIndex(item => { 
    if (item.name === "CONCOURS") {
      return location.pathname.startsWith("/concours");
    }
    return item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to.trim());
  });

  // Filter out "CONNEXION" if logged in
  const filteredNavbarItems = userLoggedIn
    ? navbarItems.filter(item => item.name !== "CONNEXION")
    : navbarItems;

  // Filter out "DÉCONNEXION" if not logged in
  const filteredPlusDropdownItems = userLoggedIn
    ? plusDropdownItems
    : plusDropdownItems.filter(item => item.name !== "DÉCONNEXION");

  return (
    <nav className="navbar">
      <div className="navbar__logo"><span className="navbar__logo--go">Con</span>Cours </div>
      <div className="navbar__items">
        {filteredNavbarItems.map((item, idx) => {
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
              <div
                className="navbar__item"
                style={
                  plusHover
                    ? {
                        background: '#F5F7FA',
                        border: '0.125rem solid transparent',
                        borderRadius: '0.625rem',
                        cursor: 'pointer'
                      }
                    : { cursor: 'pointer' }
                }
              >
                <div className="navbar__item-img">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="navbar__icon"
                    size="8x"
                  />
                </div>
                <div className="navbar__item-name">
                  <span className="navbar__item-name--desktop">{item.name}</span>
                  <span className="navbar__item-name--mobile">{item.mobileName}</span>
                </div>
              </div>
              {plusHover && (
                <div
                  className="navbar__plus-dropdown"
                  onMouseEnter={() => setPlusHover(true)}
                  onMouseLeave={() => setPlusHover(false)}
                >
                  {filteredPlusDropdownItems.map((dropItem, dropIdx) =>
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


