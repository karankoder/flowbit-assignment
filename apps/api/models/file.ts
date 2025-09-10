import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  fileUrl: string;
  fileName: string;
  invoiceId?: mongoose.Types.ObjectId;
}

const FileSchema = new Schema(
  {
    fileUrl: { type: String, required: true, unique: true },

    fileName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const File = mongoose.model<IFile>('File', FileSchema);
