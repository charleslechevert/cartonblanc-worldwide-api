import { Request } from 'express';

export interface MulterRequest extends Request {
  file: any;
}

export interface CustomFile {
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  fieldname: string;
  cloudStorageObject?: string; // This is the custom property we are adding
  cloudStorageError?: object;
  cloudStoragePublicUrl: string;
}
