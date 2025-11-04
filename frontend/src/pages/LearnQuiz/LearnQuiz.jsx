import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import Quiz from '../Quiz/Quiz';
import Loading from '../../components/Loading/Loading';

const LearnQuiz=()=>{
    const { universite_slug, year_slug, subject_slug } = useParams();
    const url = `/concour/Bac/${universite_slug}/${year_slug}/${subject_slug}/concour/`;
    const { data, error, loading } = useApi(url);


    return(
        <>
         {loading && (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                background: "#fff",
            }}>
                <Loading />
            </div>
         )}

            <Quiz 
                data={data} subject_slug={subject_slug}
                universite_slug={universite_slug} 
                year_slug={year_slug}
                type="Learn"/>
        </>
        
    )

}
export default LearnQuiz;