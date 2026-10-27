
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createSlotSchema,
  createBookingSchema,
} from "../validators/booking.js";

test("accepts a valid appointment slot", () => {
  const result = createSlotSchema.safeParse({
    clinicId: "clinic123",
    startTime: "2026-11-02T10:00:00.000Z",
    endTime: "2026-11-02T10:30:00.000Z",
  });

  assert.equal(result.success, true);
});

test("rejects a slot whose end time is before its start time", () => {
  const result = createSlotSchema.safeParse({
    clinicId: "clinic123",
    startTime: "2026-11-02T11:00:00.000Z",
    endTime: "2026-11-02T10:00:00.000Z",
  });

  assert.equal(result.success, false);
});

test("rejects an empty clinic ID", () => {
  const result = createSlotSchema.safeParse({
    clinicId: " ",
    startTime: "2026-11-02T10:00:00.000Z",
    endTime: "2026-11-02T10:30:00.000Z",
  });

  assert.equal(result.success, false);
});

test("accepts valid booking details", () => {
  const result = createBookingSchema.safeParse({
    slotId: "507f1f77bcf86cd799439011",
    patientId: "patient123",
    patientName: "Afsheen",
  });

  assert.equal(result.success, true);
});

test("rejects booking details with a missing patient name", () => {
  const result = createBookingSchema.safeParse({
    slotId: "507f1f77bcf86cd799439011",
    patientId: "patient123",
    patientName: " ",
  });

  assert.equal(result.success, false);
});
