import React from "react";
import './ModeSelect.css'

const ModeSelect = ({ mode, setMode, onConfirm }) => (

  <div className="quiz__mode-overlay">
    <div className="quiz__mode-select">
      <h2>Choisissez le mode du quiz</h2>
      <div className="quiz__mode-options">
        {/* Mode Normal */}
        <div
          className={`quiz__mode-option ${mode === "normal" ? "active" : ""}`}
          onClick={() => setMode("normal")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="normal"
              checked={mode === "normal"}
              onChange={() => setMode("normal")}
            />
            <b>Mode Normal</b>
          </label>
          <ul>
            <li>Pas de limite de temps.</li>
            <li>Vous pouvez soumettre et annuler vos réponses.</li>
            <li>Vous voyez immédiatement si votre réponse est correcte ou non.</li>
            <li>Idéal pour l'entraînement et la révision.</li>
          </ul>
        </div>

        {/* Mode Examen */}
        <div
          className={`quiz__mode-option ${mode === "exam" ? "active" : ""}`}
          onClick={() => setMode("exam")}
        >
          <label>
            <input
              type="radio"
              name="quiz_mode"
              value="exam"
              checked={mode === "exam"}
              onChange={() => setMode("exam")}
            />
            <b>Mode Examen</b>
          </label>
          <ul>
            <li>Limite de temps stricte.</li>
            <li>Impossible d'annuler une réponse soumise.</li>
            <li>Les résultats sont affichés à la fin du quiz.</li>
            <li>Simule les conditions réelles d'un examen.</li>
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
