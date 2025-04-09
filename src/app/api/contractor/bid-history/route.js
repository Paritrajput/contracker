import { dbConnect } from "@/lib/dbConnect";
import Bid from "@/Models/Bid";
import Tender from "@/Models/Tender";

export async function POST(req) {
  await dbConnect();

  try {
    const { contractorId } = await req.json();
    console.log(contractorId);

    if (!contractorId) {
      return new Response(
        JSON.stringify({ error: "Contractor ID is required" }),
        { status: 400 }
      );
    }

    // Find all bids made by the contractor
    const bids = await Bid.find({ contractorId });

    // Fetch related tender info
    const populatedBids = await Promise.all(
      bids.map(async (bid) => {
        const tender = await Tender.findById(bid.tenderId);
        return {
          _id: bid._id,
          bidAmount: bid.bidAmount,
          status: bid.experience,
          timestamp: bid.timestamp,
        };
      })
    );

    return new Response(JSON.stringify(populatedBids), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch bid history" }),
      { status: 500 }
    );
  }
}
