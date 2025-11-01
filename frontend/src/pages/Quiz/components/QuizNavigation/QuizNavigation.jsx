import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizNavigation.css';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';
import React from 'react';
import postQuizData from './utils/postQuizData';
import confirmDelete from './utils/confirmDelete';

const QuizNavigation = React.memo(({ index, setIndex, totalQuestions, selectedChoice,
     setSelectedChoice, setUserAnser, userAnser, currentQuestion, data, type}) => {
    
    console.log('QuizNavigations rendered');

    const { goToPrevious, goToNext, handleSubmit, handleCancel } = useQuizActions(index, setIndex, totalQuestions, {
        selectedChoice,
        setSelectedChoice,
        setUserAnser,
        currentQuestion,
        type
    });
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAuth,setShowAuth] = useState(false);
    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
    const allQuestionsAnswered = userAnser.length === totalQuestions && totalQuestions > 0;
    

    const PostData = () => {
        postQuizData({
            type,
            userAnser,
            data,
            navigate,
            setShowDeleteModal,
            setShowAuth
        });
    };

    const handleConfirmDelete = () => {
        confirmDelete({
            setShowDeleteModal,
            userAnser,
            data,
            type,
            setUserAnser,
            navigate
        });
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
                    onConfirm={handleConfirmDelete}
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
                            timer: "00:09:02",
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