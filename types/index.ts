export type ImageType = {
  name: string;
  cdnUrl: string;
  fileType: string;
  originalFileSize: number;
  newFileSize?: number;
  optimizedUrl?: string;
  percentageDiff?: number;
  width?: number;
  height?: number;
};