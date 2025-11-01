import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizHeader.css';
import Timer from './components/Timer/Timer';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';
import CirclesArray from './components/CirclesArray/CirclesArray';

const QuizHeader = React.memo(({ subject, universite, niveau, year, circlesArray, 
    changeIndex, currentIndex, userAnser, data, type, elapsedSeconds, onToggleTimer, 
    onRestartTimer, isTimerRunning }) => {
    console.log('QuizHeader rendered');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const questionsArray = useMemo(() => {
        return type === "Learn" ? (data?.[0]?.questions || []) : (data?.questions || []);
    }, [data, type]);

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

    const isAnswerCorrect = (questionIndex) => {
        if (type !== "Practice" || !isQuestionSubmitted(questionIndex)) return false;
        
        const question = data?.questions?.[questionIndex];
        if (!question) return false;
        
        const userAnswer = userAnser.find(ans => ans.question_id === question.id);
        if (!userAnswer) return false;
        
        const selectedChoice = question.choices.find(choice => choice.id === userAnswer.choice_id);
        return selectedChoice?.is_correct || false;
    };

    const currentIncorrectCount = type === "Practice" && data?.questions?.[currentIndex]
        ? data.questions[currentIndex].incorrect_answer_count || 0
        : 0;

    const getCircleClassName = (questionIndex) => {
        let className = `quiz__header-circle ${currentIndex === questionIndex ? 'selected' : ''}`;
        
        if (isQuestionSubmitted(questionIndex)) {
            if (type === "Practice") {
                className += isAnswerCorrect(questionIndex) ? ' correct' : ' incorrect';
            } else {
                className += ' submitted';
            }
        }
        return className;
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        window.location.href = type === "Learn"
            ? `/concours/${niveau}/${universite}/${year}/matieres`
            : `/pratique`;
    };

    const handleCancelDelete = () => setShowDeleteModal(false);

    return (
        <div className="quiz__header">
            <div className="quiz__header-info">
            <div
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={() => setShowDeleteModal(true)}
            >
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="quiz__go__back-icon"
                    size="lg"
                />
            </div>
            <DeleteModal
                visible={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="Êtes-vous sûr de vouloir quitter ce quiz ?"
                buttonColor="#ef4444"
                confirmText="Quitter"
            />
            <h3 className="quiz_title">
                <span className="quiz_title-prefix">Concours de</span> ({subject}-{universite}-{niveau}{year})
            </h3>
            <div className="quiz_title-phone">{universite} ({niveau}, {year}) 
            </div>
            </div>

            <div className="quiz_header-navigation">
                
                <CirclesArray 
                circlesArray={circlesArray}
                questionsArray={questionsArray}
                currentIndex={currentIndex}
                isQuestionSubmitted={isQuestionSubmitted}
                getCircleClassName={getCircleClassName}
                changeIndex={changeIndex}
                />
                
                {type === "Learn" && (
                    <Timer
                        elapsedSeconds={elapsedSeconds}
                        onToggleTimer={onToggleTimer}
                        onRestartTimer={onRestartTimer}
                        isTimerRunning={isTimerRunning}
                    />
                )}
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

