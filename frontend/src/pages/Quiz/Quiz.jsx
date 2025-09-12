import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React,{ useState,useEffect,useMemo } from 'react';
import './Quiz.css';
import ModeSelect from './components/ModeSelect/ModeSelect';
import QuizItem from './components/QuizItem/QuizItem';
import useApi from '../../hooks/useApi';
import QuizHeader from './components/QuizHeader/QuizHeader';
import QuizNavigation from './components/QuizNavigation/QuizNavigation'

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const [isModeSelect, setIsModeSelect] = useState(true);
    const [quizMode, setQuizMode] = useState("Entrainement");
    const [getData, setGetData] = useState(false);
    const [userAnser,setUserAnser]=useState([])
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [startTime, setStartTime] = useState(null);
    console.log("userAnser :",userAnser)
    const url = getData ? `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/?mode=${quizMode}` : null;

    const { data, error, loading } = useApi(url);
    console.log(data)
    useEffect(() => {
        if (!loading && data !== null) {
            console.log("Fetched data:", data);
            if (!startTime) {
                setStartTime(new Date());
            }
        }
    }, [data, loading, startTime]);
    
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
                userAnser={userAnser}
                data={data}
            />

            <QuizItem data={data}
            getData={getData} 
            currentQuestion={currentQuestion}
            userAnser={userAnser}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            />
            
            <QuizNavigation index={index} 
            setIndex={setIndex} 
            totalQuestions={totalQuestions}
            getData={getData}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            setUserAnser={setUserAnser}
            userAnser={userAnser}
            currentQuestion={currentQuestion}
            data={data}
            quizMode={quizMode}
            startTime={startTime}
            />

        </section>

    )}
export default Quiz;