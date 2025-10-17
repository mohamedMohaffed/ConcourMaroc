import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStop, faRedo, faPlay } from '@fortawesome/free-solid-svg-icons';
import './QuizHeader.css';

const QuizHeader = ({ subject, universite, niveau, year, circlesArray, changeIndex, currentIndex, userAnser, data, type, elapsedSeconds, onToggleTimer, onRestartTimer, isTimerRunning }) => {
    
    // Function to check if a question is submitted
    const isQuestionSubmitted = (questionIndex) => {
        let questionId;
        
        if (type === "Learn") {
            if (!data?.[0]?.questions?.[questionIndex] || !userAnser) return false;
            questionId = data[0].questions[questionIndex].id;
        } else {
            if (!data?.questions?.[questionIndex] || !userAnser) return false;
            questionId = data.questions[questionIndex].id;
        }
        
        return userAnser.some(ans => ans.question_id === questionId);
    };

    // Function to check if answer is correct (for Practice mode)
    const isAnswerCorrect = (questionIndex) => {
        if (type !== "Practice" || !isQuestionSubmitted(questionIndex)) return false;
        
        const question = data?.questions?.[questionIndex];
        if (!question) return false;
        
        const userAnswer = userAnser.find(ans => ans.question_id === question.id);
        if (!userAnswer) return false;
        
        const selectedChoice = question.choices.find(choice => choice.id === userAnswer.choice_id);
        return selectedChoice?.is_correct || false;
    };

    // Get incorrect count for a question (Practice mode)
    const getIncorrectCount = (questionIndex) => {
        if (type !== "Practice" || !data?.questions?.[questionIndex]) return 0;
        return data.questions[questionIndex].incorrect_answer_count || 0;
    };

    // Get incorrect count for the current question (Practice mode)
    const currentIncorrectCount = type === "Practice" && data?.questions?.[currentIndex]
        ? data.questions[currentIndex].incorrect_answer_count || 0
        : 0;

    // Function to get circle class name
    const getCircleClassName = (questionIndex) => {
        let className = `quiz__header-circle ${currentIndex === questionIndex ? 'selected' : ''}`;
        
        if (isQuestionSubmitted(questionIndex)) {
            if (type === "Practice") {
                // Practice mode - show correct/incorrect
                className += isAnswerCorrect(questionIndex) ? ' correct' : ' incorrect';
            } else {
                // Learn mode - show orange for submitted
                className += ' submitted';
            }
        }
        
        return className;
    };

    // Format elapsedSeconds as hh:mm:ss
    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="quiz__header">
            <div className="quiz__header-info">
            <Link to={ type == "Learn" ? `/concours/${niveau}/${universite}/${year}/matieres` : `/pratique` }>
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="quiz__go__back-icon"
                    size="lg"
                />
            </Link>
            <h3 className="quiz_title">
                <span className="quiz_title-prefix">Concours de</span> {subject} - 
                {universite} ({niveau}, {year}) 
            </h3>
            <div className="quiz_title-phone">{universite} ({niveau}, {year}) 
            </div>
            </div>
            <div className="quiz_header-navigation">
                
                {circlesArray.map((_, circleIndex) => (
                    <div 
                        key={circleIndex} 
                        className={getCircleClassName(circleIndex)}
                        onClick={() => changeIndex(circleIndex)}
                    >
                        <span>{circleIndex + 1}</span>
                    </div>
                ))}
                {/* Timer display and controls only for Learn */}
                {type === "Learn" && (
                    <div className="quiz__header-timer-controls">
                        <span className="quiz__header-timer">
                            {formatTime(elapsedSeconds)}
                        </span>
                        <button
                            onClick={onToggleTimer}
                            className="quiz__header-timer-btn"
                            title={isTimerRunning ? "Stop" : "Continue"}
                        >
                            <FontAwesomeIcon icon={isTimerRunning ? faStop : faPlay} />
                        </button>
                        <button
                            onClick={onRestartTimer}
                            className="quiz__header-timer-btn"
                            title="Restart"
                        >
                            <FontAwesomeIcon icon={faRedo} />
                        </button>
                    </div>
                )}
            </div>
            {/* Show incorrect count phase/message for current question in Practice mode, under circles */}
            {type === "Practice" && currentIncorrectCount > 0 && (
                <div className="quiz__header-phase" style={{ marginTop: '8px' }}>
                    You answered incorrectly for this question {currentIncorrectCount} time{currentIncorrectCount > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default QuizHeader;

// toUpperCase()