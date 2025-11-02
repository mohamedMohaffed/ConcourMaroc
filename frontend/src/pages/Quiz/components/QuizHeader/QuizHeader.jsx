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
               style={{
                display: 'flex',
                cursor: 'pointer',
                alignItems: 'center', 
                justifyContent: 'center' 
                }}
                onClick={() => setShowDeleteModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="26" width="26" viewBox="0 0 640 640" className="quiz__go__back-icon">
                    <path fill="currentColor" d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/>
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

