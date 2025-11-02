import confirmDelete from '../../Quiz/components/QuizNavigation/utils/confirmDelete';
import postQuizData from '../../Quiz/components/QuizNavigation/utils/postQuizData';

const useQuizActions = (
    index, setIndex, totalQuestions, {
        selectedChoice,
        setSelectedChoice,
        setUserAnser,
        userAnser,
        currentQuestion,
        type,
        data,
        navigate,
        setShowDeleteModal,
        setShowAuth
    } = {}
) => {
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

    const handleConfirmDelete = () => {
        confirmDelete({
            setShowDeleteModal,
            userAnser,
            data,
            type,
            setUserAnser,
            navigate
        });
    };

    const handlePostData = () => {
        postQuizData({
            type,
            userAnser,
            data,
            navigate,
            setShowDeleteModal,
            setShowAuth
        });
    };

    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    const allQuestionsAnswered = userAnser.length === totalQuestions && totalQuestions > 0;
    const canCancel = type === "Learn" && isAnswered;
    const canSubmit = !isAnswered && selectedChoice;

    return {
        goToPrevious,
        goToNext,
        handleSubmit,
        handleCancel,
        handleConfirmDelete,
        handlePostData,
        canCancel,
        canSubmit,
        allQuestionsAnswered,
        isAnswered
    };
};

export default useQuizActions;