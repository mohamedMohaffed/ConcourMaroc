import useApi from '../../hooks/useApi';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse ,faUserClock,faCircle,faChartLine} from '@fortawesome/free-solid-svg-icons';
import './Score.css';
import { motion } from 'framer-motion';
import happyBird from '../../assets/happy bird.png';
import sadBird from '../../assets/sad bird.png';

const Score = () => {
    const { concour_id } = useParams();
    const { data, error, loading } = useApi(`/concour/last-score/${concour_id}`);
    console.log(data);
  

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
                                    <p className="score__bird__said">Dommage ! Tu feras mieux la prochaine fois !</p>
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <img src={happyBird} alt="Bird" width="300px" height="300px" />
                                    <p className="score__bird__said">Bravo ! Excellent résultat ! Continue ainsi</p>
                                </>
                            );
                        }
                    })()}
                </div>
                <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Score sauvegardé automatiquement |  
                    <span style={{color:"red", marginLeft: "5px"}}> Ne pas sauvegarder</span>
                </p>
            </div>
        </motion.section>
    );
};

export default Score;