import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Quiz.css';

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug,subject_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`);
    console.log(data)
    return(
        <div className="quiz__header">
             <Link to={`/concours/${niveau_slug}/${universite_slug}/${year_slug}/matieres`}>
                    <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="quiz__go__back-icon"
                    size="xl"
                    />
            </Link>
            <h2 className="quiz_title">
                Concours de {subject_slug} - {universite_slug.toUpperCase()} ({niveau_slug}, {year_slug})
            </h2>
           
        </div>

    )
}
export default Quiz;