import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link, useParams } from 'react-router-dom';

const YearsList = () => {
    const { niveau_slug, universite_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/year/`, { needAuth: false });

    const renderYear = (item, key) => (
        <Link to={`/concours/${niveau_slug}/${universite_slug}/${item.year}/matieres`}><div key={key} className="browse-list-item">
            <h2>{item.year}</h2>
        </div></Link>
    );

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].university.level.name, link: "/concours/niveaux" },
        { text: data[0].university.name, link: `/concours/${data[0].university.level.slug}/universites` }
    ] : [];

    return (
        <BrowseList 
            title="Choisir votre année d'entrée"
            titleMobile="Choisir Année"

            loading={loading}
            error={error}
            items={data}
            breadcrumbs={breadcrumbs}
            renderItem={renderYear}
            className="year"
        />
    );
};

export default YearsList;