import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './Quiz.css';
import ModeSelect from './components/ModeSelect/ModeSelect';
const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug,subject_slug } = useParams();
    // const { data, error, loading } = useApi(`/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`);
    // console.log(data)
    const [isModeSelect,setIsModeSelect] = useState(true);
    const [quizMode, setQuizMode] = useState("");
    return(

        <div className="quiz__header">
            {isModeSelect && 
                <ModeSelect 
                    mode={quizMode} 
                    setMode={setQuizMode}
                    onConfirm={() => {
                        setIsModeSelect(false);
                        // Additional logic for starting the quiz with the selected mode
                        console.log("Starting quiz in mode:", quizMode);
                    }}
                />
            }
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