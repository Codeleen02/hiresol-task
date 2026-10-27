import { NextResponse } from "next/server";
import connectdb from "@/db/connectdb"
import slot from "@/models/slot";
import { createSlotSchema } from "@/validators/booking";

export async function GET(request) {
  try {
    await connectdb();

    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const status = searchParams.get("status");

    const filter = {};

    if (clinicId) filter.clinicId = clinicId;

    if (status) {
      if (!["available", "booked", "cancelled"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status filter" },
          { status: 400 }
        );
      }
      filter.status = status;
    }

    const Slots = await slot.find(filter).sort({ startTime: 1 });

    return NextResponse.json({ Slots }, { status: 200 });
  } catch (error) {
    console.error("List slots error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request){
    try{
        const body = await request.json()
        const result = createSlotSchema.safeParse(body)

        if(!result.success){
            return NextResponse.json(
              {
                error:"Invalid slot details",
                details:result.error.issues,
              },
              {status:400}
            )
        }
        await connectdb()

        const Slot = await slot.create(result.data);

        return NextResponse.json({
            message: "Slot created successfully",
            Slot,
        },
        {status:201}
    );
    }catch(error){
       console.error("Create slot error:",error)
       
       if(error instanceof SyntaxError){
        return NextResponse.json(
            {error:"Request body must contain valid JSON"},
            {status:400}
        )
       }
       return NextResponse.json(
        {error:"Internal server error"},
        {status:500}
       )
    }
}