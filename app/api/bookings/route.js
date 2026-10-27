
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/db/connectdb";
import slot from "@/models/slot";
import Booking from "@/models/Booking";
import { createBookingSchema } from "@/validators/booking";


export async function POST(request) {
  let session;

  try {
    const body = await request.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid booking details",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { slotId, patientId, patientName } = result.data;

    if (!mongoose.isValidObjectId(slotId)) {
      return NextResponse.json(
        { error: "Invalid slot ID" },
        { status: 400 }
      );
    }

    await connectdb();

    session = await mongoose.startSession();
    session.startTransaction();

    // Atomically reserve the slot only if it is available.
    const updatedSlot = await slot.findOneAndUpdate(
      {
        _id: slotId,
        status: "available",
      },
      {
        $set: {
          status: "booked",
          bookedBy: patientId,
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!updatedSlot) {
      const existingSlot = await slot.findById(slotId).session(session);

      await session.abortTransaction();

      if (!existingSlot) {
        return NextResponse.json(
          { error: "Appointment slot not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "This appointment slot is not available" },
        { status: 409 }
      );
    }

    const [booking] = await Booking.create(
      [
        {
          slotId,
          patientId,
          patientName,
          status: "confirmed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create booking error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Request body must contain valid JSON" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await session?.endSession();
  }
}
