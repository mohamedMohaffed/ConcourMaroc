import React, { useEffect, useState } from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const QuizItem = ({currentQuestion, userAnser, selectedChoice, setSelectedChoice, type}) => {
    // keep context modal closed by default
    const [showContext, setShowContext] = useState(true);

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
            // In Practice mode, only allow selecting if not already submitted
            setSelectedChoice(choice_id);
        } else {
            // Learn mode - original behavior
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
            // Practice mode after submission - show correct/incorrect
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
      
    return (
        currentQuestion && (
            <section className="quizitem">
                <div className="quizitem__question">
                    {currentQuestion.exercice_context && currentQuestion.exercice_context.context_text &&
                        <span
                            className="quizitem__question-icon"
                            onClick={() => setShowContext(true)}
                            style={{ cursor: 'pointer' }}
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
                        >
                            <button className="quizitem__context-modal-close" 
                                onClick={() => setShowContext(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <div className="quizitem__context-modal-body">
                                {/* render the nested exercice_context text (safe access) */}
                                <LatexRenderer latex={currentQuestion.exercice_context?.context_text || ''} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </section>
        )
    );
};

export default QuizItem;