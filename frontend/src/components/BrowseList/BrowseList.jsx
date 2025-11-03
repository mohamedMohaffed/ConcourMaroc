import './BrowseList.css';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading'
const BrowseList = ({
    title,
    titleMobile,
    loading,
    error,
    items,
    breadcrumbs,
    itemKey = "id",
    renderItem,
    className
}) => {
    return (
        <section 
        className={`browse-list ${className || ''}`}>
            <div className="browse-list__header">
                <h1 className="browse-list__title desktop-title">
                    <span className="browse-list__title--first-letter">{title.charAt(0)}</span>
                    {title.slice(1)}
                </h1>
                <h1 className="browse-list__title mobile-title">
                    <span className="browse-list__title--first-letter">{(titleMobile || title).charAt(0)}</span>
                    {(titleMobile || title).slice(1)}
                </h1>
                <div className="browse-list__path">
                    <Link to="">
                        <svg className="house__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" 
                        width="26" height="26">
                            <path fill="#777777" d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
                        </svg>
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
                        <span key={index} className="breadcrumbs"> 
                            <svg className="chevronRight__icon" xmlns="http://www.w3.org/2000/svg" 
                                height="26" width="26" viewBox="0 0 640 640">
                                <path fill="#777777" d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                            </svg>                            
                                {crumb.link ? (
                                <Link to={crumb.link}>
                                    <span style={{ cursor: "pointer" }}>{crumb.text}</span>
                                </Link>
                            ) : (
                                <span style={{ cursor: "not-allowed" }}>{crumb.text}</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="browse-list__items">
                {loading && <div style={{ display: 'flex', justifyContent: 'center', 
                    alignItems: 'center' }}><Loading/></div>}
                {error && <p className="error">Error: {error.message}</p>}
                {items &&
                    items.map((item) => renderItem(item, item[itemKey]))}
            </div>
        </section>
    );
};

export default BrowseList;
