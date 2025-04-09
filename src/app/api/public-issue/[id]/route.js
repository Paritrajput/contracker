import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 
import Issue from "@/Models/Issue"; 


export async function GET(req, { params }) {
  try {
    await dbConnect(); 

    const { id } = await params;
    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue, { status: 200 });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect(); 

    const { id } = params; 
    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue, { status: 200 });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
