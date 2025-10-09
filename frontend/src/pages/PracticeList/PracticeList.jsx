import useApi from '../../hooks/useApi';
import './PracticeList.css';
import { Link } from 'react-router-dom';

const PracticeList = () => {
    const { data, error, loading } = useApi("concour/list-mauvaises-reponses/");

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;

    return (
        <section className="practice-list">
            <div className="practice-list__header">
                <h1 className="practice-list__title">
                    <span className="practice-list__title--first-letter">P</span>
                    ractice List
                </h1>
            </div>
            <div className="practice-list__items">
                {data.map((item, index) => (
                    <Link 
                        to={`/pratique/${item.concours_slug}`} 
                        key={index} 
                        className="practice-list-item"
                    >
                        {`${item.level}-${item.university}-${item.year}-${item.subject}`}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default PracticeList;