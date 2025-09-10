import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React,{ useState,useEffect,useMemo } from 'react';
import './Quiz.css';
import ModeSelect from './components/ModeSelect/ModeSelect';
import QuizItem from './components/QuizItem/QuizItem';
import useApi from '../../hooks/useApi';
import QuizHeader from './components/QuizHeader/QuizHeader';

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const [isModeSelect, setIsModeSelect] = useState(true);
    const [quizMode, setQuizMode] = useState("Entrainement");
    const [getData, setGetData] = useState(false);

    const url = getData ? `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/?mode=${quizMode}` : null;

    const { data, error, loading } = useApi(url);

    useEffect(() => {
        if (!loading && data !== null) {
            console.log("Fetched data:", data);
        }
    }, [data, loading]);
    
    ///
    // Always use useMemo, but return default values if getData is false
     const [index, setIndex] = useState(0);
    
    const currentQuestion = useMemo(() => 
        data?.[0]?.questions?.[index], [data, index]
    );
    const totalQuestions = useMemo(() => {
        if (!getData) return 0;
        const length = data?.[0]?.questions?.length || 0;
        console.log("Total questions:", length);
        return length;
        }, [data, getData]);


    const circlesArray = useMemo(() => {
        if (!getData) return [];
        return Array.from({ length: totalQuestions });
        }, [totalQuestions, getData]);

    
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
                circlesArray={circlesArray}
                changeIndex={setIndex}
                currentIndex={index}
            />

            <QuizItem data={data}
            getData={getData} 
            currentQuestion={currentQuestion}/>

        </section>

    )}
export default Quiz;