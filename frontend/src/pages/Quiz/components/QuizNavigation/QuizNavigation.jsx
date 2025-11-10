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
        allQuestionsAnswered} = useQuizActions(index, setIndex, totalQuestions, {   
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
                    <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 640 640" >
                    <path fill="#ffffffff" d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="22" width="22">
                        <path fill="#ffffff" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/></svg>
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