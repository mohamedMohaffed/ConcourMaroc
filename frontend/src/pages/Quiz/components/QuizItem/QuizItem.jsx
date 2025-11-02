import React, { useEffect, useState, useMemo, useRef } from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';
import { motion } from 'framer-motion';

const API_BASE_URL = "http://localhost:8000"; 

const QuizItem = React.memo(({currentQuestion, userAnser, selectedChoice, setSelectedChoice, type}) => {
    console.log('QuizItem rendered');

    const [showContext, setShowContext] = useState(false);
    const shownContextIdsRef = useRef(new Set());

    useEffect(() => {
        if (
            currentQuestion?.exercice_context?.context_text &&
            !shownContextIdsRef.current.has(currentQuestion.id)
        ) {
            setShowContext(true);
            shownContextIdsRef.current.add(currentQuestion.id);
        } else {
            setShowContext(false);
        }
    }, [currentQuestion?.id,currentQuestion?.exercice_context?.context_text]);

    const contextColor = useMemo(() => {
        return currentQuestion?.exercice_context?.hex_color;
    }, [currentQuestion?.exercice_context?.hex_color]);

    useEffect(() => {
        if (currentQuestion && userAnser) {
            const previousAnswer = userAnser.find(ans => ans.question_id === currentQuestion.id);
            if (previousAnswer) {
                setSelectedChoice(previousAnswer.choice_id);
            } else {
                setSelectedChoice(null);
            }
        }
    }, [currentQuestion, userAnser, setSelectedChoice]);

    const isSubmitted = userAnser.some(ans => ans.question_id === currentQuestion?.id);

    const handleChoice = (choice_id) => {
        if (isSubmitted) return;
        
        if (type === "Practice") {
            setSelectedChoice(choice_id);
        } else {
            if (selectedChoice !== choice_id) {
                setSelectedChoice(choice_id);
            } else {
                setSelectedChoice(null);
            }
        }
    }

      
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                if (currentQuestion?.exercice_context?.context_text) {
                    setShowContext(true);
                }
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [currentQuestion]);
    
//----------------------
    return (
        currentQuestion && (
            <section className="quizitem">
                <div className="quizitem__question">
                    {currentQuestion.exercice_context && currentQuestion.exercice_context.context_text &&
                        <span
                            className="quizitem__question-icon"
                            onClick={() => setShowContext(true)}
                            style={{
                                cursor: 'pointer',
                                color: contextColor,
                                border: `2px solid ${contextColor}`,
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20">
                                <path d="M384 128C384 145.7 369.7 160 352 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L352 96C369.7 96 384 110.3 384 128zM384 384C384 401.7 369.7 416 352 416L128 416C110.3 416 96 401.7 96 384C96 366.3 110.3 352 128 352L352 352C369.7 352 384 366.3 384 384zM96 256C96 238.3 110.3 224 128 224L512 224C529.7 224 544 238.3 544 256C544 273.7 529.7 288 512 288L128 288C110.3 288 96 273.7 96 256zM544 512C544 529.7 529.7 544 512 544L128 544C110.3 544 96 529.7 96 512C96 494.3 110.3 480 128 480L512 480C529.7 480 544 494.3 544 512z"/>
                            </svg>
                        </span>
                    }
                    <span className="quizitem__question-text">
                        <LatexRenderer latex={currentQuestion.question} />
                    </span>
                </div>
                <div className="quizitem__choices">
                    {currentQuestion.choices?.map((choice, choiceIndex) => (
                        <div 
                            key={choice.id} 
                            className={`choice ${
                                type === "Practice" && isSubmitted 
                                    ? choice.is_correct 
                                        ? "choice__correct choice__disabled" 
                                        : selectedChoice === choice.id 
                                            ? "choice__incorrect choice__disabled" 
                                            : "choice__disabled"
                                    : selectedChoice === choice.id 
                                        ? "choice__selected" 
                                        : ""
                            } ${isSubmitted && type === "Learn" ? "choice__disabled" : ""}`}
                            onClick={() => handleChoice(choice.id)}
                        >
                            <div className={`quizitem__choices-label ${
                                type === "Practice" && isSubmitted
                                    ? choice.is_correct
                                        ? "quizitem__choices-label--correct"
                                        : selectedChoice === choice.id
                                            ? "quizitem__choices-label--incorrect"
                                            : ""
                                    : selectedChoice === choice.id
                                        ? "quizitem__choices-label--selected"
                                        : ""
                            }`}>
                                {String.fromCharCode(65 + choiceIndex)}
                            </div>
                            <div className="choice-content">
                                <LatexRenderer latex={choice.text} />
                            </div>
                        </div>
                    ))}
                </div>
                {showContext && (
                    <div className="quizitem__context-modal" onClick={() => setShowContext(false)}>
                        <motion.div
                            className="quizitem__context-modal-content"
                            drag
                            dragElastic={0.2}
                            dragMomentum={false}
                            onClick={e => e.stopPropagation()}
                            style={{
                                border: `2px solid ${contextColor}`,
                                color: "#777777", 
                                boxShadow: `0 8px 24px ${contextColor}30`
                            }}
                        >
                            <button className="quizitem__context-modal-close" 
                                onClick={() => setShowContext(false)}
                                style={{ 
                                    color: contextColor, 
                                    background: 'transparent', 
                                    border: 'none' 
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 352 512" width="18" height="18">
                                    <path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5s-32.2-12.3-44.5 0L198.2 211.5 98.1 111.4c-12.3-12.3-32.2-12.3-44.5 0s-12.3 32.2 0 44.5L153.7 256 53.6 356.1c-12.3 12.3-12.3 32.2 0 44.5s32.2 12.3 44.5 0l100.1-100.1 100.1 100.1c12.3 12.3 32.2 12.3 44.5 0s12.3-32.2 0-44.5L242.7 256z"/>
                                </svg>
                            </button>
                            <div className="quizitem__context-modal-body" style={ contextColor ? { color: '#777777' } : undefined }>
                                <div className="quizitem__context-modal-body-text">
                                    <LatexRenderer latex={currentQuestion.exercice_context?.context_text || ''} /></div>
                                
                                {currentQuestion.exercice_context?.images?.map((img, idx) => (
                                    <img
                                        className="quizitem__img"
                                        key={img.id || idx}
                                        src={`${API_BASE_URL}${img.image}`}
                                        alt={`Context image ${idx + 1}`}
                                        loading="lazy"
                                        onLoad={(e) => (e.target.style.filter = "blur(0)")
                                        }
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </section>
        )
    );
});

export default QuizItem;