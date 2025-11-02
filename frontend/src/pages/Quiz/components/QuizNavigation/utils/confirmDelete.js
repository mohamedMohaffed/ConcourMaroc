import axiosInstance from '../../../../../utils/axiosInstance';

const confirmDelete = async ({
    setShowDeleteModal,
    userAnser,
    questions,
    setUserAnser,
    navigate,
    concourId
}) => {
    setShowDeleteModal(false);
    
    try {
        
        const correctAnswers = userAnser.filter(ans => {
            const question = questions?.find(q => q.id === ans.question_id);
            
            if (!question) return false;
            
            const choice = question.choices?.find(c => c.id === ans.choice_id);
            return choice?.is_correct; 
        });

        const response = await axiosInstance.delete(
            `/concour/delete-correct-answers/${concourId}/`,
            {
                data: {
                    correct_answers: correctAnswers
                },
                skipAuthRedirect: true 
            }
        );
        
        if (response.status === 200) {
            setUserAnser(prev => 
                prev.filter(ans => {
                    const question = questions?.find(q => q.id === ans.question_id);
                    if (!question) return true;
                    const choice = question.choices?.find(c => c.id === ans.choice_id);
                    return !choice?.is_correct; 
                })
            );         
            // console.log(`Successfully deleted ${response.data.deleted_count} correct answers`);
        }
    } catch (error) {
        console.error('Error deleting correct answers:', error);
        alert('Erreur lors de la suppression des réponses correctes');
    } finally {
        navigate('/pratique');
    }
};

export default confirmDelete;
