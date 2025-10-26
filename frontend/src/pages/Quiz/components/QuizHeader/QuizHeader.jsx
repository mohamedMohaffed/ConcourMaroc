import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizHeader.css';
import Timer from './Timer/Timer';
import DeleteModal from '../../../../components/DeleteModal/DeleteModal';

const QuizHeader = React.memo(({ subject, universite, niveau, year, circlesArray, changeIndex, currentIndex, userAnser, data, type, elapsedSeconds, onToggleTimer, onRestartTimer, isTimerRunning }) => {
    console.log('QuizHeader rendered');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // derive questions array for mapping indices -> questions
    const questionsArray = useMemo(() => {
        return type === "Learn" ? (data?.[0]?.questions || []) : (data?.questions || []);
    }, [data, type]);

    // create a stable color for each unique context_text (same text -> same color)
    const contextColorMap = useMemo(() => {
        const map = {};
        const excludedHex = new Set(['#3b82f6', '#ff6700', '#f1f5f9'].map(h => h.toLowerCase()));

        const hslToHex = (h, s, l) => {
            // s,l are fractions (0..1), h in degrees 0..360
            s = Math.max(0, Math.min(1, s));
            l = Math.max(0, Math.min(1, l));
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const hh = (h / 60);
            const x = c * (1 - Math.abs((hh % 2) - 1));
            let r1 = 0, g1 = 0, b1 = 0;
            if (hh >= 0 && hh < 1) { r1 = c; g1 = x; b1 = 0; }
            else if (hh >= 1 && hh < 2) { r1 = x; g1 = c; b1 = 0; }
            else if (hh >= 2 && hh < 3) { r1 = 0; g1 = c; b1 = x; }
            else if (hh >= 3 && hh < 4) { r1 = 0; g1 = x; b1 = c; }
            else if (hh >= 4 && hh < 5) { r1 = x; g1 = 0; b1 = c; }
            else { r1 = c; g1 = 0; b1 = x; }
            const m = l - c / 2;
            const r = Math.round((r1 + m) * 255);
            const g = Math.round((g1 + m) * 255);
            const b = Math.round((b1 + m) * 255);
            const toHex = v => v.toString(16).padStart(2, '0');
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
        };

        const stringToHslColor = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let h = Math.abs(hash) % 360;
            const s = 0.70; // 70%
            const l = 0.45; // 45%

            // If generated hex matches an excluded color, shift hue and retry a few times
            let hex = hslToHex(h, s, l);
            let attempts = 0;
            while (excludedHex.has(hex) && attempts < 12) {
                h = (h + 37) % 360; // shift hue by a prime-ish number to vary colors
                hex = hslToHex(h, s, l);
                attempts++;
            }
            return `hsl(${h} 70% 45%)`;
        };
         for (const q of questionsArray) {
             const ctx = q?.exercice_context?.context_text;
             if (ctx && !map[ctx]) map[ctx] = stringToHslColor(ctx);
         }
         return map;
     }, [questionsArray]);
    
    // Function to check if a question is submitted
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

    // Function to check if answer is correct (for Practice mode)
    const isAnswerCorrect = (questionIndex) => {
        if (type !== "Practice" || !isQuestionSubmitted(questionIndex)) return false;
        
        const question = data?.questions?.[questionIndex];
        if (!question) return false;
        
        const userAnswer = userAnser.find(ans => ans.question_id === question.id);
        if (!userAnswer) return false;
        
        const selectedChoice = question.choices.find(choice => choice.id === userAnswer.choice_id);
        return selectedChoice?.is_correct || false;
    };

    // Get incorrect count for a question (Practice mode)
    const getIncorrectCount = (questionIndex) => {
        if (type !== "Practice" || !data?.questions?.[questionIndex]) return 0;
        return data.questions[questionIndex].incorrect_answer_count || 0;
    };

    // Get incorrect count for the current question (Practice mode)
    const currentIncorrectCount = type === "Practice" && data?.questions?.[currentIndex]
        ? data.questions[currentIndex].incorrect_answer_count || 0
        : 0;

    // Function to get circle class name
    const getCircleClassName = (questionIndex) => {
        let className = `quiz__header-circle ${currentIndex === questionIndex ? 'selected' : ''}`;
        
        if (isQuestionSubmitted(questionIndex)) {
            if (type === "Practice") {
                // Practice mode - show correct/incorrect
                className += isAnswerCorrect(questionIndex) ? ' correct' : ' incorrect';
            } else {
                // Learn mode - show orange for submitted
                className += ' submitted';
            }
        }
        
        return className;
    };

    // State for DeleteModal visibility

    // Handler for confirm (navigate away)
    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        window.location.href = type === "Learn"
            ? `/concours/${niveau}/${universite}/${year}/matieres`
            : `/pratique`;
    };

    // Handler for cancel
    const handleCancelDelete = () => setShowDeleteModal(false);

    return (
        <div className="quiz__header">
            <div className="quiz__header-info">
            {/* Replace Link with div to show DeleteModal */}
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
            {/* DeleteModal */}
            <DeleteModal
                visible={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="Êtes-vous sûr de vouloir quitter ce quiz ?"
                buttonColor="#ef4444"
                confirmText="Quitter"
            />
            <h3 className="quiz_title">
                <span className="quiz_title-prefix">Concours de</span> {subject} - 
                {universite} ({niveau}, {year}) 
            </h3>
            <div className="quiz_title-phone">{universite} ({niveau}, {year}) 
            </div>
            </div>
            <div className="quiz_header-navigation">
                
                {circlesArray.map((_, circleIndex) => {
                    const question = questionsArray[circleIndex];
                    const ctxText = question?.exercice_context?.context_text;
                    const color = ctxText ? contextColorMap[ctxText] : undefined;
                    const isSelected = currentIndex === circleIndex;
                    const submitted = isQuestionSubmitted(circleIndex);
                    const style = {};
                    if (isSelected) {
                        style.backgroundColor = '#3b82f6';
                        style.color = '#fff';
                        if (color) style.border = `2px solid ${color}`;
                    } else {
                        if (color) style.border = `2px solid ${color}`;
                        if (submitted) {
                            style.backgroundColor = '#f59e0b';
                            style.color = '#fff';
                        } else if (color) {
                            style.backgroundColor = color;
                            style.color = '#fff';
                        }
                    }
                     return (
                         <div
                             key={circleIndex}
                             className={getCircleClassName(circleIndex)}
                             onClick={() => changeIndex(circleIndex)}
                             style={Object.keys(style).length ? style : undefined}
                         >
                             <span>{circleIndex + 1}</span>
                         </div>
                     );
                })}
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

