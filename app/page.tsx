"use client";

// import Image from "next/image";
// import styles from "./page.module.css";
import { useState } from "react";
import FileUploader from "@/components/Uploader";
import Link from "next/link";

type ImageType = {
  name: string;
  file: string;
  fileType: string;
  originalFileSize: number;
  newFileSize?: number;
  percentageDiff?: number;
};
const CONVERT_TO = "jpeg";
export default function Home() {
  const [files, setFiles] = useState<ImageType[]>([]);

  const handleFileUpload = async (e: ImageType) => {
    const convertedFileUrl = `${e.file}-/format/${CONVERT_TO}/-/quality/normal/`;

    const response = await fetch(convertedFileUrl, { method: "HEAD" });
    const newFileSize = response.headers.get("content-length");
    const newFileSizeInKb = newFileSize ? parseInt(newFileSize) / 1000 : 0;
    const originalFileSizeInKb = e.originalFileSize / 1000;
    const percentageDiff = ((originalFileSizeInKb - newFileSizeInKb) / originalFileSizeInKb) * 100;

    setFiles([
      ...files,
      {
        ...e,
        file: convertedFileUrl,
        originalFileSize: parseFloat(originalFileSizeInKb.toFixed(2)),
        newFileSize: parseFloat(newFileSizeInKb.toFixed(2)),
        percentageDiff: parseFloat(percentageDiff.toFixed(0)),
      },
    ]);
  };
  const downloadFile = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name; // Suggested filename
    link.click();
  };

  return (
    <section>
      <h1>Hello from UC Converter</h1>
      <p>Convert any image to any format of your choice</p>
      <FileUploader handleFileUploadAction={handleFileUpload} />
      {/* <form action="">
        <label htmlFor="to-conversion">Convert image (s) to:</label>
        <select name="to-conversion" id="to-conversion">
          <option value="avif">AVIF</option>
          <option value="webp">WEBP</option>
          <option value="jpeg">JPEG</option>
        </select>
        <button>Convert</button>
      </form> */}
      {files.map((file, index) => {
        return (
          <div key={index}>
            <img src={file.file} alt={file.name} height={300} />
            <p>{file.name}</p>
            <div>
              <span>
                {file.fileType}{" "} { file.originalFileSize} kb
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>{" "}
                {CONVERT_TO} { file.newFileSize} kb 
              </span>
              <span> { file.percentageDiff }% saved</span>
            </div>
            {/* <button onClick={() => downloadFile(file.file, file.name)}>Download</button> */}
            <Link href={`${file.file}${file.name}.${CONVERT_TO}`} download>Download</Link>
          </div>
        );
      })}

    </section>
  );
}
