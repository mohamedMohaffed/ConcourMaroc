import useQuizActions from '../../hooks/useQuizActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './QuizNavigation.css';
import { useNavigate } from 'react-router-dom';
import {useRef,useState,useEffect} from 'react';
import axiosInstance from '../../../../utils/axiosInstance';

const QuizNavigation = ({ index, setIndex, totalQuestions, 
    selectedChoice,setSelectedChoice ,setUserAnser,userAnser,currentQuestion, data }) => {

    const { goToPrevious, goToNext } = useQuizActions(index, setIndex, totalQuestions);
    const navigate = useNavigate();

    const isAnswered = userAnser.some(ans => ans.question_id === currentQuestion?.id);
    
    const allQuestionsAnswered = userAnser.length === totalQuestions && totalQuestions > 0;
    
    const handleSubmet = () => {
        if (selectedChoice && currentQuestion) {
            setUserAnser(prev => {
                const filtered = prev.filter(ans => ans.question_id !== currentQuestion.id);
                return [...filtered, { question_id: currentQuestion.id, choice_id: selectedChoice }];
            });
        }
    }

    const handleCancel = () => {
        if (currentQuestion) {
            setSelectedChoice(null);
            setUserAnser(prev => prev.filter(ans => ans.question_id !== currentQuestion.id));
        }
    }

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const PostData = async () => {
        try {
            const hours = Math.floor(elapsedSeconds / 3600);
            const minutes = Math.floor((elapsedSeconds % 3600) / 60);
            const seconds = elapsedSeconds % 60;
            const timeSpentStr = 
                ('0' + hours).slice(-2) + ':' +
                ('0' + minutes).slice(-2) + ':' +
                ('0' + seconds).slice(-2);

            const quizData = {
                concour_id: data?.[0]?.id,
                time_spent: timeSpentStr, 
                answers: userAnser
            };

            const response = await axiosInstance.post('/concour/utilisateur-score-et-reponses/', quizData);

            if (response.status === 200 || response.status === 201) {
                navigate(`/concours/resultat/${quizData.concour_id}/`);
            }


        } catch (error) {
            console.error('Error posting quiz data:', error);
            alert('Erreur lors de la soumission du quiz');
        }
    };
    return (
        data && (
            <section className="quiz__navigation">
                <div className="quiz__mobile-counter">
                    Question {index + 1} sur {totalQuestions}
                </div>

                <button 
                disabled={index === 0}
                onClick={goToPrevious}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 
                    <span className="quiz__nav-text">Précédent</span>
                </button>

                <div className="quiz__navigation__btn--endandsubmeit">
                <button
                    disabled={!isAnswered && !selectedChoice}
                    onClick={isAnswered ? handleCancel : handleSubmet}
                    style={isAnswered ? { backgroundColor: '#dc3545' } : {}}
                >
                    {isAnswered ? 'Annuler' : 'Soumettre'}
                </button>

                {allQuestionsAnswered && (
                    <button
                        onClick={PostData}
                        className="quiz__finish-btn"
                        style={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Terminer
                    </button>
                )}
                </div>

                <button 
                disabled={index === totalQuestions - 1}
                onClick={goToNext}>
                    <span className="quiz__nav-text">Suivant</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </section>
        )
    )
}
export default QuizNavigation;