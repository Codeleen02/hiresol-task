
# Clinic Appointment Booking API

A REST API built with Next.js App Router, JavaScript,
MongoDB, Mongoose, and Zod for managing clinic appointment
slots and patient bookings.

## Features

- Create and list appointment slots
- Filter slots by clinic and status
- Cancel available appointment slots
- Book available appointment slots
- Prevent double booking with atomic database updates
- Cancel bookings and release their slots
- Validate request data with Zod
- Return appropriate HTTP status codes
- Use MongoDB transactions for booking operations

## Tech Stack

- Next.js App Router
- JavaScript
- MongoDB Atlas
- Mongoose
- Zod
- Node.js test runner

## Setup

1. Install dependencies:

   npm install

2. Create a `.env.local` file in the project root:

   MONGODB_URI=your_mongodb_connection_string

3. Start the development server:

   npm run dev

The API runs at http://localhost:3000.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/slots | Create a slot |
| GET | /api/slots | List slots |
| PATCH | /api/slots/:id | Cancel an available slot |
| POST | /api/bookings | Book a slot |
| PATCH | /api/bookings/:id | Cancel a booking |

### Create a slot

POST /api/slots

{
  "clinicId": "clinic123",
  "startTime": "2026-11-02T10:00:00.000Z",
  "endTime": "2026-11-02T10:30:00.000Z"
}

### Book a slot

POST /api/bookings

{
  "slotId": "YOUR_SLOT_ID",
  "patientId": "patient123",
  "patientName": "Test Patient"
}

### List available slots

GET /api/slots?clinicId=clinic123&status=available

### Cancel a slot

PATCH /api/slots/YOUR_SLOT_ID

### Cancel a booking

PATCH /api/bookings/YOUR_BOOKING_ID

## HTTP Status Codes

- 200: Request succeeded
- 201: Resource created
- 400: Invalid request data
- 404: Resource not found
- 409: Resource conflict, such as an already-booked slot
- 500: Unexpected server error

## Run Tests

npm test

## Notes

Booking operations use atomic slot updates to prevent two
requests from reserving the same available slot. MongoDB
transactions are used to keep booking records and slot
status changes consistent.
