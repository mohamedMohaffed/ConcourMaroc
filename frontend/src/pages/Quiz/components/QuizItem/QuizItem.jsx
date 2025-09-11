import React, { useEffect } from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';
const QuizItem = ({getData, currentQuestion, userAnser, selectedChoice, setSelectedChoice}) => {

    // Set selected choice based on previously submitted answer when question changes
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

    // Check if current question is already submitted
    const isSubmitted = userAnser.some(ans => ans.question_id === currentQuestion?.id);

    const handleChoice=(choice_id)=>{
        // Don't allow changing choice if already submitted
        if (isSubmitted) return;
        
        if(selectedChoice !== choice_id ){
        setSelectedChoice(choice_id)
    }else{
        setSelectedChoice(null)
    }
    }
      
    return (
        getData && currentQuestion && (
            <section className="quizitem">
                <div className="quizitem__question">
                    {<LatexRenderer latex={currentQuestion.question} />}
                </div>
                <div className="quizitem__choices">
                    {currentQuestion.choices?.map((choice,choiceIndex) => (
                        <div 
                            key={choice.id} 
                            className={`choice${selectedChoice === choice.id ? " choice__selected" : ""}${isSubmitted ? " choice__disabled" : ""}`} 
                            onClick={()=>handleChoice(choice.id)}
                            style={{cursor: isSubmitted ? 'not-allowed' : 'pointer'}}
                        >
                            <div className={`quizitem__choices-label${selectedChoice === choice.id ? " quizitem__choices-label--selected" : ""}`}>{String.fromCharCode(65 + choiceIndex)}</div>
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