import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import { ethers } from "ethers";
import { NextResponse } from "next/server";
import TenderContract from "@/contracts/TenderCreation";

export async function POST(req) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

  try {
    const body = await req.json();
    console.log("Received Body:", body);

    const {
      title,
      description,
      category,
      minBidAmount,
      maxBidAmount,
      bidOpeningDate,
      bidClosingDate,
      location,
      issueDetails,
      creator,
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !minBidAmount ||
      !maxBidAmount ||
      !location ||
      !bidOpeningDate ||
      !bidClosingDate
    ) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }
    // console.log(blockchainTenderId);
    await dbConnect();

    const newTender = new Tender({
      title,
      description,
      category,
      minBidAmount,
      maxBidAmount,
      bidOpeningDate,
      bidClosingDate,
      location,
      active: true,
      issueDetails,
      creator,
    });

    const savedTender = await newTender.save();

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const wallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY,
      provider
    );
    const contract = new ethers.Contract(
      process.env.TENDER_CONTRACT_ADDRESS,
      TenderContract.abi,
      wallet
    );

    const tx = await contract.createTender(
      body.title,
      body.description,
      body.category,
      ethers.parseEther(body.minBidAmount),
      ethers.parseEther(body.maxBidAmount),
      Math.floor(new Date(body.bidOpeningDate).getTime() / 1000),
      Math.floor(new Date(body.bidClosingDate).getTime() / 1000),
      body.issueDetails.placename,
      String(body.creator.id)
    );
    const receipt = await tx.wait();

    savedTender.transactionHash = receipt.transactionHash;

    let blockchainTenderId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === "TenderCreated") {
          blockchainTenderId = parsedLog.args[0].toString();
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!blockchainTenderId) {
      throw new Error("Tender ID not found in blockchain event logs");
    }

    savedTender.blockchainTenderId = blockchainTenderId;
    await savedTender.save();

    return NextResponse.json(
      { message: "Tender created successfully!", tenderId: savedTender._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating tender:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
