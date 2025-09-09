import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './QuizHeader.css';

const QuizHeader = ({ subject, universite, niveau, year, quizMode, getData ,circlesArray}) => {
    const [selectedCircle, setSelectedCircle] = useState(0); // Default to first circle (index 0)
    
    console.log("DS",circlesArray);
    return (
        <div className="quiz__header">
            <div className="quiz__header-info">
            <Link to={`/concours/${niveau}/${universite}/${year}/matieres`}>
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="quiz__go__back-icon"
                    size="lg"
                />
            </Link>
            <h3 className="quiz_title">
                <span className="quiz_title-prefix">Concours de</span> {subject} - 
                {universite.toUpperCase()} ({niveau}, {year}) - {getData ? quizMode : "..."}
            </h3>
            <div className="quiz_title-phone">{universite.toUpperCase()} ({niveau}, {year}) - {getData ? quizMode : "..."}
            </div>
            </div>
            <div className="quiz_header-navigation">
                {circlesArray.map((_, circleIndex) => (
                    <div 
                        key={circleIndex} 
                        className={`quiz__header-circle ${selectedCircle === circleIndex ? 'selected' : ''}`}
                        onClick={() => setSelectedCircle(circleIndex)}
                    >
                        {circleIndex + 1}
                    </div>
                ))}
            </div>


        </div>
    );
};

export default QuizHeader;