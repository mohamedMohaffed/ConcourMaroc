import useQuizActions from '../../hooks/useQuizActions';
import './QuizNavigation.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';
import React from 'react';

const QuizNavigation = React.memo(({
    index, setIndex, totalQuestions, 
    selectedChoice,
    setSelectedChoice, setUserAnser,
     userAnser, currentQuestion,type,questions,concourId
}) => {
    console.log('QuizNavigations rendered');

    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

     


    

 

    const {
        goToPrevious,
        goToNext,
        handleSubmit,
        handleCancel,
        handleConfirmDelete,
        handlePostData,
        canCancel,
        canSubmit,
        allQuestionsAnswered
    } = useQuizActions(index, setIndex, totalQuestions, {   
                            selectedChoice,
                            setSelectedChoice,
                            setUserAnser,
                            userAnser,
                            currentQuestion,
                            type,
                            navigate,
                            setShowDeleteModal,
                            setShowAuth,
                            questions,
                            concourId});

    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);

    return (
        <>
            <section className="quiz__navigation">
                <div className="quiz__mobile-counter">
                    Question {index + 1} sur {totalQuestions}
                </div>

                <button
                    disabled={index === 0}
                    onClick={goToPrevious}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18">
                        <path d="M257.5 445.1c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-192-192c-12.5-12.5-12.5-32.8 0-45.3l192-192c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 224H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H109.3l148.2 149.1z"/>
                    </svg>
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
                            onClick={handlePostData}
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18">
                        <path d="M190.5 66.9c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L338.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h306.7L190.5 66.9z"/>
                    </svg>
                </button>
            </section>

            <DeleteModal
                visible={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    navigate('/pratique');
                }}
                message="Veux-tu supprimer les questions dont la réponse est correcte ?"
                buttonColor="#218838"
            />

            <DeleteModal
                visible={showAuth}
                onConfirm={handlePostData}
                onCancel={() => setShowAuth(false)}
                message="Vous devez vous connecter ou vous inscrire. Ne vous inquiétez pas, nous enregistrerons vos réponses actuelles et vous pourrez voir le résultat après la connexion ou l'inscription."
                buttonColor="#218838"
                confirmText="Continuer"
            />
        </>
    );
});
export default QuizNavigation;