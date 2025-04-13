const mongoose = require("mongoose");
const VoteSchema = new mongoose.Schema({
  description: String,
  image: String,
});

const paymentSchema = new mongoose.Schema(
  {
    contractorId: String,
    contractorWallet: String,
    progress: String,
    image: String,
    contractId: String,
    bidAmount: Number,
    amountUsed: Number,
    reason: String,
    paymentMade: Number,
    contractorImageUrl: String,

    status: {
      type: String,
      enum: ["Pending", "Voted", "Completed", "Rejected"],
      default: "Pending",
    },
    // status: String,
    approvalVotes: [VoteSchema],
    rejectionVotes: [VoteSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Payments ||
  mongoose.model("Payments", paymentSchema);
