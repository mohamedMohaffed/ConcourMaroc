import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizHeader.css';

const QuizHeader = ({ subject, universite, niveau, year, circlesArray, changeIndex, currentIndex, userAnser, data, type }) => {
    
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
            </div>


        </div>
    );
};

export default QuizHeader;

// toUpperCase()