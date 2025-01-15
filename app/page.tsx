"use client";

// import Image from "next/image";
// import styles from "./page.module.css";
import { useEffect, useState } from "react";
import FileUploader from "@/components/Uploader";
import Link from "next/link";

type ImageType = {
  name: string;
  cdnUrl: string;
  fileType: string;
  originalFileSize: number;
  newFileSize?: number;
  optimizedUrl?: string;
  percentageDiff?: number;
};

export default function Home() {
  const [files, setFiles] = useState<ImageType[]>([]);
  const [fileType, setFileType] = useState("jpg"); // avif, webp, jpeg
  const convertedFileUrl = (image: string) => (`${image}-/format/${fileType}/-/quality/normal/`);


  // const handleSelectFileType = async (e: React.FormEvent<HTMLSelectElement>) => {
  //   e.preventDefault();
  //   const selectedConversionType = (e.target as HTMLSelectElement).value;
  //   setFileType(selectedConversionType);
  // }

  const handleConversion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    // Convert formData to an object for easier handling
    const values = Object.fromEntries(formData.entries());
  
    console.log(values);
    setFileType(values.fileType as string);
    const convertImages = async (images: ImageType[]) => {
      const newOptimizedUrl = (cdnUrl: string) => (`${cdnUrl}-/format/${values.fileType}/-/quality/normal/`);

      images.map(async (image) => {
        const response = await fetch(newOptimizedUrl(image.cdnUrl), { method: "HEAD" });
        const newFileSize = response.headers.get("content-length");
        const newFileSizeInKb = newFileSize ? parseInt(newFileSize) / 1000 : 0;
        const originalFileSizeInKb = image.originalFileSize;
        const percentageDiff = ((originalFileSizeInKb - newFileSizeInKb) / originalFileSizeInKb) * 100;

  
        setFiles([
          {
            ...image,
            optimizedUrl: newOptimizedUrl(image.cdnUrl),
            newFileSize: parseFloat(newFileSizeInKb.toFixed(2)),
            percentageDiff: parseFloat(percentageDiff.toFixed(0)),
          },
        ]);
       });
    }
    convertImages(files);
  }

  const convertImages = async (images: ImageType[]) => {


    images.map(async (image) => {
      const response = await fetch(convertedFileUrl(image.cdnUrl), { method: "HEAD" });
      const newFileSize = response.headers.get("content-length");
      const newFileSizeInKb = newFileSize ? parseInt(newFileSize) / 1000 : 0;
      const originalFileSizeInKb = image.originalFileSize / 1000;
      const percentageDiff = ((originalFileSizeInKb - newFileSizeInKb) / originalFileSizeInKb) * 100;

      setFiles([
        ...files,
        {
          ...image,
          optimizedUrl: convertedFileUrl(image.cdnUrl),
          originalFileSize: parseFloat(originalFileSizeInKb.toFixed(2)),
          newFileSize: parseFloat(newFileSizeInKb.toFixed(2)),
          percentageDiff: parseFloat(percentageDiff.toFixed(0)),
        },
      ]);
     });
  }

  const handleFileUpload = async (e: ImageType) => {
    const image = [e];
    convertImages(image);
  };
  // const downloadFile = (url: string, name: string) => {
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = name; // Suggested filename
  //   link.click();
  // };

  return (
    <section>
      <h1>Hello from UC Converter</h1>
      <p>Convert any image to any format of your choice</p>
      <FileUploader handleFileUploadAction={handleFileUpload} />
      <form action="" onSubmit={handleConversion}>
        <label htmlFor="fileType">Convert image (s) to:</label>
        <select name="fileType" id="fileType">
          {/* <option value="avif">AVIF</option> */}
          <option value="webp">WEBP</option>
          <option value="jpeg">JPEG</option>
        </select>
        <button>Convert</button>
      </form>
      {files.map((file, index) => {
        return (
          <div key={index}>
            <img src={file.optimizedUrl} alt={file.name} height={300} />
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
                {fileType} { file.newFileSize} kb 
              </span>
              <span> { file.percentageDiff }% saved</span>
            </div>
            {/* <button onClick={() => downloadFile(file.file, file.name)}>Download</button> */}
            <Link href={`${file.optimizedUrl}${file.name}.${fileType}`} download>Download</Link>
          </div>
        );
      })}

    </section>
  );
}
