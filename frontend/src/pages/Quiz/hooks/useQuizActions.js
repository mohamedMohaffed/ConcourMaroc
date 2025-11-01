const useQuizActions = (index, setIndex, totalQuestions, {
    selectedChoice,
    setSelectedChoice,
    setUserAnser,
    currentQuestion,
    type
} = {}) => {

    const goToPrevious = () => index > 0 && setIndex(index - 1);
    const goToNext = () => index < totalQuestions - 1 && setIndex(index + 1);

    const handleSubmit = () => {
        if (selectedChoice && currentQuestion) {
            setUserAnser(prev => {
                const filtered = prev.filter(ans => ans.question_id !== currentQuestion.id);
                return [...filtered, { question_id: currentQuestion.id, choice_id: selectedChoice }];
            });
        }
    };

    const handleCancel = () => {
        if (currentQuestion && type === "Learn") {
            setSelectedChoice(null);
            setUserAnser(prev => prev.filter(ans => ans.question_id !== currentQuestion.id));
        }
    };

    return {
        goToPrevious,
        goToNext,
        handleSubmit,
        handleCancel
    };
};

export default useQuizActions;