import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import Quiz from '../Quiz/Quiz';
import Loading from '../../components/Loading/Loading';
const LearnQuiz=()=>{
    const { universite_slug, year_slug, subject_slug } = useParams();
    const url = `/concour/Bac/${universite_slug}/${year_slug}/${subject_slug}/concour/`;
    const { data, error, loading } = useApi(url);
    console.log(data);
    if (loading) return <div><Loading/></div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;
    
    return(
        <Quiz 
            data={data} subject_slug={subject_slug}
            universite_slug={universite_slug} 
            year_slug={year_slug}
            type="Learn"/>
    )

}
export default LearnQuiz;