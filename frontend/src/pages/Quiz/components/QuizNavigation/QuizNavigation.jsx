import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizNavigation.css';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import axiosInstance, { isLoggedIn } from '../../../../utils/axiosInstance';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';
import React from 'react';

const QuizNavigation = React.memo(({ index, setIndex, totalQuestions, 
    selectedChoice, setSelectedChoice, setUserAnser, userAnser, currentQuestion, data, type, elapsedSecondsRef }) => {
    
    console.log('QuizNavigations rendered');

    const { goToPrevious, goToNext, handleSubmit, handleCancel } = useQuizActions(index, setIndex, totalQuestions, {
        selectedChoice,
        setSelectedChoice,
        setUserAnser,
        userAnser,
        currentQuestion,
        type
    });
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAuth,setShowAuth] = useState(false);
    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
    const allQuestionsAnswered = userAnser.length === totalQuestions && totalQuestions > 0;
    

    const PostData = async () => {
        if (type === "Practice") {
            const correctAnswers = userAnser.filter(ans => {
                const question = data?.questions?.find(q => q.id === ans.question_id);
                if (!question) return false;
                const choice = question.choices?.find(c => c.id === ans.choice_id);
                return choice?.is_correct;
            });

            if (correctAnswers.length === 0) {
                navigate('/pratique');
                return;
            }

            setShowDeleteModal(true);
            return;
        }

        try {
            const secs = elapsedSecondsRef?.current || 0;
            const hours = Math.floor(secs / 3600);
            const minutes = Math.floor((secs % 3600) / 60);
            const seconds = secs % 60;
            const timeSpentStr = 
                ('0' + hours).slice(-2) + ':' +
                ('0' + minutes).slice(-2) + ':' +
                ('0' + seconds).slice(-2);

            const quizData = {
                concour_id: data?.[0]?.id || data?.id,
                time_spent: timeSpentStr, 
                answers: userAnser
            };

            const response = await axiosInstance.post(
                '/concour/utilisateur-score-et-reponses/',
                quizData
            );

            if (response.status === 200 || response.status === 201) {
                navigate(`/concours/resultat/${quizData.concour_id}/`);
            }
        } catch (error) {
            
            const loggedIn = await isLoggedIn({ skipRedirect: true });
            if (!loggedIn) {
                setShowAuth(true)
                return;
            }
            console.error('Error posting quiz data:', error);
            alert('Erreur lors de la soumission du quiz');
        }
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        
        try {
            const concourId = data?.[0]?.id || data?.id;
            
            const correctAnswers = userAnser.filter(ans => {
                const question = type === "Learn" 
                    ? data?.[0]?.questions?.find(q => q.id === ans.question_id)
                    : data?.questions?.find(q => q.id === ans.question_id);
                
                if (!question) return false;
                
                const choice = question.choices?.find(c => c.id === ans.choice_id);
                return choice?.is_correct; 
            });

            const response = await axiosInstance.delete(
                `/concour/delete-correct-answers/${concourId}/`,
                {
                    data: {
                        correct_answers: correctAnswers
                    },
                    skipAuthRedirect: true 
                }
            );
            
            if (response.status === 200) {
                setUserAnser(prev => 
                    prev.filter(ans => {
                        const question = type === "Learn" 
                            ? data?.[0]?.questions?.find(q => q.id === ans.question_id)
                            : data?.questions?.find(q => q.id === ans.question_id);
                        
                        if (!question) return true;
                        
                        const choice = question.choices?.find(c => c.id === ans.choice_id);
                        return !choice?.is_correct; 
                    })
                );
                
                console.log(`Successfully deleted ${response.data.deleted_count} correct answers`);
            }
        } catch (error) {
            console.error('Error deleting correct answers:', error);
            alert('Erreur lors de la suppression des réponses correctes');
        } finally {
            navigate('/pratique');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
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
                            onClick={isAnswered ? handleCancel : handleSubmit}
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
                    message="Veux-tu supprimer les questions dont la réponse est correcte ?"
                    buttonColor="#218838"
                />

                <DeleteModal
                    visible={showAuth}
                    onConfirm={() => {
                        localStorage.setItem('pendingQuizAnswers', JSON.stringify({
                            concour_id: data?.[0]?.id || data?.id,
                            answers: userAnser,
                            elapsedSeconds: elapsedSecondsRef?.current || 0, 
                        }));
                        setShowAuth(false);
                        navigate('/connexion?redirect=score');
                    }}
                    onCancel={()=> setShowAuth(false)}
                    message="Vous devez vous connecter ou vous inscrire. Ne vous inquiétez pas, nous enregistrerons vos réponses actuelles et vous pourrez voir le résultat après la connexion ou l'inscription."
                    buttonColor="#218838"
                    confirmText="Continuer"
                />
            </>
        )
    )
})
export default QuizNavigation;