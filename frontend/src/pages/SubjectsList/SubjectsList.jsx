import useApi from '../../hooks/useApi';
import BrowseList from '../../components/BrowseList/BrowseList';
import { Link, useParams } from 'react-router-dom';

const SubjectsList = () => {
    const { niveau_slug, universite_slug,year_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/subject/`, { needAuth: false });

    const renderSubject = (item, key) => (
        <div key={key} className="browse-list-item">
            <h2>{item.name}</h2>
        </div>
    );

    const breadcrumbs = data && data.length > 0 ? [
        { text: data[0].year.university.level.name, link: "/concours/niveaux" },
        { text: data[0].year.university.name, link: `/concours/${data[0].year.university.level.slug}/universites` },
        { text: data[0].year.year, link: `/concours/${data[0].year.university.level.slug}/${data[0].year.university.slug}/year` },



    ] : [];

    return (
        <BrowseList 
            title="Choisir votre matière d’entrée"
            loading={loading}
            error={error}
            items={data}
            breadcrumbs={breadcrumbs}
            renderItem={renderSubject}
            className="subject"
        />
    );
};

export default SubjectsList;