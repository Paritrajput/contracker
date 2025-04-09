import Payment from "@/Models/Payment";
import Contract from "@/Models/Contract"; // Ensure Contract model is created
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Contractor from "@/Models/Contractor";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { paymentId } = params;
    const { action } = await request.json();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    if (action === "Approve") {
      payment.status = "Completed";

      await payment.save();
      const contract = await Contract.findById(payment.contractId);
      if (!contract) {
        return NextResponse.json(
          { message: "contract not found" },
          { status: 404 }
        );
      }
      
      const updatedPaidAmount = contract.paidAmount + payment.paymentMade;
      
      await Contract.findByIdAndUpdate(payment.contractId, {
        $push: { payments: paymentId },
        $set: { paidAmount: updatedPaidAmount },
      });
      const contractor = Contractor.findById(payment.contractorId);
      sendWinnerNotification(
        contractor.email,
        contractor.name,
        contract.contractId,
        payment.bidAmount,
        payment.paymentMade
      );
      return NextResponse.json(
        { message: "Payment approved successfully", payment },
        { status: 200 }
      );
    } else if (action === "Deny") {
      // Deny the payment by deleting it
      payment.status = "Rejected";
      await payment.save();
      // await Payment.findByIdAndDelete(paymentId);

      return NextResponse.json(
        { message: "Payment denied successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'approve' or 'deny'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendWinnerNotification(
  email,
  name,
  tenderTitle,
  bidAmount,
  amount
) {
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
      subject: isApproved
        ? "🎉 Payment Request Approved"
        : "❌ Payment Request Rejected - Action Required",
      html: isApproved
        ? `
          <h2>Dear ${name},</h2>
          <p>Great news! Your request for an amount of <b>₹${amount}</b> has been <b>approved</b> for the tender <b>${tenderTitle}</b>, where you placed a bid of <b>₹${bidAmount}</b>.</p>
          <p>Please check your dashboard for fund release and further updates.</p>
          <br>
          <p>Best Regards,</p>
          <p><b>ConTracker Team</b></p>
        `
        : `
          <h2>Dear ${name},</h2>
          <p>We regret to inform you that your request for an amount of <b>₹${amount}</b> under the tender <b>${tenderTitle}</b> was <b>rejected</b> during the public/government voting process.</p>
          <p>To help us understand the reason for the delay and consider resubmission, please fill out the following form:</p>
          <p><a href="https://forms.gle/your-form-id" target="_blank" style="color:blue;">📄 Fill Delay Reason Form</a></p>
          <br>
          <p>We appreciate your transparency and cooperation.</p>
          <p><b>ConTracker Team</b></p>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { paymentId } = params;

//     // Find the payment
//     const payment = await Payment.findById(paymentId);
//     if (!payment) {
//       return NextResponse.json(
//         { message: "Payment not found" },
//         { status: 404 }
//       );
//     }

//     // Update payment status to true
//     payment.status = true;
//     await payment.save();

//     // Add paymentId to the related contract
//     await Contract.findByIdAndUpdate(payment.contractId, {
//       $push: { payments: paymentId },
//     });

//     return NextResponse.json(
//       { message: "Payment approved successfully", payment },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error approving payment:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
