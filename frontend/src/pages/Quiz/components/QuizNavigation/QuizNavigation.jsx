import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './QuizNavigation.css';
import axiosInstance from '../../../../utils/axiosInstance';
const QuizNavigation = ({ index, setIndex, totalQuestions, getData, 
    selectedChoice,setSelectedChoice ,setUserAnser,userAnser,currentQuestion, data, quizMode, startTime }) => {

    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);
    
    // Check if current question is already answered
    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
    // Check if all questions are answered
    const allQuestionsAnswered = userAnser.length === totalQuestions && totalQuestions > 0;
    
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

    // const calculateTimeSpent = () => {
    //     if (!startTime) return "00:00:00";
    //     const endTime = new Date();
    //     const diffMs = endTime - startTime;
    //     const hours = Math.floor(diffMs / (1000 * 60 * 60));
    //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // };

    const PostData = async () => {
        try {
            const quizData = {
                concour_id: data?.[0]?.id,
                type: quizMode,
                time_spent: "00:06:09",
                answers: userAnser
            };

            console.log("Posting quiz data:", quizData);
            
            const response = await axiosInstance.post('/concour/utilisateur-score-et-reponses/', quizData);

            if (response.status === 200 || response.status === 201) {
                alert('Quiz terminé avec succès!');
                // You might want to redirect or show results
            }
        } catch (error) {
            console.error('Error posting quiz data:', error);
            alert('Erreur lors de la soumission du quiz');
        }
    };

    return (
        getData && (
            <section className="quiz__navigation">
                {/* Mobile question counter */}
                <div className="quiz__mobile-counter">
                    Question {index + 1} sur {totalQuestions}
                </div>

                <button 
                disabled={index === 0}
                onClick={goToPrevious}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 
                    <span className="quiz__nav-text">Précédent</span>
                </button>

                <div className="quiz__navigation__btn--endandsubmeit">
                <button
                    disabled={!isAnswered && !selectedChoice}
                    onClick={isAnswered ? handleCancel : handleSubmet}
                    style={isAnswered ? { backgroundColor: '#dc3545' } : {}}
                >
                    {isAnswered ? 'Annuler' : 'Soumettre'}
                </button>

                {allQuestionsAnswered && (
                    <button
                        onClick={PostData}
                        className="quiz__finish-btn"
                        style={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Terminer
                    </button>
                )}
                </div>

                <button 
                disabled={index === totalQuestions - 1}
                onClick={goToNext}>
                    <span className="quiz__nav-text">Suivant</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </section>
        )
    )
}
export default QuizNavigation;