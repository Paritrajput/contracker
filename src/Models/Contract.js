import { issueDetail } from "@/app/gov-sec/issue-details/page";
import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Voted", "Completed", "Rejected"],
    default: "Pending",
  },
  approvalVotes: { type: Number, default: 0 },
  rejectionVotes: { type: Number, default: 0 },
});

const ContractSchema = new mongoose.Schema({
  contractId: String,
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Tender" },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor" },
  bidAmount: Number,
  paidAmount: Number,
  createdAt: { type: Date, default: Date.now },
  location: Object,
  issueDetail: Object,
  blockchainContractId: String,
  transactionHash: String,
  milestones: [MilestoneSchema],
});

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
