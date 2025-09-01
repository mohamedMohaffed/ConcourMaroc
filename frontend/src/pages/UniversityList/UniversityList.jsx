import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link, useParams } from 'react-router-dom';

const UniversityList = () => {
    const { niveau_slug } = useParams();
    const { data, error, loading } = useApi(`concour/${niveau_slug}/universites`, { needAuth: false });

    const renderUniversity = (item, key) => (
        <Link key={key} to={`/concours/${item.level.slug}/${item.slug}/year/`}>
            <div className="browse-list-item">
                <h2>{item.name}</h2>
            </div>
        </Link>
    );

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].level.name, link: "/concours/niveaux" }
    ] : [];

    return (
        <BrowseList 
            title="Choisir votre université d'entrée"
            loading={loading}
            error={error}
            items={data}
            breadcrumbs={breadcrumbs}
            renderItem={renderUniversity}
            className="university"
        />
    );
};

export default UniversityList;