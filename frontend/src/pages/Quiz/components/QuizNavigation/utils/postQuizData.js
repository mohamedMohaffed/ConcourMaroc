import axiosInstance, { isLoggedIn } from '../../../../../utils/axiosInstance';

const postQuizData = async ({
    type,
    userAnser,
    data,
    navigate,
    setShowDeleteModal,
    elapsedSecondsRef,
    setShowAuth}) => {
    console.log("reder postQuizData")
    if (type === "Practice") {
        const correctAnswers = userAnser.filter(ans => {
            const question = data?.questions?.find(q => q.id === ans.question_id);
            if (!question) return false;
            const choice = question.choices?.find(c => c.id === ans.choice_id);
            return choice?.is_correct;
        });

        if (correctAnswers.length === 0) {
            navigate('/pratique');
            return;
        }

        setShowDeleteModal(true);
        return;
    }

    try {
        const secs = elapsedSecondsRef?.current || 0;
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;
        const timeSpentStr = 
            ('0' + hours).slice(-2) + ':' +
            ('0' + minutes).slice(-2) + ':' +
            ('0' + seconds).slice(-2);

        const quizData = {
            concour_id: data?.[0]?.id || data?.id,
            time_spent: timeSpentStr, 
            answers: userAnser
        };

        const response = await axiosInstance.post(
            '/concour/utilisateur-score-et-reponses/',
            quizData
        );

        if (response.status === 200 || response.status === 201) {
            navigate(`/concours/resultat/${quizData.concour_id}/`);
        }
    } catch (error) {
        const loggedIn = await isLoggedIn({ skipRedirect: true });
        if (!loggedIn) {
            setShowAuth(true);
            return;
        }
        console.error('Error posting quiz data:', error);
        alert('Erreur lors de la soumission du quiz');
    }
};

export default postQuizData;