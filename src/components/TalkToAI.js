// src/components/TalkToDocuments.js
import React, { useState } from "react";
import axios from "axios";

const TalkToDocuments = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiBase = "https://peplink.openai.azure.com/openai/deployments/";
  const apiKey = "34b2484413db4eedbc9f0d967f71d249";
  const deploymentId = "Gpt4";

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    try {
      const result = await axios.post(
        `${apiBase}${deploymentId}/chat/completions?api-version=2024-02-15-preview`,
        {
          messages: [
            {
              role: "system",
              content: "You are an AI assistant that helps people find information.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 800,
          temperature: 0,
          frequency_penalty: 0,
          presence_penalty: 0,
          top_p: 1,
          stop: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );
      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling the API:", error);
      setResponse("There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>Talk to AI - ChatGPT 4 Geral</h2>
      <form onSubmit={handleFormSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
          style={{
            width: "300px",
            padding: "10px",
            fontSize: "14px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
      {isLoading ? (
        <p style={{ color: "#007bff" }}>Processing...</p>
      ) : (
        <div>
          <h3 style={{ color: "#333" }}>Response:</h3>
          <textarea
            value={response}
            readOnly
            style={{
              width: "100%",
              height: "150px",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              resize: "none",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TalkToDocuments;
