import mongoose from "mongoose";
const MilestoneSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Completed", "Rejected"],
    default: "Pending",
  },
  approvalVotes: { type: Number, default: 0 },
  rejectionVotes: { type: Number, default: 0 },
});
const BidSchema = new mongoose.Schema({
  tenderId: { type: String, required: true },
  contractorId: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  proposalDocument: String,
  experienceYears: Number,
  contractorRating: Number,
  blockchainBidId: String,
  milestones: [MilestoneSchema],
  transactionHash: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);
