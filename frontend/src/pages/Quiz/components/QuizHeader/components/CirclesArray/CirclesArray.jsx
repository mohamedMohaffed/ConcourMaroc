const CirclesArray = ({circlesArray,questionsArray,
    currentIndex,isQuestionSubmitted,changeIndex,isAnswerCorrect,type}) => {
    
    console.log("CirclesArray renders ")
    return(
        <>
        {circlesArray.map((_, circleIndex) => {
                    const question = questionsArray[circleIndex];
                    const color = question?.exercice_context?.hex_color;
                    const isSelected = currentIndex === circleIndex;
                    const submitted = isQuestionSubmitted(circleIndex);
                    const style = {};
                    if (isSelected) {
                        style.backgroundColor = '#3b82f6';
                        style.color = '#fff';
                        if (color) style.border = `2px solid ${color}`;
                    } else {
                        if (color) style.border = `2px solid ${color}`;
                        if (submitted) {
                            style.backgroundColor = '#f59e0b';
                            style.color = '#fff';
                        } else if (color) {
                            style.backgroundColor = color;
                            style.color = '#fff';
                        }
                    }
                    return (
                        <div
                            key={circleIndex}
                            className={`quiz__header-circle ${currentIndex === circleIndex ? 'selected' : ''} ${
                                isQuestionSubmitted(circleIndex)
                                    ? type === "Practice"
                                        ? isAnswerCorrect(circleIndex) ? 'correct' : 'incorrect'
                                        : 'submitted'
                                    : ''
                            }`}
                            onClick={() => changeIndex(circleIndex)}
                            style={Object.keys(style).length ? style : undefined}
                        >
                            <span>{circleIndex + 1}</span>
                        </div>
                    );
                })}
                </>
    )
    

}
export default CirclesArray;