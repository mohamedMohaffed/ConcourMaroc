import './LevelsList.css';
import useApi from '../../hooks/useApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight,faHouse } from '@fortawesome/free-solid-svg-icons';
const LevelsList = () => {
    const { data, error, loading } = useApi("http://127.0.0.1:8000/concour/niveaux/");

    return (
        <section className="level">
            <div className="level__header">
                <h1 className="level__title"><span className="level__title--first-lettre">C</span>hoisir votre niveau d’entrée</h1>
                <div className="level__path">
                    {/* <div className="level__path--title">{data && data.length > 0 && data[0].name}</div> */}
                    
                    <FontAwesomeIcon icon={faHouse}  style={{cursor:"pointer"}}/>
                    <FontAwesomeIcon icon={faChevronRight}  />
                </div>
            </div>

            <div className="level__items">
                {loading && <p>Loading...</p>}
                {error && <p className="error">Error: {error.message}</p>}
                {data && data.map((item) => ( 
                    <div key={item.id} className="level__item">
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LevelsList;