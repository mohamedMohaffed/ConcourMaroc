import React from "react";
import './ModeSelect.css'

const ModeSelect = ({ mode, setMode, onConfirm }) => (

  <div className="quiz__mode-overlay">
    <div className="quiz__mode-select">
      <h2 className="quiz__mode-title">Choisissez le mode du quiz</h2>
      <div className="quiz__mode-options">
        {/* Mode entrainement */}
        <div
          className={`quiz__mode-option ${mode === "entrainement" ? "active" : ""}`}
          onClick={() => setMode("entrainement")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="entrainement"
              checked={mode === "entrainement"}
              onChange={() => setMode("entrainement")}
            />
            <b className="quiz__mode-subtitle">Mode entrainement</b>
          </label>
          <ul className="quiz__mode-list">
            <li>Réponses modifiables</li>
            <li>Voir la bonne réponse</li>
            <li>Voir l’explication</li>
            <li>Sans limite de temps</li>
            <li>Copier la question, les choix </li>
            <li>Prompt actuel pour l’IA</li>
          </ul>
        </div>

        {/* Mode examen */}
        <div
          className={`quiz__mode-option ${mode === "examen" ? "active" : ""}`}
          onClick={() => setMode("examen")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="examen"
              checked={mode === "examen"}
              onChange={() => setMode("examen")}
            />
            <b className="quiz__mode-subtitle">Mode examen</b>
          </label>
          <ul className="quiz__mode-list">
            <li>Réponses définitives</li>
            <li>Résultat à la fin</li>
            <li>Temps limité</li>
            <li>Conditions réelles d’examen</li>
            <li>gggg</li>
            <li>gggg</li>

          </ul>
        </div>
      </div>

      <button
        className="quiz__mode-submit-btn"
        disabled={!mode}
        onClick={onConfirm}
      >
        Commencer le quiz
      </button>
    </div>
  </div>
);

export default ModeSelect;
