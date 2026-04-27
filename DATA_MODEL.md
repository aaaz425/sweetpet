# Overview

The backend uses these main data structures:

- Pet
- Record
- Book
- BookRecord
- Order
- OrderRecord
- BookSpec
- Template

API responses are wrapped as:

- `success`: boolean
- `message`: string
- `data`: entity data, array, object, or null
- `errors`: string[] on failures

# Entities

## Pet

- `id`: number
- `name`: string
- `species`: string
- `breed`: string | null
- `birthday`: string | null
- `memo`: string | null
- `image_path`: string | null
- `created_at`: string

## Record

- `id`: number
- `pet_id`: number
- `record_date`: string
- `weight`: number | null
- `condition`: string
- `memo`: string
- `tags`: string[]
- `image_path`: string | null
- `created_at`: string
- `updated_at`: string

## Book

- `id`: number
- `book_uid`: string
- `bookUid`: string
- `pet_id`: number
- `petId`: number
- `title`: string
- `start_date`: string | null
- `startDate`: string | null
- `end_date`: string | null
- `endDate`: string | null
- `status`: string
- `templateUid`: string
- `bookSpecUid`: string
- `printOptions`: object
- `finalizedAt`: string | null
- `created_at`: string
- `updated_at`: string
- `recordCount`: number
- `records`: Record[] on book detail and book content update responses

## BookRecord

- `book_id`: number
- `record_id`: number

## Order

- `id`: number
- `orderUid`: string | null
- `bookId`: number | null
- `pet_id`: number
- `petId`: number
- `title`: string
- `start_date`: string
- `startDate`: string
- `end_date`: string
- `endDate`: string
- `status`: string
- `printOptions`: object
- `created_at`: string
- `updated_at`: string
- `recordCount`: number

## OrderRecord

- `order_id`: number
- `record_id`: number

## BookSpec

- `bookSpecUid`: string
- `name`: string
- `size`: string
- `binding`: string
- `minPages`: number
- `maxPages`: number

## Template

- `templateUid`: string
- `name`: string
- `category`: string
- `bookSpecUid`: string

# Relationships

- A Pet has many Records.
- A Pet has many Books.
- A Pet has many Orders.
- A Book belongs to one Pet.
- A Book has many Records through BookRecord.
- An Order belongs to one Pet.
- An Order can belong to one Book through `bookId`.
- An OrderRecord joins Orders and Records, but current order export uses BookRecord through the connected Book.
- A Template references one BookSpec through `bookSpecUid`.
- A Book references one Template through `templateUid`.
- A Book references one BookSpec through `bookSpecUid`.

# Export Structure

`GET /api/orders/:id/export` returns `data` with:

- `service`: string
- `exportVersion`: string
- `generatedAt`: string
- `order`: Order
- `book`: Book | null
- `pet`: Pet | undefined
- `selectedRecords`: Record[]
- `printOptions`: object
