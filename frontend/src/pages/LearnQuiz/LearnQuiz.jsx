import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import Quiz from '../Quiz/Quiz';

const LearnQuiz=()=>{
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const url = `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`;
    const { data, error, loading } = useApi(url);

    return(
        <Quiz data={data} subject_slug={subject_slug}
                universite_slug={universite_slug} niveau_slug={niveau_slug } year_slug={year_slug}/>
    )

}
export default LearnQuiz;