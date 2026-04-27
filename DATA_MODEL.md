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

API request and response field names use camelCase. The SQLite schema may use snake_case internally, but snake_case fields are not part of the public frontend contract.

# Entities

## Pet

- `id`: number
- `name`: string
- `species`: string
- `breed`: string | null
- `birthday`: string | null
- `memo`: string | null
- `imagePath`: string | null
- `createdAt`: string

## Record

- `id`: number
- `petId`: number
- `recordDate`: string
- `weight`: number | null
- `condition`: string
- `memo`: string
- `tags`: string[]
- `imagePath`: string | null
- `createdAt`: string
- `updatedAt`: string

## Book

- `id`: number
- `bookUid`: string
- `petId`: number
- `title`: string
- `startDate`: string | null
- `endDate`: string | null
- `status`: string
- `templateUid`: string
- `bookSpecUid`: string
- `printOptions`: object
- `finalizedAt`: string | null
- `createdAt`: string
- `updatedAt`: string
- `recordCount`: number
- `records`: Record[] on book detail and book content update responses

## BookRecord

- `bookId`: number
- `recordId`: number

## Order

- `id`: number
- `orderUid`: string | null
- `bookId`: number | null
- `petId`: number
- `title`: string
- `startDate`: string
- `endDate`: string
- `status`: string
- `printOptions`: object
- `createdAt`: string
- `updatedAt`: string
- `recordCount`: number

## OrderRecord

- `orderId`: number
- `recordId`: number

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

`GET /api/orders/:orderUid/export` returns `data` with:

- `service`: string
- `exportVersion`: string
- `generatedAt`: string
- `order`: Order
- `book`: Book | null
- `pet`: Pet | undefined
- `selectedRecords`: Record[]
- `printOptions`: object
