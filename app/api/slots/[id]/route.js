
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/db/connectdb";
import slot from "@/models/slot";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid slot ID" },
        { status: 400 }
      );
    }

    await connectdb();

    const Slot = await slot.findOneAndUpdate(
      { _id: id, status: "available" },
      { $set: { status: "cancelled" } },
      { new: true, runValidators: true }
    );

    if (!Slot) {
      const existing = await slot.findById(id);

      if (!existing) {
        return NextResponse.json(
          { error: "Appointment slot not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Only available slots can be cancelled" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Slot cancelled successfully", Slot },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel slot error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
