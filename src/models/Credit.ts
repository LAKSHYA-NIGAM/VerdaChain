import mongoose, { Schema, type Document } from "mongoose";

export interface ICredit extends Document {
  creditId: string;
  projectName: string;
  registry: string;
  location: string;
  issuedCredits: number;
}

const CreditSchema = new Schema<ICredit>(
  {
    creditId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    registry: { type: String, required: true },
    location: { type: String, required: true },
    issuedCredits: { type: Number, required: true },
  },
  { timestamps: true }
);

// Prevent model recompilation in development (Next.js hot reload)
export const Credit =
  mongoose.models.Credit || mongoose.model<ICredit>("Credit", CreditSchema);
