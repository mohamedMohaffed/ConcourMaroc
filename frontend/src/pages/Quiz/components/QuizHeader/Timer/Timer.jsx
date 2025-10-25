import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop, faRedo, faPlay } from '@fortawesome/free-solid-svg-icons';
import './Timer.css';
const Timer = ({ elapsedSeconds = 0, onToggleTimer = () => {}, onRestartTimer = () => {}, isTimerRunning = false }) => {

       const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return(
            <div className="quiz__header-timer-controls">
                        <span className="quiz__header-timer">
                            {formatTime(elapsedSeconds)}
                        </span>
                        <button
                            onClick={onToggleTimer}
                            className="quiz__header-timer-btn"
                            title={isTimerRunning ? "Stop" : "Continue"}
                        >
                            <FontAwesomeIcon icon={isTimerRunning ? faStop : faPlay} />
                        </button>
                        <button
                            onClick={onRestartTimer}
                            className="quiz__header-timer-btn"
                            title="Restart"
                        >
                            <FontAwesomeIcon icon={faRedo} />
                        </button>
                    </div>
    )

}

export default React.memo(Timer);