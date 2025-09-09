import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './Quiz.css';
import ModeSelect from './components/ModeSelect/ModeSelect';
import QuizItem from './components/QuizItem/QuizItem';
import React, { useEffect } from 'react';
import useApi from '../../hooks/useApi';
import QuizHeader from './components/QuizHeader/QuizHeader';

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const [isModeSelect, setIsModeSelect] = useState(true);
    const [quizMode, setQuizMode] = useState("entrainement");
    const [getData, setGetData] = useState(false);

    const url = getData ? `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/?mode=${quizMode}` : null;

    const { data, error, loading } = useApi(url);

    useEffect(() => {
        if (!loading && data !== null) {
            console.log("Fetched data:", data);
        }
    }, [data, loading]);

    return(

        <section className="quiz">
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
            
            <QuizHeader 
                subject={subject_slug} 
                universite={universite_slug} 
                niveau={niveau_slug} 
                year={year_slug} 
                quizMode={quizMode} 
                getData={getData} 
            />
          
           
        </section>

    )}
export default Quiz;