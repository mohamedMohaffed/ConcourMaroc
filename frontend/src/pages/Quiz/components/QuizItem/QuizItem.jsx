import React from 'react';
import LatexRenderer from '../LatexRenderer/LatexRenderer';
import './QuizItem.css';
const QuizItem = ({getData, currentQuestion}) => {
   
    return (
        getData && currentQuestion && (
            <section className="quizitem">
                <div className="quizitem__question">
                    {<LatexRenderer latex={currentQuestion.question} />}
                </div>
                <div className="quizitem__choices">
                    {currentQuestion.choices?.map((choice) => (
                        <div key={choice.id} className="choice">
                            <LatexRenderer latex={choice.text} />
                        </div>
                    ))}
                </div>
            </section>
        )
    );
};

export default QuizItem;