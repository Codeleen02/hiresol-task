import mongoose from "mongoose"

const slotSchema = new mongoose.Schema({
    clinicId: {
        type: String,
        required: true,
        trim: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type:Date,
        required:true,
        validate:{
            validator:function(value){
                return value > this.startTime;
    
            },
            message: "End time must be after start time"
        }
    },
    status: {
        type:String,
        enum:["available", "booked", "cancelled"],
        default:"available"
    },
    bookedBy: {
      type:String,
      default:null,
    },
},
{timestamps:true}
)

export default mongoose.models.slot || mongoose.model("slot",slotSchema)