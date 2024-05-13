// src/App.js
import React from "react";
import BlobUploader from "./components/BlobUploader";

// Log the environment variable
const containerName2 = process.env.REACT_APP_BLOB_CONTAINER_NAME;
console.log("Container Name: ", process.env.REACT_APP_BLOB_CONTAINER_NAME);
console.log("Container Name2: ", process.env.production.REACT_APP_BLOB_CONTAINER_NAME);
console.log("Container Name3: ", env.production.REACT_APP_BLOB_CONTAINER_NAME);

function App() {
  return (
    <div>
      <h1>Azure Blob Storage File Uploadir</h1>
      <BlobUploader />
    </div>
  );
}

export default App;
