// src/components/RespostaFeedback.js
import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const RespostaFeedback = ({ response }) => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleAccept = () => {
    console.log("Accepted:", response);
    setIsSubmitted(true);
  };

  const handleReject = () => {
    console.log("Rejected:", response);
    setIsSubmitted(true);
  };

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", feedback);
    setIsSubmitted(true);
  };

  return (
    <div className="feedback-container">
      {!isSubmitted && (
        <>
          <div className="feedback-buttons">
            <button onClick={handleAccept} className="accept-button">
              <FaThumbsUp style={{ marginRight: "8px" }} /> Resposta OK
            </button>
            <button onClick={handleReject} className="reject-button">
              <FaThumbsDown style={{ marginRight: "8px" }} /> Resposta Ruim!
            </button>
          </div>
          <div className="feedback-section">
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Adicione melhorias aqui..."
            />
            <button onClick={handleSubmitFeedback}>Enviar Feedback</button>
          </div>
        </>
      )}
      {isSubmitted && <p>Obrigado pelo seu feedback!</p>}
    </div>
  );
};

export default RespostaFeedback;
