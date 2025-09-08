import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './Quiz.css';
import ModeSelect from './components/ModeSelect/ModeSelect';
import QuizItem from './components/QuizItem/QuizItem';
import React, { useEffect } from 'react';
import useApi from '../../hooks/useApi';

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug,subject_slug } = useParams();
    const [isModeSelect,setIsModeSelect] = useState(true);
    const [quizMode, setQuizMode] = useState("");
    const [getData,setGetData]=useState(false);

    const url = getData ? `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/?mode=${quizMode}` : null;

    const { data, error, loading } = useApi(url);

    useEffect(() => {
        if (!loading && data !== null) {
            console.log("Fetched data:", data);
        }
    }, [data, loading]);

    return(

        <div className="quiz__header">
            {isModeSelect && 
                <ModeSelect 
                    mode={quizMode} 
                    setMode={setQuizMode}
                    onConfirm={() => {
                        setIsModeSelect(false);
                        setGetData(true)
                        
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

    )}
export default Quiz;