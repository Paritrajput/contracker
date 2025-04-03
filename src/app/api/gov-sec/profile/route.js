import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Government from "@/Models/Government";
import { dbConnect } from "@/lib/dbConnect";
import Owner from "@/Models/Owner";

export async function GET(req) {
  await dbConnect();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    if (decoded.owner) {
      const owner = await Owner.findById(decoded.id);
      console.log("owner", owner);
      return NextResponse.json({ owner: true, user: owner });
    }

    const user = await Government.findById(decoded.id)
    return NextResponse.json({ owner: false, user });
  } catch (error) {
    console.error("Token Verification Error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
