# SERVICE GUIDE

## Product

Sweetpet is a content service for pet owners to record and preserve their pet’s daily life.

## Core Concept

The service is built around:

1. Pet
2. Record
3. Order

## Key Flow

Record → Accumulate → Select Period → Create Order → Export

## Role Flow

The app separates user-facing screens and admin-facing screens only for demonstration.

* User: manages pets, creates pet records, and creates book orders.
* Admin: manages received orders and exports structured JSON.

This does not include authentication, authorization, payment, or shipping.

### User Screens

User-facing screens should cover only the customer flow:

1. Pet management
2. Record creation and review
3. Book order creation from a selected period

### Admin Screens

Admin-facing screens should be limited to operational order handling:

1. Order management
2. Order status updates
3. Structured JSON export

Admins should not create or edit user pets or records from the admin flow.

## Principles

* Content-first, not print-first
* Records are the core of the service
* Orders are derived from records
* Export should be API-ready structured data
* Admin features should stay focused on order management and export

## What NOT to do

* Do not build a print shop
* Do not prioritize book over content
* Do not add unnecessary features
