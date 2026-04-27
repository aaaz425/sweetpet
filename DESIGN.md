# DESIGN

## Concept

A clean and structured interface focused on usability and clear user flow.

The UI should feel like a well-organized tool rather than an emotional journal.

---

## Tone

* Clean and minimal
* Functional and structured
* Slightly warm but not emotional
* Focused on usability over aesthetics

---

## Product UI Direction

* Closer to a structured tool than a personal diary
* Avoid decorative or emotional design elements
* First screen must show functional UI, not a landing page or hero
* Use sidebar navigation to separate main flows
* Clearly separate:
  * Pet management
  * Record creation
  * Record list
  * Order creation
* Each page should expose only the primary action relevant to that page
* Prioritize clarity over visual decoration

---

## Colors

* Background: #F9FAFB
* Surface: #FFFFFF
* Primary: #6B4F3A
* Primary Soft: #F1EBE5
* Accent: #A78B6D
* Text Primary: #111827
* Text Secondary: #6B7280
* Border: #E5E7EB

Do not introduce additional UI colors unless explicitly requested.

---

## Typography

* Font: Pretendard, Inter, system-ui
* Clear hierarchy
* Focus on readability
* Comfortable line-height

---

## Layout Structure

The application must use a sidebar + main content layout.

### Desktop

```text
[ Sidebar ] | [ Main Content ]
```

* Sidebar width: 220px ~ 260px, fixed
* Main content: flexible
* Main content max width: 1120px

### Mobile

* Sidebar becomes a top navigation
* Avoid complex drawer behavior unless necessary

---

## Sidebar Rules

* Contains main navigation:
  * Pets
  * Records
  * Orders
  * Export
* Always visible on desktop
* Current page must be clearly highlighted
* Keep navigation shallow with no deep nesting

---

## Main Content Rules

* Each page must have a clear header:
  * Page title
  * Page-specific summary or primary action
* Important actions should be visible on the page where they are relevant
* Do not mix unrelated responsibilities in one screen
* Content area should remain readable and consistently spaced

---

## Layout Spacing

* Max width: 1120px
* 8px spacing system
* Balanced spacing, not too dense and not too empty

---

## Components

### Card

* Minimal design
* Light border
* Radius: 12px
* No heavy shadow

### Button

* Primary button clearly visible
* Consistent position across screens
* No decorative effects
* Hover state required

### Input

* Clear border
* Straightforward layout
* Focus state uses primary color

### Badge

Used for:

* order status
* tags

Style:

* Pill shape
* Clear contrast

---

## Interaction

### Cursor

* All interactive elements must use pointer cursor
* Never use default cursor for clickable elements

### Hover Feedback

* Buttons: color or opacity change
* Cards: subtle border or background change
* List items: light highlight

### Click Feedback

* Subtle pressed state or scale
* Avoid heavy animation

### Transitions

* Duration: 150ms ~ 200ms
* Keep transitions minimal and predictable

---

## UX Principles

### 1. Clear Flow

User should understand the core flow immediately:

```text
Record -> Review -> Select Period -> Order -> Export
```

### 2. Visibility of Actions

* Important actions must be visible without extra navigation
* Each page should show the action needed for that page
* Avoid hiding core actions

### 3. Separation of Concerns

* Pets, Records, Orders, and Export must be clearly separated
* Do not mix responsibilities in one screen

### 4. Low Cognitive Load

* Keep screens simple
* Avoid too many options at once

---

## Tailwind Usage

* Use Tailwind CSS for frontend styling
* Map the colors in this document to Tailwind theme tokens
* Keep custom CSS minimal and only for app-level resets or unavoidable layout details
* Prefer reusable class patterns over one-off decorative styles

---

## Rules

* Do not introduce new colors
* Do not add emotional or decorative UI
* Do not increase visual complexity
* Maintain consistency across all pages
* Prioritize usability over visual style
