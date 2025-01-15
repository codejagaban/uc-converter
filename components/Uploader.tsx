"use client";

import { FileUploaderInline } from "@uploadcare/react-uploader/next";
import {
  OutputCollectionStatus,
  OutputFileEntry,
  UploadCtxProvider,
} from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { useRef } from "react";
import { ImageType } from "@/types";

export default function FileUploader({
  handleFileUploadAction,
}: {
  handleFileUploadAction: (e: ImageType) => void;
}) {
  const uploaderRef = useRef<InstanceType<UploadCtxProvider> | null>(null);
  const onFileUploadSuccess = (e: OutputFileEntry<OutputCollectionStatus>) => {

    handleFileUploadAction({ name: e.name, cdnUrl: `${e.cdnUrl}` as string, fileType: e.mimeType.split("/").slice(1)[0], originalFileSize: e.size });
  };
  const onFileUploadFailed = (e: OutputFileEntry<OutputCollectionStatus>) => {
    console.log(e);
  };

  return (
    <FileUploaderInline
      apiRef={uploaderRef}
      pubkey="dc10a36db143e2574355"
      onFileUploadSuccess={(e) => onFileUploadSuccess(e)}
      onFileUploadFailed={(e) => onFileUploadFailed(e)}
    />
  );
}
