import React,{ useState,useEffect,useMemo } from 'react';
import './Quiz.css';
import QuizItem from './components/QuizItem/QuizItem';
import QuizHeader from './components/QuizHeader/QuizHeader';
import QuizNavigation from './components/QuizNavigation/QuizNavigation';

const Quiz =React.memo(({data,subject_slug,universite_slug,year_slug,type})=>{
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
    
        return(
        <section className="quiz">
            <QuizHeader 
                subject={subject_slug} 
                universite={universite_slug} 
                year={year_slug} 
                circlesArray={circlesArray}
                changeIndex={setIndex}
                currentIndex={index}
                userAnser={userAnser}
                data={data}
                type={type}
            />

            <QuizItem 
                
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
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
                setUserAnser={setUserAnser}
                userAnser={userAnser}
                currentQuestion={currentQuestion}
                data={data}
                type={type}
            />

        </section>
    )});
    
export default Quiz;