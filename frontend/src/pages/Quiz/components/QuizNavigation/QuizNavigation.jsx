import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizNavigation.css';

const QuizNavigation = ({ index, setIndex, totalQuestions, getData, 
    selectedChoice,setSelectedChoice ,setUserAnser,userAnser,currentQuestion }) => {

    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);
    
    // Check if current question is already answered
    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
    const handleSubmet = () => {
        if (selectedChoice && currentQuestion) {
            setUserAnser(prev => {
                const filtered = prev.filter(ans => ans.question_id !== currentQuestion.id);
                return [...filtered, { question_id: currentQuestion.id, choice_id: selectedChoice }];
            });
        }
    }

    const handleCancel = () => {
        if (currentQuestion) {
            setSelectedChoice(null);
            setUserAnser(prev => prev.filter(ans => ans.question_id !== currentQuestion.id));
        }
    }

    // console.log("SD",userAnser)
    return (
        getData && (
            <section className="quiz__navigation">
                <button onClick={goToPrevious}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 
                    Précédent
                </button>

                <button
                    disabled={!isAnswered && !selectedChoice}
                    onClick={isAnswered ? handleCancel : handleSubmet}
                >
                    {isAnswered ? 'Annuler' : 'Soumettre'}
                </button>
                <button onClick={goToNext}>
                    Suivant
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </section>
        )
    )
}
export default QuizNavigation;