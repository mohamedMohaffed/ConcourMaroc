import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import './HeaderScore.css';

const HeaderScore=({data})=>{

    const breadcrumbs = data && data.score ? [
        { text: data.score.slug_level, link: "/concours/niveaux" },
        { text: data.score.slug_university, link: `/concours/${data.score.slug_level}/universites` },
        { text: data.score.slug_year, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/year` },
        { text: data.score.slug_subject, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/${data.score.slug_year}/matieres` }
    ] : [];

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
                                <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
                            </Link>
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                    {crumb.link ? (
                                        <Link to={crumb.link}>
                                            <span style={{ cursor: "pointer" }}>{crumb.text}</span>
                                        </Link>
                                    ) : (
                                        <span>{crumb.text}</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
        
    )

}

export default HeaderScore;