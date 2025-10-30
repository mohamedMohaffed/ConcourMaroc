import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import './HeaderScore.css';

const HeaderScore = ({ breadcrumbs }) => {
    return(
        <div className="score__header">
            <h1 className="score__title desktop-title">
                <span className="score__title--first-letter">R</span>
                ésultats du Concours
            </h1>
            <h1 className="score__title mobile-title">
                <span className="score__title--first-letter">R</span>
                ésultats
            </h1>
            <div className="score__path">
                <Link to="/concours/niveaux">
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
    )
}

export default HeaderScore;