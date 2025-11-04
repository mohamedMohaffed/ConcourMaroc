import './Navbar.css';
import { Link, useLocation} from 'react-router-dom';
import React, { useState } from 'react';
import { isLoggedIn } from '../../utils/axiosInstance';

// SVG Icon Components with color prop
const BookIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z"/>
  </svg>
);
const GaugeIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM384 416C384 389.1 367.5 366.1 344 356.7L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184L296 356.7C272.5 366.2 256 389.2 256 416C256 451.3 284.7 480 320 480C355.3 480 384 451.3 384 416zM208 240C225.7 240 240 225.7 240 208C240 190.3 225.7 176 208 176C190.3 176 176 190.3 176 208C176 225.7 190.3 240 208 240zM192 320C192 302.3 177.7 288 160 288C142.3 288 128 302.3 128 320C128 337.7 142.3 352 160 352C177.7 352 192 337.7 192 320zM480 352C497.7 352 512 337.7 512 320C512 302.3 497.7 288 480 288C462.3 288 448 302.3 448 320C448 337.7 462.3 352 480 352zM464 208C464 190.3 449.7 176 432 176C414.3 176 400 190.3 400 208C400 225.7 414.3 240 432 240C449.7 240 464 225.7 464 208z"/>
  </svg>
);
const DumbbellIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z"/>
  </svg>
);
const RightToBracketIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160zM406.6 342.6C419.1 330.1 419.1 309.8 406.6 297.3L278.6 169.3C266.1 156.8 245.8 156.8 233.3 169.3C220.8 181.8 220.8 202.1 233.3 214.6L306.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L306.7 352L233.3 425.4C220.8 437.9 220.8 458.2 233.3 470.7C245.8 483.2 266.1 483.2 278.6 470.7L406.6 342.7z"/>
  </svg>
);
const CircleInfoIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/>
  </svg>
);
const GearIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/>
  </svg>
);
const RightFromBracketIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z"/>
  </svg>
);
// PLUS icon as a component
const EllipsisIcon = ({ color = "#777777" }) => (
  <svg width="28" height="28" viewBox="0 0 640 640" fill={color} xmlns="http://www.w3.org/2000/svg">
    <circle cx="96" cy="320" r="48"/>
    <circle cx="320" cy="320" r="48"/>
    <circle cx="544" cy="320" r="48"/>
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const [plusHover, setPlusHover] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  React.useEffect(() => {
    isLoggedIn({ skipRedirect: true }).then((loggedIn) => {
      setUserLoggedIn(loggedIn);
      setUserLoaded(true);
    });
    // console.log('isLoggedIn called');

  }, []);

  // Remove CONNEXION from default items
  const navbarItemsBase = [
    { name: "CONCOURS", mobileName: "CONCOURS", icon: BookIcon, to: "/concours/Bac/universites" },
    { name: "MON SCORE", mobileName: "SCORE", icon: GaugeIcon, to: "/tableau-de-bord" },
    { name: "PRATIQUE", mobileName: "PRATIQUE", icon: DumbbellIcon, to: "/pratique " },
    { name: "PLUS", mobileName: "PLUS", icon: EllipsisIcon }
  ];

  const plusDropdownItems = [
    { name: "À PROPOS", mobileName: "À PROPOS", icon: CircleInfoIcon, to: "/apropos" },
    { name: "PARAMÈTRES", mobileName: "PtARAMÈTRES", icon: GearIcon, to: "/parametres" },
    { name: "DÉCONNEXION", mobileName: "DÉCONNEXION", icon: RightFromBracketIcon, to: "/deconnexion"}
  ];

  const activeIndex = navbarItemsBase.findIndex(item => { 
    if (item.name === "CONCOURS") {
      return location.pathname.startsWith("/concours");
    }
    return item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to.trim());
  });

  // Add CONNEXION only after userLoaded and user is not logged in
  let filteredNavbarItems = [...navbarItemsBase];
  if (userLoaded && !userLoggedIn) {
    filteredNavbarItems.splice(3, 0, { name: "CONNEXION", mobileName: "CONNEXION", icon: RightToBracketIcon, to: "/connexion" });
  }

  const filteredPlusDropdownItems = userLoggedIn
    ? plusDropdownItems
    : plusDropdownItems.filter(item => item.name !== "DÉCONNEXION");

  return (
    <nav className="navbar">
      <div className="navbar__logo"><span className="navbar__logo--go">Con</span>Cours </div>
      <div className="navbar__items">
        {filteredNavbarItems.map((item, idx) => {
          const isPlus = item.name === "PLUS";
          const isActive = activeIndex === idx;
          const iconColor = isActive ? "#74C0FC" : "#777777";
          if (!isPlus) {
            return (
              <Link
                to={item.to}
                key={item.name}
                style={{ textDecoration: 'none', color: 'inherit', }}
              >
                <div className={`navbar__item${isActive ? " navbar__item--active" : ""}`}>
                  <div className={`navbar__item-img${isActive ? " navbar__item-img--active" : ""}`}>
                    {/* Pass color prop to icon */}
                    {React.createElement(item.icon, { color: iconColor })}
                  </div>
                  <div
                    className={`navbar__item-name${isActive ? " navbar__item-name--active" : ""}`}
                  >
                    <span className="navbar__item-name--desktop">{item.name}</span>
                    <span className="navbar__item-name--mobile">{item.mobileName}</span>
                  </div>
                </div>
              </Link>
            );
          }
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
                  {/* Pass color prop to icon */}
                  {React.createElement(item.icon, { color: plusHover ? "#74C0FC" : "#777777" })}
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
                          {React.createElement(dropItem.icon, { color: "#777777" })}
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


