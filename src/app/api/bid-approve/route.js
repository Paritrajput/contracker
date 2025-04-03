import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import Bid from "@/Models/Bid";
import Contract from "@/Models/Contract";
import Contractor from "@/Models/Contractor";
import Bidding from "@/contracts/Bidding.json";
import { ethers } from "ethers";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
 
  
    const expiredTenders = await Tender.find({
      bidClosingDate: { $lte: new Date() },
      active: true,
      status: "Active",
    });

    console.log("Expired Tenders:", expiredTenders);

    if (!expiredTenders.length) {
      return NextResponse.json({ message: "No expired tenders found" });
    }

    for (const tender of expiredTenders) {
      const { _id: tenderId, blockchainTenderId, title } = tender;
      const bids = await Bid.find({ tenderId });

      if (bids.length === 0) continue;

      // Fetch contractor details
      const enrichedBids = await Promise.all(
        bids.map(async (bid) => {
          const contractor = await Contractor.findById(bid.contractorId);
          return {
            ...bid.toObject(),
            experience: contractor?.experience || 0,
            rating: contractor?.rating || 0,
            contractorEmail: contractor?.email || "",
            contractorName: contractor?.name || "Contractor",
          };
        })
      );

      // Sort bids based on score (lower score is better)
      enrichedBids.sort((a, b) => {
        const scoreA = a.bidAmount * 0.5 - a.experience * 0.3 - a.rating * 0.2;
        const scoreB = b.bidAmount * 0.5 - b.experience * 0.3 - b.rating * 0.2;
        return scoreA - scoreB;
      });

      const winningBid = enrichedBids[0];

      if (!winningBid) continue;

      const {
        _id: bidId,
        blockchainBidId,
        contractorId,
        bidAmount,
        contractorEmail,
        contractorName,
      } = winningBid;

      // Reject other bids
      await Bid.updateMany({ tenderId }, { $set: { status: "Rejected" } });
      await Bid.findByIdAndUpdate(bidId, { status: "Accepted" });

      await Tender.findByIdAndUpdate(tenderId, {
        status: "Completed",
        winner: contractorId,
      });

      // Define contract milestones
      const milestones = [
        {
          description: "Initial Planning & Documentation",
          amount: bidAmount * 0.2, // 20% payment
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        },
        {
          description: "50% Project Completion",
          amount: bidAmount * 0.3, // 30% payment
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          description: "Final Project Completion & Approval",
          amount: bidAmount * 0.5, // 50% payment
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      ];

      // Create and save contract
      const newContract = new Contract({
        contractId: `CON-${Date.now()}`,
        tenderId,
        winner: contractorId,
        bidAmount,
        paidAmount: 0,
        milestones,
        createdAt: new Date(),
        blockchainContractId: null,
      });

      const savedContract = await newContract.save();

      // Blockchain interaction
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      const wallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PRIVATE_KEY,
        provider
      );
      const contract = new ethers.Contract(
        process.env.BID_CONTRACT_ADDRESS,
        Bidding.abi,
        wallet
      );

      console.log(
        `Approving bid: Tender ${blockchainTenderId}, Bid ${blockchainBidId}`
      );

      const tx = await contract.approveBid(
        Number(blockchainTenderId),
        Number(blockchainBidId)
      );
      const receipt = await tx.wait();

      const event = receipt.logs.find((log) => log.address === contract.target);
      const parsedLog = contract.interface.parseLog(event);
      const blockchainContractId = parsedLog.args[0];

      // Save blockchain contract ID
      savedContract.blockchainContractId = blockchainContractId;
      savedContract.transactionHash = receipt.hash;
      await savedContract.save();

      // Send email notification
      await sendWinnerNotification(
        contractorEmail,
        contractorName,
        title,
        bidAmount
      );

      console.log(`Bid for Tender ${tenderId} approved successfully!`);
    }

    return NextResponse.json({
      message: "All expired tenders processed successfully!",
    });
  } catch (error) {
    console.error("Error processing bids:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendWinnerNotification(email, name, tenderTitle, bidAmount) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ConTracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Congratulations! You've Won the Tender",
      html: `
        <h2>Dear ${name},</h2>
        <p>Congratulations! You have won the tender <b>${tenderTitle}</b> with your bid amount of <b>₹${bidAmount}</b>.</p>
        <p>Please check your dashboard for further details.</p>
        <br>
        <p>Best Regards,</p>
        <p><b>ConTracker Team</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
