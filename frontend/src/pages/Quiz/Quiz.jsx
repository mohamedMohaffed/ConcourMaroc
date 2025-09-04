import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { } from '@fortawesome/free-solid-svg-icons';
import './Quiz.css';

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug,subject_slug } = useParams();
    const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`);

}
export default Quiz;