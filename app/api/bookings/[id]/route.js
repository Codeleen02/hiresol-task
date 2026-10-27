
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/db/connectdb";
import Booking from "@/models/Booking";
import slot from "@/models/slot";

export async function PATCH(request, { params }) {
  let session;

  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    await connectdb();

    session = await mongoose.startSession();
    session.startTransaction();

    const booking = await Booking.findOneAndUpdate(
      { _id: id, status: "confirmed" },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      },
      { new: true, session }
    );

    if (!booking) {
      const existing = await Booking.findById(id).session(session);

      await session.abortTransaction();

      if (!existing) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 409 }
      );
    }

    const Slot = await slot.findOneAndUpdate(
      {
        _id: booking.slotId,
        status: "booked",
        bookedBy: booking.patientId,
      },
      {
        $set: {
          status: "available",
          bookedBy: null,
        },
      },
      { new: true, session }
    );

    if (!Slot) {
      throw new Error("Could not release the booked slot");
    }

    await session.commitTransaction();

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
        booking,
        slot,
      },
      { status: 200 }
    );
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Cancel booking error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await session?.endSession();
  }
}
