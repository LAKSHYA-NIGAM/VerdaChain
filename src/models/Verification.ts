import mongoose, { Schema, type Document } from "mongoose";

export interface IVerification extends Document {
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: {
    projectName: string;
    registry: string;
    location: string;
    issuedCredits: number;
  };
  txHash: string;
  timestamp: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    creditId: { type: String, required: true },
    riskScore: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["High Risk", "Medium Risk", "Low Risk"],
    },
    flags: { type: [String], default: [] },
    metadata: {
      projectName: { type: String, required: true },
      registry: { type: String, required: true },
      location: { type: String, required: true },
      issuedCredits: { type: Number, required: true },
    },
    txHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient sorting by latest
VerificationSchema.index({ timestamp: -1 });

export const Verification =
  mongoose.models.Verification ||
  mongoose.model<IVerification>("Verification", VerificationSchema);
