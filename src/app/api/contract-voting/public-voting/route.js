import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/Models/Payment";
import cloudinary from "cloudinary";
import Contract from "@/Models/Contract";
import Tender from "@/Models/Tender";

cloudinary.v2.config({
  cloud_name: "dt1cqoxe8",
  api_key: "736378735539485",
  api_secret: "iJfGZ2TqF348thygERO5RzVgjpM",
});

export async function PUT(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const paymentId = formData.get("paymentId");
    const vote = formData.get("vote");
    const review = formData.get("review");
    const image = formData.get("image");
    const contractId = formData.get("contractId");

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return NextResponse.json(
        { success: false, message: "Contract not found" },
        { status: 404 }
      );
    }

    const tender = await Tender.findById(contract.tenderId);
    if (!tender) {
      return NextResponse.json(
        { success: false, message: "Tender not found" },
        { status: 404 }
      );
    }

    // Sanitize folder name
    let contractTitle = tender.title || "untitled";
    contractTitle = contractTitle
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");

    const voteObject = {
      description: review,
    };

    // Upload image to Cloudinary if exists
    if (image && typeof image.arrayBuffer === "function") {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const dataUri = `data:${image.type};base64,${base64Image}`;

      const uploadedResponse = await cloudinary.v2.uploader.upload(dataUri, {
        folder: `civicLedger/${contractTitle}/publicImgs`,
        use_filename: true,
        unique_filename: false,
      });

      voteObject.image = uploadedResponse.secure_url;
    }

    // Push vote into appropriate array
    if (vote === "approve") {
      payment.approvalVotes.push(voteObject);
    } else if (vote === "reject") {
      payment.rejectionVotes.push(voteObject);
    } else {
      return NextResponse.json(
        { message: "Invalid vote type" },
        { status: 400 }
      );
    }

    const updatedPayment = await payment.save();

    return NextResponse.json(
      { message: "Vote submitted", payment: updatedPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT voting route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
