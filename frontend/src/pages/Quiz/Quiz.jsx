import React,{ useState,useEffect,useMemo, useRef } from 'react';
import './Quiz.css';
import QuizItem from './components/QuizItem/QuizItem';
import QuizHeader from './components/QuizHeader/QuizHeader';
import QuizNavigation from './components/QuizNavigation/QuizNavigation';

const Quiz =React.memo(({data,subject_slug,universite_slug,
                            niveau_slug,year_slug,type})=>{
    console.log('Quiz rendered');

    const [userAnser,setUserAnser] = useState([])
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [startTime, setStartTime] = useState(null);
    

    useEffect(() => {
        if (data !== null) {
            if (!startTime) {
                setStartTime(new Date());
            }
        }
    }, [data, startTime]);
    
    
     const [index, setIndex] = useState(0);
    
    const currentQuestion = useMemo(() => {
        if(type == "Learn"){
            return data?.[0]?.questions?.[index];
        } else {
            return data?.questions?.[index];
        }
    }, [data, index, type]);
    
    const totalQuestions = useMemo(() => {
        if(type == "Learn"){
            return data?.[0]?.questions?.length || 0;
        } else {
            return data?.questions?.length || 0;
        }
    }, [data, type]);


    const circlesArray = useMemo(() => {
        return Array.from({ length: totalQuestions });
        }, [totalQuestions]);

    // Timer logic in parent
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const timerRef = useRef(null);

    // stable ref to avoid passing a changing primitive prop into QuizNavigation
    const elapsedSecondsRef = useRef(elapsedSeconds);
    useEffect(() => {
        elapsedSecondsRef.current = elapsedSeconds;
    }, [elapsedSeconds]);

    useEffect(() => {
        if (type === "Learn" && isTimerRunning) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isTimerRunning, type]);

    // Toggle timer running state
    const handleToggleTimer = () => setIsTimerRunning(prev => !prev);
    const handleRestartTimer = () => {
        setElapsedSeconds(0);
        setIsTimerRunning(true);
    };

    return(
        <section className="quiz">
            <QuizHeader 
                subject={subject_slug} 
                universite={universite_slug} 
                niveau={niveau_slug} 
                year={year_slug} 
                getData={data}
                circlesArray={circlesArray}
                changeIndex={setIndex}
                currentIndex={index}
                userAnser={userAnser}
                data={data}
                type={type}
                elapsedSeconds={type === "Learn" ? elapsedSeconds : undefined}
                onToggleTimer={type === "Learn" ? handleToggleTimer : undefined}
                onRestartTimer={type === "Learn" ? handleRestartTimer : undefined}
                isTimerRunning={type === "Learn" ? isTimerRunning : undefined}
            />

            <QuizItem 
                data={data}
                getData={data} 
                currentQuestion={currentQuestion}
                userAnser={userAnser}
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
                type={type}
            />
            
            <QuizNavigation 
                index={index} 
                setIndex={setIndex} 
                totalQuestions={totalQuestions}
                getData={data}
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
                setUserAnser={setUserAnser}
                userAnser={userAnser}
                currentQuestion={currentQuestion}
                data={data}
                type={type}
                elapsedSecondsRef={type === "Learn" ? elapsedSecondsRef : undefined}
            />

        </section>
    )});
    
export default Quiz;