import Quiz from '../Quiz/Quiz';
import { useParams } from 'react-router-dom';

const PracticeQuiz=()=>{
    const { concours_slug } = useParams();
    
    return(
        <section>
            <Quiz concours_slug={concours_slug}/>
        </section>
    )

}
export default PracticeQuiz;