import Quiz from '../Quiz/Quiz';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Loading from '../../components/Loading/Loading';

const PracticeQuiz=()=>{
    const { concours_slug } = useParams();
    const { data, error, loading } = useApi(`concour/mauvaises-reponses/${concours_slug}`);
    return(
        <>
        {loading && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '62vh',
                    overflow: "hidden",
                }}>
                    <Loading />
                </div>
            )}
            {error && <p className="error">Error: {error.message}</p>}

          
            {data && ( <Quiz 
                data={data} subject_slug={data.subject.slug}
                universite_slug={data.subject.year.university.slug}
                year_slug={data.subject.year.slug} type={"Practice"}/>)}
        </>
    )

}
export default PracticeQuiz;