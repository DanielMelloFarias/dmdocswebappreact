// src/components/TalkToDocuments.js
import React, { useState } from "react";
import axios from "axios";
import RespostaFeedback from "./RespostaFeedback";

const TalkToDocuments = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = "https://peplink.openai.azure.com"; // Ensure this is your correct base URL
  const apiKey = "34b2484413db4eedbc9f0d967f71d249";
  const deployment = "Gpt4";

  const searchEndpoint = "https://iadevopssearch.search.windows.net";
  const searchTextP1 = "cmXWzroMX0R0VWV2jU1FvZ8jjRv";
  const searchTextP2 = "3JTNB8sZTDtmYiQAzSeCAfjtI";
  const searchIndexName = "iadmdocs";

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    try {
      const result = await axios.post(
        `${endpoint}/openai/deployments/${deployment}/extensions/chat/completions?api-version=2023-08-01-preview`,
        {
          messages: [
            {
              role: "user",
              content: question,
            },
            {
              role: "system",
              content: "You are an AI assistant that helps people find information.",
            }
          ],
          dataSources: [
            {
              type: "AzureCognitiveSearch",
              parameters: {
                endpoint: searchEndpoint,
                key: searchTextP1+searchTextP2,
                indexName: searchIndexName,
                inScope: false
              }
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          stream: false
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );

      // Process the response to extract content and references
      const messages = result.data.choices[0].message.content;
      const contextMessages = result.data.choices[0].message.context?.messages || [];
      let references = "";
      console.log ("Resposta: ", result);

      contextMessages.forEach(message => {
        if (message.role === "tool") {
          try {
            const contentObj = JSON.parse(message.content);
            contentObj.citations.forEach(citation => {
              references += `Title: ${citation.title}\nURL: ${citation.url}\n\n`;
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });

      setResponse(`Resposta:\n${messages}\n\nReferências:\n${references}`);
    } catch (error) {
      console.error("Error calling the API:", error);
      setResponse("There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>Talk to Documents - Converse com os Documentos</h2>
      <form onSubmit={handleFormSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Faça sua pergunta aqui..."
          style={{
            width: "450px",
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
              height: "200px",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              resize: "none",
            }}
          />
          {response && <RespostaFeedback response={response} />}
        </div>
      )}
    </div>
  );
};

export default TalkToDocuments;
