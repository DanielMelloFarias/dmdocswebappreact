// src/components/SpeechToTextButton.js
import React, { useState } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

const SpeechToTextButton = ({ onTranscribe }) => {
  const [isRecording, setIsRecording] = useState(false);

  const APIKeyVoz = "7e740e7185db4e60ae4b2fdd4678d9de";
  const APIRegionVoz = "eastus";

  const handleRecordClick = async () => {
    setIsRecording(true);

    const speechConfig = speechsdk.SpeechConfig.fromSubscription(APIKeyVoz, APIRegionVoz);
    speechConfig.speechRecognitionLanguage = "pt-BR";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
      if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        onTranscribe(result.text);
      } else {
        console.error("Speech not recognized: ", result);
      }
      setIsRecording(false);
    });
  };

  return (
    <button
      onClick={handleRecordClick}
      disabled={isRecording}
      style={{
        padding: "10px 20px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        marginLeft: "10px",
      }}
    >
      <FontAwesomeIcon icon={faMicrophone} style={{ marginRight: "8px" }} />
      {isRecording ? "Recording..." : "Clique para falar"}
    </button>
  );
};

export default SpeechToTextButton;
