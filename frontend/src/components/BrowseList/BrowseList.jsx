import './BrowseList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading'
import {motion } from 'framer-motion';
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
        <motion.section 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{delay:0.2}}
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
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "not-allowed" }} />
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            <FontAwesomeIcon icon={faChevronRight} />
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
        </motion.section>
    );
};

export default BrowseList;
