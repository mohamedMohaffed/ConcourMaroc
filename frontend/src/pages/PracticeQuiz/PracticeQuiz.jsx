import Quiz from '../Quiz/Quiz';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';

const PracticeQuiz=()=>{
    const { concours_slug } = useParams();
    const { data, error, loading } = useApi(`concour/mauvaises-reponses/${concours_slug}`);
    console.log(data)
    return(
        <section>
            <h1>DATA</h1>
        </section>
    )

}
export default PracticeQuiz;