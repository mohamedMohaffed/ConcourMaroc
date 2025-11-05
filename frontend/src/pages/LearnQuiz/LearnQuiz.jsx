import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import Quiz from '../Quiz/Quiz';
import Loading from '../../components/Loading/Loading';

const LearnQuiz=()=>{
    const { universite_slug, year_slug, subject_slug } = useParams();
    const url = `/concour/Bac/${universite_slug}/${year_slug}/${subject_slug}/concour/`;
    const { data, error, loading } = useApi(url);


    return (
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
            {data && (
                <Quiz 
                    data={data} subject_slug={subject_slug}
                    universite_slug={universite_slug} 
                    year_slug={year_slug}
                    type="Learn"/>
            )}
        </>
    )

}
export default LearnQuiz;