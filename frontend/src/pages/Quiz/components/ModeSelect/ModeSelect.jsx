import React from "react";
import './ModeSelect.css'

const ModeSelect = ({ mode, setMode, onConfirm }) => (

  <div className="quiz__mode-overlay">
    <div className="quiz__mode-select">
      <h2 className="quiz__mode-title">Choisissez le mode du quiz</h2>
      <div className="quiz__mode-options">
        {/* Mode Entrainement */}
        <div
          className={`quiz__mode-option ${mode === "Entrainement" ? "active" : ""}`}
          onClick={() => setMode("Entrainement")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="Entrainement"
              checked={mode === "Entrainement"}
              onChange={() => setMode("Entrainement")}
            />
            <b className="quiz__mode-subtitle">Mode Entrainement</b>
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

        {/* Mode Examen */}
        <div
          className={`quiz__mode-option ${mode === "Examen" ? "active" : ""}`}
          onClick={() => setMode("Examen")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="Examen"
              checked={mode === "Examen"}
              onChange={() => setMode("Examen")}
            />
            <b className="quiz__mode-subtitle">Mode Examen</b>
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
