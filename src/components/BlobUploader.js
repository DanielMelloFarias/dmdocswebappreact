// src/components/BlobUploader.js
import React, { useState, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl = "https://iadmdocs.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-05-11T02:06:28Z&st=2024-05-07T18:06:28Z&spr=https&sig=GiOMak%2FWR61vni8Zqp0z%2BYjCgdOIa3GIAWSRO9Ksk4Y%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const containerName = "fileupload-iadmdocs";
const containerClient = blobServiceClient.getContainerClient(containerName);

const BlobUploader = () => {
  const [status, setStatus] = useState("");
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);

  const reportStatus = (message) => {
    setStatus((prevStatus) => `${prevStatus}${message}<br/>`);
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
      reportStatus(`Done.`);
    } catch (error) {
      reportStatus(error.message);
    }
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

  const deleteFiles = async (selectedFiles) => {
    try {
      if (selectedFiles.length > 0) {
        reportStatus("Deleting files...");
        for (const file of selectedFiles) {
          await containerClient.deleteBlob(file);
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
      <button onClick={createContainer}>Create container</button>
      <button onClick={() => fileInputRef.current.click()}>Select and upload files</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <button onClick={listFiles}>List files</button>
      <button onClick={() => deleteFiles(fileList.filter(file => file.selected))}>Delete selected files</button>
      <button onClick={deleteContainer}>Delete container</button>
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
