import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link } from 'react-router-dom';

const UniversityList = () => {
    const { data, error, loading } = useApi(`concour/Bac/universites`, { needAuth: false });

    const renderUniversity = (item) => (
        <Link key={item.id} to={`/concours/Bac/${item.slug}/year/`}>
            <div className="browse-list-item">
                <h2>{item.name}</h2>
            </div>
        </Link>
    );

    const breadcrumbs = [
        { text: "Bac", link: "" }
    ];

    return (
        
        <BrowseList 
            title="Choisir votre université d'entrée"
            titleMobile="Choisir Université"
            loading={loading}
            error={error}
            items={data}
            breadcrumbs={breadcrumbs}
            renderItem={renderUniversity}
            className="university"
            itemKey="name"
        />
    );
};

export default UniversityList;