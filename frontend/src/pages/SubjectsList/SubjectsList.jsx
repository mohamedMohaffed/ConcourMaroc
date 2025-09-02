import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import './SubjectsList.css';

const SubjectsList = () => {
    const { niveau_slug, universite_slug, year_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/subject/`, { needAuth: false });

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].year.university.level.name, link: "/concours/niveaux" },
        { text: data[0].year.university.name, link: `/concours/${data[0].year.university.level.slug}/universites` },
        { text: data[0].year.year, link: `/concours/${data[0].year.university.level.slug}/${data[0].year.university.slug}/year` },
    ] : [];

    return (
        <section className="subjects-list">
            <div className="subjects-list__header">
                <h1 className="subjects-list__title">
                    <span className="subjects-list__title--first-letter">C</span>
                    hoisir votre matière d'entrée
                </h1>
                <div className="subjects-list__path">
                    <Link to="/concours/niveaux">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
                    </Link>
                    {breadcrumbs && breadcrumbs.map((crumb, index) => (
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

            <div className="subjects-list__items">
                {loading && <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</p>}
                {error && <p className="error">Error: {error.message}</p>}
                {data && data.map((item) => (
                    <div key={item.id} className="subjects-list-item">
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SubjectsList;