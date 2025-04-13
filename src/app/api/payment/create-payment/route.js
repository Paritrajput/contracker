import { dbConnect } from "@/lib/dbConnect";
import Contract from "@/Models/Contract";
import Payments from "@/Models/Payment";
import Tender from "@/Models/Tender";
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: "dt1cqoxe8",
  api_key: "736378735539485",
  api_secret: "iJfGZ2TqF348thygERO5RzVgjpM",
});

export async function POST(req) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const formData = await req.formData();
      console.log(formData)
      const body = {};

      // Extract fields from formData
      formData.forEach((value, key) => {
        if (key === "workImage" && value instanceof Blob) {
          body.image = value;
        } else {
          body[key] = value;
        }
      });

      const {
        contractorId,
        contractorWallet,
        contractId,
        bidAmount,
        reason,
        paymentMade,
        status,
        progress,
        // contractTitle,
      } = body;

      console.log(body)
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

      console.log("fetched tender:", tender);
      let imageUrl = null;
      let contractTitle = tender.title || "untitled";
      contractTitle = contractTitle
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

      console.log(contractTitle);

      // Upload to Cloudinary if image is present
      if (body.image) {
        const buffer = await body.image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${body.image.type};base64,${base64Image}`;

        const uploadedResponse = await cloudinary.v2.uploader.upload(dataUri, {
          folder: `civicLedger/${contractTitle}/contractorImg`,
          use_filename: true,
          unique_filename: false,
        });
console.log(uploadedResponse)
        imageUrl = uploadedResponse.secure_url;
      }

      const newPayment = new Payments({
        contractorId,
        contractorWallet,
        contractId,
        bidAmount,
        reason,
        paymentMade,
        status,
        progress,
        contractorImageUrl: imageUrl,
      });

      await newPayment.save();

      return NextResponse.json(
        { success: true, message: "Payment saved successfully!" },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Error saving payment details." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
