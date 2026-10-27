import {z} from "zod"

export const createSlotSchema = z.object({
    clinicId: z.string().trim().min(1,"Clinic ID is required"),
    startTime: z.coerce.date(),
    endTime:z.coerce.date()
}).refine(
    (data) => data.endTime> data.startTime,
    {
        message:"End time must be after start time",
        path:["endTime"],
    }
)

export const createBookingSchema = z.object({
  patientId: z.string().trim().min(1, "Patient ID is required"),
  slotId: z.string().trim().min(1, "Slot ID is required"),
  patientName: z.string().trim().min(1, "Patient name is required"),
});