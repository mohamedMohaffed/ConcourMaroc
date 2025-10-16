import axiosInstance from './axiosInstance';

export async function submitPendingQuizAnswers(navigate) {
    const pending = localStorage.getItem('pendingQuizAnswers');
    if (pending) {
        const { concour_id, answers, elapsedSeconds } = JSON.parse(pending);
        const hours = Math.floor((elapsedSeconds || 0) / 3600);
        const minutes = Math.floor(((elapsedSeconds || 0) % 3600) / 60);
        const seconds = (elapsedSeconds || 0) % 60;
        const timeSpentStr =
            ('0' + hours).slice(-2) + ':' +
            ('0' + minutes).slice(-2) + ':' +
            ('0' + seconds).slice(-2);
        try {
            const response = await axiosInstance.post('/concour/utilisateur-score-et-reponses/', {
                concour_id,
                time_spent: timeSpentStr,
                answers,
            });
            if (response.status === 200 || response.status === 201) {
                localStorage.removeItem('pendingQuizAnswers');
                navigate(`/concours/resultat/${concour_id}/`);
            }
            return true;
        } catch (err) {
            localStorage.removeItem('pendingQuizAnswers');
            navigate('/concours/Bac/universites');
            return true;
        }
    }
    return false;
}
