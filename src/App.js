// src/App.js
import React, { useState, useRef } from 'react';
import { BlobServiceClient } from "@azure/storage-blob";
import './index.css';

const blobSasUrl = "https://iadmdocs.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-05-11T02:06:28Z&st=2024-05-07T18:06:28Z&spr=https&sig=GiOMak%2FWR61vni8Zqp0z%2BYjCgdOIa3GIAWSRO9Ksk4Y%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "fileupload-iadmdocs";
const containerClient = blobServiceClient.getContainerClient(containerName);

function App() {
  const [status, setStatus] = useState("");
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef();

  const reportStatus = (message) => {
    setStatus((prevStatus) => `${prevStatus}\n${message}`);
  };

  const createContainer = async () => {
    try {
      reportStatus(`Creating container "${containerName}"...`);
      await containerClient.create();
      reportStatus(`Done. URL: ${containerClient.url}`);
    } catch (error) {
      reportStatus(error.message);
    }
  };

  const deleteContainer = async () => {
    try {
      reportStatus(`Deleting container "${containerName}"...`);
      await containerClient.delete();
      reportStatus("Done.");
    } catch (error) {
      reportStatus(error.message);
    }
  };

  const uploadFiles = async () => {
    try {
      reportStatus("Uploading files...");
      const promises = [];
      for (const file of fileInputRef.current.files) {
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        promises.push(blockBlobClient.uploadBrowserData(file));
      }
      await Promise.all(promises);
      reportStatus("Done.");
      listFiles();
    } catch (error) {
      reportStatus(error.message);
    }
  };

  const listFiles = async () => {
    setFileList([]);
    try {
      reportStatus("Retrieving file list...");
      let iter = containerClient.listBlobsFlat();
      let blobItem = await iter.next();
      const files = [];
      while (!blobItem.done) {
        files.push(blobItem.value.name);
        blobItem = await iter.next();
      }
      setFileList(files);
      if (files.length > 0) {
        reportStatus("Done.");
      } else {
        reportStatus("The container does not contain any files.");
      }
    } catch (error) {
      reportStatus(error.message);
    }
  };

  const deleteFiles = async () => {
    try {
      if (fileList.length > 0) {
        reportStatus("Deleting files...");
        for (const fileName of fileList) {
          await containerClient.deleteBlob(fileName);
        }
        reportStatus("Done.");
        listFiles();
      } else {
        reportStatus("No files selected.");
      }
    } catch (error) {
      reportStatus(error.message);
    }
  };

  return (
    <div>

      <button onClick={() => fileInputRef.current.click()}>Select and upload files</button>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={uploadFiles}
      />
      <button onClick={listFiles}>List files</button>


      <p><b>Status:</b></p>
      <textarea value={status} readOnly style={{ height: '160px', width: '593px', overflow: 'scroll' }} />

      <p><b>Files:</b></p>
      <select multiple style={{ height: '222px', width: '593px', overflow: 'scroll' }}>
        {fileList.map((fileName, index) => (
          <option key={index}>{fileName}</option>
        ))}
      </select>
    </div>
  );
}

export default App;
