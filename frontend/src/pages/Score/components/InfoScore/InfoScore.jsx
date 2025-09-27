import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock,faCircle,faChartLine,faArrowDown} from '@fortawesome/free-solid-svg-icons';
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
                <div className="score__info">
                    <div className="score__score">
                        <FontAwesomeIcon icon={faChartLine} style={{ fontSize: "1.5rem" }}/>
                        <h2> 
                            Résultat : {data.score.score} / {data.score.lenght_question}
                        </h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                         marginTop: "2px" }}>
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
    )

}
export default InfoScore;