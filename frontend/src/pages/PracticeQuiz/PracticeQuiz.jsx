import Quiz from '../Quiz/Quiz';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Loading from '../../components/Loading/Loading';

const PracticeQuiz=()=>{
    const { concours_slug } = useParams();
    const { data, error, loading } = useApi(`concour/mauvaises-reponses/${concours_slug}`);
    if (loading) return <div><Loading/></div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;
    return(
        <section>
          
            <Quiz 
                data={data} subject_slug={data.subject.slug}
                universite_slug={data.subject.year.university.slug}
                niveau_slug={data.subject.year.university.level.slug} 
                year_slug={data.subject.year.slug} type={"Practice"}/>
        </section>
    )

}
export default PracticeQuiz;