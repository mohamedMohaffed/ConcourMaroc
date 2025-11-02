import React, { useMemo, useState} from 'react';

import './QuizHeader.css';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';
import CirclesArray from './components/CirclesArray/CirclesArray';

const QuizHeader = React.memo(({ subject, universite, year, circlesArray, 
                                changeIndex, currentIndex, userAnser,type, questions }) => {

    console.log('QuizHeader rendered');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const questionsArray = useMemo(() => {
        return questions || [];
    }, [questions]);

    const isQuestionSubmitted = (questionIndex) => {
        if (!questions?.[questionIndex] || !userAnser) return false;
        const questionId = questions[questionIndex].id;
        return userAnser.some(ans => ans.question_id === questionId);
    };

    const isAnswerCorrect = (questionIndex) => {
        if (type !== "Practice" || !isQuestionSubmitted(questionIndex)) return false;
        const question = questions?.[questionIndex];
        if (!question) return false;
        const userAnswer = userAnser.find(ans => ans.question_id === question.id);
        if (!userAnswer) return false;
        const selectedChoice = question.choices.find(choice => choice.id === userAnswer.choice_id);
        return selectedChoice?.is_correct || false;
    };

    const currentIncorrectCount = type === "Practice" && questions?.[currentIndex]
        ? questions[currentIndex].incorrect_answer_count || 0
        : 0;

//---------------------------------
    return (
        <div className="quiz__header">
            <div className="quiz__header-info">
            <div
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={() => setShowDeleteModal(true)}
            >
                
                <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512" width="22" height="22" 
                className="quiz__go__back-icon">
                    <path d="M257.5 445.1c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-192-192c-12.5-12.5-12.5-32.8 0-45.3l192-192c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 224H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H109.3l148.2 149.1z"/>
                </svg>
            </div>
            <DeleteModal
                visible={showDeleteModal}
                onConfirm={() => {
                        setShowDeleteModal(false);
                        window.location.href = type === "Learn"
                            ? `/concours/Bac/${universite}/${year}/matieres`
                            : `/pratique`;
                        }}
                onCancel={() => setShowDeleteModal(false)}
                message="Êtes-vous sûr de vouloir quitter ce quiz ?"
                buttonColor="#ef4444"
                confirmText="Quitter"
            />
            <h3 className="quiz_title">
                <span className="quiz_title-prefix">Concours de</span> ({subject}-{universite}-{year})
            </h3>
            <div className="quiz_title-phone">{universite} ({year}) 
            </div>
            </div>

            <div className="quiz_header-navigation">
                
                <CirclesArray 
                    circlesArray={circlesArray}
                    questionsArray={questionsArray}
                    currentIndex={currentIndex}
                    isQuestionSubmitted={isQuestionSubmitted}
                    isAnswerCorrect={isAnswerCorrect}
                    changeIndex={changeIndex}
                    type={type}
                />
                
            </div>
            
            {type === "Practice" && currentIncorrectCount > 0 && (
                <div className="quiz__header-phase" style={{ marginTop: '8px' }}>
                    Vous avez répondu incorrectement à cette question {currentIncorrectCount} fois
                </div>
            )}
        </div>
    );
});

export default QuizHeader;

