# Booking Service

## Responsibilities
- Appointments lifecycle (hold, confirmed, in-progress, completed, cancelled, no-show)
- Appointment line items & multi-service sequencing
- Staff assignment & room/chair allocation
- Real-time availability calculation
- Redis distributed slot locking (prevents double-booking during concurrent checkouts)
- Waitlist management & walk-in queue
- Domain events dispatch: `AppointmentCreated`, `AppointmentCompleted`

## Port
`5005`

## Logical Database
`booking_db`
