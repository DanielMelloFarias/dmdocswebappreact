// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import BlobUploader from "./components/BlobUploader";
import TalkToIA from "./components/TalkToIA"; 
import TalkToDocuments from "./components/TalkToDocuments"; 

function App() {
  return (
    <div>
      <h1>Azure Blob Storage File Uploader</h1>
      <Routes>
        <Route path="/uploadFiles" element={<BlobUploader />} />
        <Route path="/talkToDocuments" element={<TalkToDocuments />} />
        <Route path="/TalkToIA" element={<TalkToIA />} />
      </Routes>
    </div>
  );
}

export default App;
