const useQuizActions = (index, setIndex, totalQuestions) => {

    const goToPrevious = () => index > 0 && setIndex(index - 1);
    const goToNext = () => index < totalQuestions - 1 && setIndex(index + 1);
    // const handleCircleClick = (circleIndex) => setIndex(circleIndex);

    return {
    goToPrevious,
    goToNext,
    // handleCircleClick,

  };
}
export default useQuizActions;