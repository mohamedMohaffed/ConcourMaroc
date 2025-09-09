import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizHeader.css';

const QuizHeader = ({ subject, universite, niveau, year, quizMode, getData }) => {
    return (
        <div className="quiz__header">
            <Link to={`/concours/${niveau}/${universite}/${year}/matieres`}>
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="quiz__go__back-icon"
                    size="xl"
                />
            </Link>
            <h2 className="quiz_title">
                Concours de {subject} - {universite.toUpperCase()} ({niveau}, {year}) - {getData ? quizMode : "loading..."}
            </h2>
        </div>
    );
};

export default QuizHeader;