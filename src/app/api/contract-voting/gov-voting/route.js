import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

import Contract from "@/Models/Contract";

export async function PUT(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const { contractId, index, vote } = data;
    console.log(contractId, vote,index);
    const contract = await Contract.findById(contractId);

    if (!contract) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }
    console.log(contract);
    const isUpvote = vote === "approve";
    if (isUpvote) {
      contract.milestones[index].approvalVotes += 3;
    } else {
      contract.milestones[index].rejectionVotes += 3;
    }

    const res = await contract.save();
    console.log("res:",res)

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
