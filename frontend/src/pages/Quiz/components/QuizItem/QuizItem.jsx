import React, { useEffect } from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';

const QuizItem = ({currentQuestion, userAnser, selectedChoice, setSelectedChoice, type}) => {

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
                    {<LatexRenderer latex={currentQuestion.question} />}
                </div>
                <div className="quizitem__choices">
                    {currentQuestion.choices?.map((choice, choiceIndex) => (
                        <div 
                            key={choice.id} 
                            className={getChoiceClassName(choice)}
                            onClick={() => handleChoice(choice.id)}
                            style={{cursor: isSubmitted ? 'not-allowed' : 'pointer'}}
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
            </section>
        )
    );
};

export default QuizItem;