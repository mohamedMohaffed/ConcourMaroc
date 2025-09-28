import LatexRenderer from '../../../../Quiz/components/LatexRenderer/LatexRenderer';

const renderQuizSummary = ({quizData,data}) => {
        if (!quizData || !quizData[0] || !quizData[0].questions) return <p>Chargement du résumé...</p>;
        // Reverse questions so first question is first
        const questions = [...quizData[0].questions].reverse();

        const userAnswerMap = {};
    if (data && data.user_answers) {
        data.user_answers.forEach(ans => {
            userAnswerMap[ans.question] = ans.user_choice;
        });
    }
        return (
            <div className="score__quiz-summary">
                {questions.map((q, idx) => {
                    const userChoiceId = userAnswerMap[q.id];
                    const correctChoice = q.choices.find(c => c.is_correct);
                    const userChoice = q.choices.find(c => c.id === userChoiceId);
                    const isCorrect = userChoice && userChoice.is_correct;
                    return (
                        <div key={q.id} className="score__quiz-question">
                            <div className="score__quiz-question-title">
                                Q{idx + 1}. <LatexRenderer latex={q.question} />
                            </div>
                            <ul className="score__quiz-choices">
                                {q.choices.map(choice => {
                                    const isUser = choice.id === userChoiceId;
                                    const isRight = choice.is_correct;
                                    let choiceClass = "score__quiz-choice";
                                    if (isRight) choiceClass += " score__quiz-choice--correct";
                                    if (isUser && !isRight) choiceClass += " score__quiz-choice--user";
                                    if (isUser && isRight) choiceClass += " score__quiz-choice--user-correct";
                                    return (
                                        <li key={choice.id} className={choiceClass}>
                                            <LatexRenderer latex={choice.text} />
                                            {isRight && <span className="score__quiz-choice-icon">✔</span>}
                                            {isUser && !isRight && <span className="score__quiz-choice-icon">✗</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="score__quiz-feedback">
                                {isCorrect ? (
                                    <span className="score__quiz-feedback--good">Bonne réponse !</span>
                                ) : (
                                    <span className="score__quiz-feedback--bad">
                                        Mauvaise réponse. La bonne réponse était : <b><LatexRenderer latex={correctChoice ? correctChoice.text : ''} /></b>
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

export default renderQuizSummary;