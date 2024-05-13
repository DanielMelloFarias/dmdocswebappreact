// src/App.js
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./components/Home";
import BlobUploader from "./components/BlobUploader";
import TalkToDocuments from "./components/TalkToDocuments";
import TalkToAI from "./components/TalkToAI";

const App = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav style={{ padding: "10px", background: "#007bff", color: "#fff" }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            marginRight: "30px",
            color: isActive ? "yellow" : "white",
            textDecoration: "none"
          })}
        >
          Home |
        </NavLink>
        <NavLink
          to="/uploadFiles"
          style={({ isActive }) => ({
            marginRight: "30px",
            color: isActive ? "yellow" : "white",
            textDecoration: "none"
          })}
        >
          Upload Files - Suba Novos Documentos |
        </NavLink>
        <NavLink
          to="/talkToDocuments"
          style={({ isActive }) => ({
            marginRight: "30px",
            color: isActive ? "yellow" : "white",
            textDecoration: "none"
          })}
        >
          Tire Dúvidas dos Documentos |
        </NavLink>
        <NavLink
          to="/talkToAI"
          style={({ isActive }) => ({
            marginRight: "30px",
            color: isActive ? "yellow" : "white",
            textDecoration: "none"
          })}
        >
          Use o ChatGPT 4 - Geral |
        </NavLink>
      </nav>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/uploadFiles" element={<BlobUploader />} />
          <Route path="/talkToDocuments" element={<TalkToDocuments />} />
          <Route path="/talkToAI" element={<TalkToAI/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
