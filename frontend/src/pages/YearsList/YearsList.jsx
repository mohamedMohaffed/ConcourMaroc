import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link, useParams } from 'react-router-dom';

const YearsList = () => {
    const { universite_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/Bac/${universite_slug}/year/`, { needAuth: false });

    const renderYear = (item, key) => (
        <Link to={`/concours/Bac/${universite_slug}/${item.year}/matieres`}><div key={key} className="browse-list-item">
            <h2>{item.year}</h2>
        </div></Link>
    );

    const breadcrumbs = data && data.length > 0 ? [
        { text: "Bac", link: "" },
        { text: data[0].university.name, link: `/concours/Bac/universites` }
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