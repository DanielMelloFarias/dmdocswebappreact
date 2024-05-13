// src/components/BlobUploader.js
import React, { useState, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl = "https://iadmdocs.blob.core.windows.net/;QueueEndpoint=https://iadmdocs.queue.core.windows.net/;FileEndpoint=https://iadmdocs.file.core.windows.net/;TableEndpoint=https://iadmdocs.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-05-22T18:47:29Z&st=2024-05-13T10:47:29Z&spr=https&sig=RlVe38lRsEWEr0Xlp3cXB2hVz%2BPFNov3M9EgTk8GKdk%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const blobSasUrl2 = process.env.REACT_APP_BLOB_SAS_URL;

const containerName = "fileupload-iadmdocs";
const containerClient = blobServiceClient.getContainerClient(containerName);
const containerName2 = process.env.REACT_APP_BLOB_CONTAINER_NAME;

console.log ("TESTE");
console.log ("Blob: ", blobSasUrl2);
console.log ("Container: ", containerName2);

const BlobUploader = () => {
  const [status, setStatus] = useState("");
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);

  const reportStatus = (message) => {
    setStatus((prevStatus) => `${prevStatus}${message}<br/>`);
  };



  const uploadFiles = async (files) => {
    try {
      reportStatus("Uploading files...");
      const promises = [];
      for (const file of files) {
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

  return (
    <div>

      <button onClick={() => fileInputRef.current.click()}>Select and upload files</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <button onClick={listFiles}>List files</button>
            
      <p><b>Status:</b></p>
      <p id="status" dangerouslySetInnerHTML={{ __html: status }} style={{ height: "160px", width: "593px", overflow: "scroll" }} />
      <p><b>Files:</b></p>
      <select
        id="file-list"
        multiple
        style={{ height: "222px", width: "593px", overflow: "scroll" }}
        onChange={(e) => {
          const options = Array.from(e.target.options);
          const selectedFiles = options.filter(option => option.selected).map(option => option.value);
          setFileList(fileList.map(file => ({
            name: file,
            selected: selectedFiles.includes(file)
          })));
        }}
      >
        {fileList.map(file => (
          <option key={file} value={file}>{file}</option>
        ))}
      </select>
    </div>
  );
};

export default BlobUploader;
