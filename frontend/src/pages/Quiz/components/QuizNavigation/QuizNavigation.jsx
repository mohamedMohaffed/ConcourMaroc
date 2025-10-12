import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizNavigation.css';
import { useNavigate } from 'react-router-dom';
import {useRef,useState,useEffect} from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';

const QuizNavigation = ({ index, setIndex, totalQuestions, 
    selectedChoice, setSelectedChoice, setUserAnser, userAnser, currentQuestion, data, type }) => {

    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
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
        if (currentQuestion && type === "Learn") {
            // Only allow canceling in Learn mode
            setSelectedChoice(null);
            setUserAnser(prev => prev.filter(ans => ans.question_id !== currentQuestion.id));
        }
    }

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const PostData = async () => {
        if (type === "Practice") {
            console.log("do something when pratique type");
            setShowDeleteModal(true);
            return;
        }

        try {
            const hours = Math.floor(elapsedSeconds / 3600);
            const minutes = Math.floor((elapsedSeconds % 3600) / 60);
            const seconds = elapsedSeconds % 60;
            const timeSpentStr = 
                ('0' + hours).slice(-2) + ':' +
                ('0' + minutes).slice(-2) + ':' +
                ('0' + seconds).slice(-2);

            const quizData = {
                concour_id: data?.[0]?.id || data?.id,
                time_spent: timeSpentStr, 
                answers: userAnser
            };

            const response = await axiosInstance.post('/concour/utilisateur-score-et-reponses/', quizData);

            if (response.status === 200 || response.status === 201) {
                navigate(`/concours/resultat/${quizData.concour_id}/`);
            }
        } catch (error) {
            console.error('Error posting quiz data:', error);
            alert('Erreur lors de la soumission du quiz');
        }
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        
        try {
            const concourId = data?.[0]?.id || data?.id;
            
            // Find correct answers from userAnser
            const correctAnswers = userAnser.filter(ans => {
                const question = type === "Learn" 
                    ? data?.[0]?.questions?.find(q => q.id === ans.question_id)
                    : data?.questions?.find(q => q.id === ans.question_id);
                
                if (!question) return false;
                
                const choice = question.choices?.find(c => c.id === ans.choice_id);
                return choice?.is_correct; // Only correct answers
            });

            const response = await axiosInstance.delete(`/concour/delete-correct-answers/${concourId}/`, {
                data: {
                    correct_answers: correctAnswers
                }
            });
            
            if (response.status === 200) {
                // Remove correct answers from userAnser state
                setUserAnser(prev => 
                    prev.filter(ans => {
                        const question = type === "Learn" 
                            ? data?.[0]?.questions?.find(q => q.id === ans.question_id)
                            : data?.questions?.find(q => q.id === ans.question_id);
                        
                        if (!question) return true;
                        
                        const choice = question.choices?.find(c => c.id === ans.choice_id);
                        return !choice?.is_correct; // Keep only incorrect answers
                    })
                );
                
                console.log(`Successfully deleted ${response.data.deleted_count} correct answers`);
            }
        } catch (error) {
            console.error('Error deleting correct answers:', error);
            alert('Erreur lors de la suppression des réponses correctes');
        } finally {
            // Redirect to pratique page regardless of success or error
            navigate('/pratique');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        // Redirect to pratique page when user cancels
        navigate('/pratique');
    };

    const canCancel = type === "Learn" && isAnswered;
    const canSubmit = !isAnswered && selectedChoice;

    return (
        data && (
            <>
                <section className="quiz__navigation">
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
                            disabled={!canSubmit && !canCancel}
                            onClick={isAnswered ? handleCancel : handleSubmet}
                            style={isAnswered && type === "Learn" ? { backgroundColor: '#dc3545' } : {}}
                        >
                            {isAnswered && type === "Learn" ? 'Annuler' : 'Soumettre'}
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
                
                <DeleteModal
                    visible={showDeleteModal}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    message="Veux-tu supprimer les questions dont la réponse est correcte ?
"
                />
            </>
        )
    )
}
export default QuizNavigation;