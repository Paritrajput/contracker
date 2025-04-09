import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

import Contract from "@/Models/Contract";

import Payment from "@/Models/Payment";

export async function PUT(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const paymentId = formData.get("paymentId");
    const vote = formData.get("vote");
    const review = formData.get("review");
    const image = formData.get("image");


    const payment = await Payment.findById(paymentId);
    console.log(payment);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    const voteObject = {
      description: review,
      // image: review.image,
    };

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

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const { contractId, index } = data;
    // console.log(contractId,index);
    const contract = await Payment.findById(contractId);

    if (!contract) {
      return NextResponse.json(
        { message: "payment not found" },
        { status: 404 }
      );
    }
    // console.log(contract);

    //  const approveVotes=contract.milestones[index].approvalVotes
    //  const rejectVotes=contract.milestones[index].rejectionVotes
    //     if ((approveVotes/(approveVotes+rejectVotes))>=0.66) {

    //       contract.milestones[index].status ="Voted";
    //     }
    //     else{
    //       contract.milestones[index].status ="Rejected";
    //     }

    const res = await contract.save();
    // console.log("res:",res)

    return NextResponse.json(
      { message: "Vote updated", contract },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
