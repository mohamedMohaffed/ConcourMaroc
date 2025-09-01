import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link } from 'react-router-dom';

const LevelsList = () => {
    const { data, error, loading } = useApi("concour/niveaux/", { needAuth: false });

    const renderLevel = (item, key) => (
        <Link key={key} to={`/concours/${item.slug}/universites`}>
            <div className="browse-list-item">
                <h2>{item.name}</h2>
            </div>
        </Link>
    );

    return (
        <BrowseList 
            title="Choisir votre niveau d'entrée"
            loading={loading}
            error={error}
            items={data}
            breadcrumbs={[]}
            renderItem={renderLevel}
            className="level"
        />
    );
};

export default LevelsList;