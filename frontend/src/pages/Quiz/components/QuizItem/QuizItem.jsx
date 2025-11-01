import React, { useEffect, useState, useMemo, useRef } from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
    }, [currentQuestion?.id]);

    // Replace cthe generated color logic with backend hex_color
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

    const getChoiceClassName = (choice) => {
        let className = "choice";
        
        if (type === "Practice" && isSubmitted) {
            if (choice.is_correct) {
                className += " choice__correct";
            } else if (selectedChoice === choice.id) {
                className += " choice__incorrect";
            }
            className += " choice__disabled";
        } else {
            // Normal selection styling
            if (selectedChoice === choice.id) {
                className += " choice__selected";
            }
            if (isSubmitted && type === "Learn") {
                className += " choice__disabled";
            }
        }
        
        return className;
    };

    const getLabelClassName = (choice) => {
        let className = "quizitem__choices-label";
        
        if (type === "Practice" && isSubmitted) {
            if (choice.is_correct) {
                className += " quizitem__choices-label--correct";
            } else if (selectedChoice === choice.id) {
                className += " quizitem__choices-label--incorrect";
            }
        } else if (selectedChoice === choice.id) {
            className += " quizitem__choices-label--selected";
        }
        
        return className;
    };
      
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
                            <FontAwesomeIcon icon={faAlignLeft} />
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
                            className={getChoiceClassName(choice)}
                            onClick={() => handleChoice(choice.id)}
                        >
                            <div className={getLabelClassName(choice)}>
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
                                <FontAwesomeIcon icon={faTimes} />
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