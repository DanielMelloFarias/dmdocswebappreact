// src/components/SpeechToText.js
import React, { useState } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const APIKeyVoz = '7e740e7185db4e60ae4b2fdd4678d9de';
  const APIRegionVoz = 'eastus';

  const startRecognition = () => {
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(APIKeyVoz, APIRegionVoz);
    speechConfig.speechRecognitionLanguage = 'pt-BR';

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    setIsRecording(true);
    recognizer.recognizeOnceAsync(result => {
      setIsRecording(false);
      if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        setTranscript(result.text);
      } else {
        console.error('Recognition failed. Reason:', result);
      }
    }, err => {
      setIsRecording(false);
      console.error('Error recognizing speech:', err);
    });
  };

  return (
    <div>
      <button onClick={startRecognition} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <input type="text" value={transcript} readOnly />
    </div>
  );
};

export default SpeechToText;
