import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock,faChartLine,faArrowDown} from '@fortawesome/free-solid-svg-icons';
import happyBird from '../../../../assets/happy bird.png';
import sadBird from '../../../../assets/sad bird.png';
import { motion } from 'framer-motion';
import './InfoScore.css';

// Helper to format time (expects seconds or "hh:mm:ss")
function formatTime(time) {
    if (typeof time === "string" && time.includes(":")) {
        return time;
    }
    const sec = Number(time);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

const InfoScore=({data, handlleDeleteLastScore})=>{

    
    return(

        <div className="score__items">
                <div className="score__info-new">
                    <div className="score__info-item">
                        <span className="score__icon score__icon-chart">
                            <FontAwesomeIcon icon={faChartLine} />
                        </span>
                        <div>
                            <div className="score__label">Résultat</div>
                            <div className="score__value">{data.score.score} / {data.score.lenght_question}</div>
                        </div>
                    </div>
                    <div className="score__info-item">
                        <span className="score__icon score__icon-clock">
                            <FontAwesomeIcon icon={faUserClock} />
                        </span>
                        <div>
                            <div className="score__label">Temps Passé</div>
                            <div className="score__value">{formatTime(data.score.time_spent)}</div>
                        </div>
                    </div>
                </div>

                <div className="score__bird">
                    {(() => {
                        const score = Number(data.score.score);
                        const total = Number(data.score.lenght_question);
                        if (score < total / 2) {
                            return (
                                <>
                                    <img className="bird_img" src={sadBird} alt="Bird" width="300px" height="300px" />
                                    <div className="score__bird__said">
                                        <p className="score__bird__said-p">Dommage ! Tu feras mieux la prochaine fois !</p>
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
                                        <p className="score__bird__said-p">Bravo ! Excellent résultat ! Continue ainsi</p>
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
            <div className="score-text">
                <p className="score_p">Score sauvegardé automatiquement |  </p>
                <p className="delete-score" onClick={handlleDeleteLastScore}>Ne pas sauvegarder</p>
            </div>

            </div>
    )

}
export default InfoScore;