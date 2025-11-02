import axiosInstance, { isLoggedIn } from '../../../../../utils/axiosInstance';

const postQuizData = async ({
    type,
    userAnser,
    navigate,
    setShowDeleteModal,
    setShowAuth,
    questions,
    concour_id}) => {
    console.log("reder postQuizData")
    if (type === "Practice") {
        const correctAnswers = userAnser.filter(ans => {
            const question = questions?.find(q => q.id === ans.question_id);
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
        const quizData = {
            concour_id : concour_id,
            time_spent: "00:08:23", 
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