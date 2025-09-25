import useApi from '../../hooks/useApi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse ,faUserClock,faCircle,faChartLine,faArrowDown} from '@fortawesome/free-solid-svg-icons';
import './Score.css';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from 'framer-motion';
import happyBird from '../../assets/happy bird.png';
import sadBird from '../../assets/sad bird.png';
import { useState, useEffect } from 'react';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import LatexRenderer from '../../pages/Quiz/components/LatexRenderer/LatexRenderer';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Score = () => {
    const { concour_id } = useParams();
    const { data, error, loading } = useApi(`/concour/last-score/${concour_id}`);
    const navigate = useNavigate();
    console.log(data);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState("useranser"); // Set default to "useranser"
    const [quizData, setQuizData] = useState(null);
    const [allScores, setAllScores] = useState([]);

    // Fetch quiz data using slugs from score
    useEffect(() => {
        if (data && data.score) {
            const { slug_level, slug_university, slug_year, slug_subject } = data.score;
            if (slug_level && slug_university && slug_year && slug_subject) {
                const url = `/concour/${slug_level}/${slug_university}/${slug_year}/${slug_subject}/concour/`;
                axiosInstance.get(url).then(res => {
                    setQuizData(res.data);
                });
            }
        }
    }, [data]);

    // Fetch all scores for graph tab
    useEffect(() => {
        if (concour_id) {
            axiosInstance.get(`/concour/all-scores/${concour_id}/`).then(res => {
                setAllScores(res.data);
            });
        }
    }, [concour_id]);

    const breadcrumbs = data && data.score ? [
        { text: data.score.slug_level, link: "/concours/niveaux" },
        { text: data.score.slug_university, link: `/concours/${data.score.slug_level}/universites` },
        { text: data.score.slug_year, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/year` },
        { text: data.score.slug_subject, link: `/concours/${data.score.slug_level}/${data.score.slug_university}/${data.score.slug_year}/matieres` }
    ] : [];

    const formatTime = (duration) => {
        if (!duration) return "00:00:00";
        // Handles both "HH:MM:SS" and "369.0" (seconds as float)
        if (typeof duration === "string" && duration.includes(":")) {
            return duration.length === 8 ? duration : "0" + duration; // pad if needed
        }
        let seconds = typeof duration === "number" ? duration : parseInt(duration, 10);
        if (isNaN(seconds)) return duration;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s].map(x => String(x).padStart(2, '0')).join(":");
    };

    // Only render after loading is done and no error
    if (loading) {
        return <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</p>;
    }
    if (error) {
        return <p className="error">Error: {error.message}</p>;
    }
    if (!data || !data.score) {
        return null;
    }


    const handlleDeleteLastScore = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/concour/delete-last-score/${concour_id}/`);
            setShowDeleteModal(false);
            navigate("/concours/niveaux");
        } catch (err) {
            alert("Erreur lors de la suppression du score.");
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Helper: Map question_id -> user_choice_id
    const userAnswerMap = {};
    if (data && data.user_answers) {
        data.user_answers.forEach(ans => {
            userAnswerMap[ans.question] = ans.user_choice;
        });
    }

    // Helper: Render quiz summary
    const renderQuizSummary = () => {
        if (!quizData || !quizData[0] || !quizData[0].questions) return <p>Chargement du résumé...</p>;
        // Reverse questions so first question is first
        const questions = [...quizData[0].questions].reverse();
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

    // Prepare chart data (format dates for x-axis labels)
    const chartLabels = allScores.map(s => {
        const d = new Date(s.created_at);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const scoreData = allScores.map(s => s.score);
    const timeData = allScores.map(s => {
        if (typeof s.time_spent === "string" && s.time_spent.includes(":")) {
            const parts = s.time_spent.split(":").map(Number);
            // Convert to total seconds, then to minutes
            return (parts[0] * 3600 + parts[1] * 60 + parts[2]) / 60;
        }
        return Number(s.time_spent) / 60;
    });

    // Highlight last point and make it bigger
    const scorePointColors = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 'orange' : 'rgb(75, 192, 192)'
    );
    const timePointColors = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 'orange' : 'rgb(255, 99, 132)'
    );
    const scorePointRadius = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 6 : 5
    );
    const scorePointHoverRadius = scoreData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 8 : 7
    );
    const timePointRadius = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 6 : 5
    );
    const timePointHoverRadius = timeData.map((_, idx, arr) =>
        idx === arr.length - 1 ? 8 : 7
    );

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Score',
                data: scoreData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: scorePointColors,
                pointRadius: scorePointRadius,
                pointHoverRadius: scorePointHoverRadius,
            },
        ],
    };

    const chartTimeData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Temps Passé (minutes)',
                data: timeData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                pointBackgroundColor: timePointColors,
                pointRadius: timePointRadius,
                pointHoverRadius: timePointHoverRadius,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { mode: 'index', intersect: false },
            title: {
                display: true,
                text: 'Suivi du score',
                font: { size: 18 }
            }
        },
        scales: {
            x: {
                type: 'category',
                title: { display: true, text: 'Date' },
            },
            y: {
                title: { display: true, text: 'Score' },
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
    };

    // Options for time spent chart
    const chartTimeOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Temps passé',
                font: { size: 18 }
            }
        },
        scales: {
            ...chartOptions.scales,
            y: {
                title: { display: true, text: 'Temps Passé (minutes)' },
                beginAtZero: true,
            },
        },
    };

    return (
        <motion.section 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay:0.2}}
            className="score"
        >
            <div className="score__header">
                <h1 className="score__title desktop-title">
                    <span className="score__title--first-letter">R</span>
                   ésultats du Concours
                </h1>
                <h1 className="score__title mobile-title">
                    <span className="score__title--first-letter">C</span>
                   ésultats
                </h1>
                <div className="score__path">
                    <Link to="/concours/niveaux">
                        <FontAwesomeIcon icon={faHouse} style={{ cursor: "pointer" }} />
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            <FontAwesomeIcon icon={faChevronRight} />
                            {crumb.link ? (
                                <Link to={crumb.link}>
                                    <span style={{ cursor: "pointer" }}>{crumb.text}</span>
                                </Link>
                            ) : (
                                <span>{crumb.text}</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            <div className="score__items">
                <div className="score__info">
                    <div className="score__score">
                        <FontAwesomeIcon icon={faChartLine} style={{ fontSize: "1.5rem" }}/>
                        <h2> 
                            Résultat : {data.score.score} / {data.score.lenght_question}
                        </h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                        <FontAwesomeIcon icon={faCircle} style={{ fontSize: "0.5rem" }} />
                    </div>
                    <div className="score__time">
                        <FontAwesomeIcon icon={faUserClock} style={{ fontSize: "1.5rem" }}/>
                        <h2> 
                            Temps Passé : {formatTime(data.score.time_spent)}
                        </h2>
                    </div>
                </div>
                <div className="score__bird">
                    {(() => {
                        const score = Number(data.score.score);
                        const total = Number(data.score.lenght_question);
                        if (score < total / 2) {
                            return (
                                <>
                                    <img src={sadBird} alt="Bird" width="300px" height="300px" />
                                    <div className="score__bird__said">
                                        <p>Dommage ! Tu feras mieux la prochaine fois !</p>
                                        <motion.button
                                        className="score__btn__anayse"
                                            
                                            style={{ display: "block" }}
                                        >
                                            pour en savoir plus
                                            <motion.span style={{ marginLeft: 8 }}
                                            
                                            >
                                                <FontAwesomeIcon icon={faArrowDown} />
                                            </motion.span>
                                        </motion.button>
                                    </div>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <img src={happyBird} alt="Bird" width="300px" height="300px" />
                                    <div className="score__bird__said">
                                        <p>Bravo ! Excellent résultat ! Continue ainsi</p>
                                         <motion.button
                                        className="score__btn__anayse"
                                            
                                            style={{ display: "block" }}
                                        >
                                            pour en savoir plus
                                            <motion.span style={{ marginLeft: 8 }}
                                            
                                            >
                                                <FontAwesomeIcon icon={faArrowDown} />
                                            </motion.span>
                                        </motion.button>
                                    </div>
                                </>
                            );
                        }
                    })()}
                </div>
                <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Score sauvegardé automatiquement |  
                    <span style={{color:"red", marginLeft: "5px" , cursor:"pointer"}}
                    onClick={handlleDeleteLastScore}
                    > Ne pas sauvegarder</span>
                </p>
            </div>

            {/* NAVBAR TABS */}
            <div>
            <h1 className="score__detail__title">Voir les détails</h1>
            <div className="score__tabs-navbar">
                
                <button
                    className={activeTab === "useranser" ? "score__tab--active" : "score__tab"}
                    onClick={() => setActiveTab("useranser")}
                >
                    Mes choix
                </button>
                <button
                    className={activeTab === "analyse" ? "score__tab--active" : "score__tab"}
                    onClick={() => setActiveTab("analyse")}
                >
                    Analyse
                </button>
                <button
                    className={activeTab === "graph" ? "score__tab--active" : "score__tab"}
                    onClick={() => setActiveTab("graph")}
                >
                    Graphiques
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="score__tab-content">
                {activeTab === "useranser" && (
                    <div>
                        {renderQuizSummary()}
                    </div>
                )}
                {activeTab === "analyse" && (
                    <div>
                        {/* Analyse content */}
                        <p>Analyse détaillée de vos réponses et des corrections.</p>
                    </div>
                )}
                {activeTab === "graph" && (
                    <div>
                        {/* Graphiques content */}
                        <h2>Historique des scores</h2>
                        {allScores.length === 0 ? (
                            <p>Aucun score disponible pour ce concours.</p>
                        ) : (
                            <div className="score__graph">
                                <div className="score__graph__score" style={{ width: "800px", height: "400px" }}>
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                                <div className="score__graph__time" style={{ width: "800px", height: "400px" }}>
                                    <Line data={chartTimeData} options={chartTimeOptions} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>

            <DeleteModal
                visible={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Voulez-vous vraiment supprimer ce score ?"
            />
        </motion.section>
    );
};

export default Score;