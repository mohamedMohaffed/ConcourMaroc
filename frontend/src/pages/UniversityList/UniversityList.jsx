import './UniversityList.css';
import useApi from '../../hooks/useApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight,faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const UniversityList = () => {
    const { data, error, loading } = useApi("concour/Bac/universites", { needAuth: false });

    return (
        <section className="university">

            <div className="university__header">
                <h1 className="university__title"><span className="university__title--first-lettre">C</span>hoisir votre niveau d’entrée</h1>
                <div className="university__path"> 
                    <Link to="/concours/niveaux"><FontAwesomeIcon icon={faHouse}  style={{cursor:"pointer"}}/></Link>
                    <FontAwesomeIcon icon={faChevronRight}  />
                    <Link to="/concours/niveaux"><span style={{cursor:"pointer"}}>{data && data[0].level.name}</span></Link>

                </div>
            </div>

            <div className="university__items">
                {loading && <p style={{display:'flex',justifyContent:'center',alignItems:'center'}}>Loading...</p>}
                {error && <p className="error">Error: {error.message}</p>}
                {data && data.map((item) => ( 
                    <div key={item.id} className="university__item">
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UniversityList;