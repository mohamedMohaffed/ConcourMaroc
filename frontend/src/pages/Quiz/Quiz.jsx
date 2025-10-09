import React,{ useState,useEffect,useMemo } from 'react';
import './Quiz.css';
import QuizItem from './components/QuizItem/QuizItem';
import QuizHeader from './components/QuizHeader/QuizHeader';
import QuizNavigation from './components/QuizNavigation/QuizNavigation'

const Quiz =({data,subject_slug,universite_slug,niveau_slug,year_slug})=>{
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
    
    const currentQuestion = useMemo(() => 
        // data?.[0]?.questions?.[index], [data, index]
        data?.questions?.[index], [data, index]

    );
    const totalQuestions = useMemo(() => {
        // const length = data?.[0]?.questions?.length || 0;
        const length = data?.questions?.length || 0;

        return length;
        }, [data]);


    const circlesArray = useMemo(() => {
        return Array.from({ length: totalQuestions });
        }, [totalQuestions]);

    
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
            />

            <QuizItem 
                data={data}
                getData={data} 
                currentQuestion={currentQuestion}
                userAnser={userAnser}
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
            />
            
            <QuizNavigation index={index} 
                setIndex={setIndex} 
                totalQuestions={totalQuestions}
                getData={data}
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
                setUserAnser={setUserAnser}
                userAnser={userAnser}
                currentQuestion={currentQuestion}
                data={data}
                startTime={startTime}
            />

        </section>

    )}
export default Quiz;