import useApi from '../../hooks/useApi';
import './PracticeList.css';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';

const PracticeList = () => {
    const { data, error, loading } = useApi("concour/list-mauvaises-reponses/");

    return (
        <section
        className="practice-list">
            <div className="practice-list__header">
                <h1 className="practice-list__title">
                    <span className="practice-list__title--first-letter">P</span>
                    ractice List
                </h1>
            </div>
            <div
                className="practice-list__items">
                {loading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading/></div>}
                {error && <div>{error.message}</div>}
                {data && data.length === 0 && (
                    <div className="practice-list__empty">
                        <p>Aucun exercice de pratique disponible pour le moment.</p>
                    </div>
                )}
                {data && data.map((item, index) => (
                    <Link 
                        to={`/pratique/${item.concours_slug}`} 
                        key={index} 
                        className="practice-list-item"
                    >
                        {`${item.university}-${item.year}-${item.subject}`}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default PracticeList;