import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
    patientId:{
    type:String,
    required:true,
    trim:true,
    },
    patientName:{
    type:String,
    required:true,
    trim:true,
    },
      slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
     status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
     cancelledAt: {
      type: Date,
      default: null,
    },
},
 { timestamps: true }
)

export default mongoose.models.Booking || mongoose.model("Booking",BookingSchema)