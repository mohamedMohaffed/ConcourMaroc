import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{ useState,useEffect,useMemo } from 'react';
import './Quiz.css';
import QuizItem from './components/QuizItem/QuizItem';
import useApi from '../../hooks/useApi';
import QuizHeader from './components/QuizHeader/QuizHeader';
import QuizNavigation from './components/QuizNavigation/QuizNavigation'

const Quiz =()=>{
    const { niveau_slug, universite_slug, year_slug, subject_slug } = useParams();
    const [userAnser,setUserAnser]=useState([])
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [startTime, setStartTime] = useState(null);
    console.log("userAnser :",userAnser)
    
    const url = `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/`;

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
        const length = data?.[0]?.questions?.length || 0;
        console.log("Total questions:", length);
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
                getData={data && !loading}
                circlesArray={circlesArray}
                changeIndex={setIndex}
                currentIndex={index}
                userAnser={userAnser}
                data={data}
            />

            <QuizItem data={data}
            getData={data && !loading} 
            currentQuestion={currentQuestion}
            userAnser={userAnser}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            />
            
            <QuizNavigation index={index} 
            setIndex={setIndex} 
            totalQuestions={totalQuestions}
            getData={data && !loading}
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