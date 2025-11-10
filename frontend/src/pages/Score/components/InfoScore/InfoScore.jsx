import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown} from '@fortawesome/free-solid-svg-icons';
import happyBird from '../../../../assets/happy bird.png';
import sadBird from '../../../../assets/sad bird.png';
import { motion } from 'framer-motion';
import './InfoScore.css';
import formatTime from './formatTime';

const InfoScore=({handlleDeleteLastScore,scoreNum,score_time_spent ,lenght_question})=>{

    return(
        <div className="score__items">
                <div className="score__info-new">
                    <div className="score__info-item">
                        <span className="score__icon score__icon-chart">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="currentColor" d="M128 128C128 110.3 113.7 96 96 96C78.3 96 64 110.3 64 128L64 464C64 508.2 99.8 544 144 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L144 480C135.2 480 128 472.8 128 464L128 128zM534.6 214.6C547.1 202.1 547.1 181.8 534.6 169.3C522.1 156.8 501.8 156.8 489.3 169.3L384 274.7L326.6 217.4C314.1 204.9 293.8 204.9 281.3 217.4L185.3 313.4C172.8 325.9 172.8 346.2 185.3 358.7C197.8 371.2 218.1 371.2 230.6 358.7L304 285.3L361.4 342.7C373.9 355.2 394.2 355.2 406.7 342.7L534.7 214.7z"/>
                            </svg>
                        </span>
                        <div>
                            <div className="score__label">Résultat</div>
                            <div className="score__value">{scoreNum} / {lenght_question}</div>
                        </div>
                    </div>
                    <div className="score__info-item">
                        <span className="score__icon score__icon-clock">
                            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="currentColor" d="M256 72C322.3 72 376 125.7 376 192C376 258.3 322.3 312 256 312C189.7 312 136 258.3 136 192C136 125.7 189.7 72 256 72zM226.3 368L285.7 368C289.6 368 293.6 368.1 297.5 368.4C281.3 396.6 272 429.2 272 464C272 505.8 285.4 544.5 308 576L77.7 576C61.3 576 48 562.7 48 546.3C48 447.8 127.8 368 226.3 368zM320 464C320 384.5 384.5 320 464 320C543.5 320 608 384.5 608 464C608 543.5 543.5 608 464 608C384.5 608 320 543.5 320 464zM464 384C455.2 384 448 391.2 448 400L448 464C448 472.8 455.2 480 464 480L512 480C520.8 480 528 472.8 528 464C528 455.2 520.8 448 512 448L480 448L480 400C480 391.2 472.8 384 464 384z"/></svg>
                        </span>
                        <div>
                            <div className="score__label">Temps Passé</div>
                            <div className="score__value">{formatTime(score_time_spent)}</div>
                        </div>
                    </div>
                </div>

                <div className="score__bird">
                    {(() => {
                        const score = Number(scoreNum);
                        const total = Number(lenght_question);
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
    )}
export default InfoScore;