# DESIGN

## Concept

A refined workspace interface focused on usability and clear user flow.

The UI should feel like a modern production tool for organizing pet records and album orders.

---

## Tone

* Refined and modern
* Functional and structured
* Warm neutral, not cute or sentimental
* Focused on usability over aesthetics

---

## Product UI Direction

* Closer to a structured tool than a personal diary
* Avoid decorative or emotional design elements
* First screen must show functional UI, not a landing page or hero
* Use clear navigation to separate user and admin flows
* Clearly separate:
  * Pet management
  * Record creation
  * Record list
  * Order creation
  * Admin order management
  * Export
* Each page should expose only the primary action relevant to that page
* Prioritize clarity over visual decoration

---

## Reference Direction

Use references as product-quality guidance, not as visual templates.

### Airtable

Reference for:

* Practical data density
* Clear record/card organization
* Tool-like surfaces with simple borders
* Filters and controls that stay close to the data they affect

Apply to Sweetpet by making pet, record, and order lists feel organized and scannable.

### Linear

Reference for:

* Precise alignment
* Calm navigation
* Strong text hierarchy without decorative styling
* Compact admin workflows

Apply to Sweetpet by keeping admin order management tight, readable, and action-oriented.

### Albumko

Reference for:

* Photo-book production flow
* Order and export-oriented structure
* Clear transition from selected content to final output

Apply to Sweetpet by making the flow from daily records to album order to export feel intentional.

### Reference Rules

* Do not copy visual identity from reference sites
* Do not add decorative gradients, illustrations, or marketing sections
* Prefer structured cards, rows, tables, and compact controls
* Prioritize practical grouping over perfectly even spacing

---

## Colors

* Background: #F3F0EA
* Surface: #FFFDF9
* Surface Muted: #EEE8DE
* Primary: #2F2923
* Primary Soft: #E9DFD1
* Accent: #6F6255
* Text Primary: #191714
* Text Secondary: #6F6A62
* Border: #E4DDD2
* Border Strong: #CFC3B5

Use these colors to make the app feel more polished and product-like while keeping the warm, structured tone.
Avoid saturated colors, decorative gradients, and high-contrast novelty accents.

Large page areas should not be wrapped in heavy white panels. Use the page background as the workspace, and reserve raised surfaces for actual records, forms, tables, modals, and controls.

### Glass Treatment

Use subtle Apple-like glass only for interface chrome and floating controls:

* GlobalHeader
* SectionToggle
* Pet selector trigger and dropdown
* Floating overlay controls such as bulk actions

Do not apply glass to every content card. Pet cards, record cards, order cards, tables, forms, and export content should remain mostly solid for readability.

---

## Typography

* Font: Pretendard, Inter, system-ui
* Clear hierarchy
* Focus on readability
* Comfortable line-height

---

## Layout Structure

The application must use a global header + main content + footer layout.

### Desktop

```text
[ Global Header ]
[ Main Content  ]
[ Footer        ]
```

* Global header: always visible at the top of the layout
* Main content: flexible and centered
* Main content max width: 1120px
* Footer: simple and secondary

### Mobile

* Header navigation should remain easy to access
* Avoid complex drawer behavior unless necessary

---

## Navigation Rules

The application should make the active role clear and separate user-facing screens from admin-facing screens.

Global header navigation should make both the User App and Admin Console sections easy to access.

### User Navigation

User-facing navigation contains:

  * Pets
  * Records
  * Orders

User `Orders` is for creating an order from selected records or a selected period.

### Admin Navigation

Admin-facing navigation contains only:

  * Order Management
  * Export

Admin screens must not expose pet creation, record creation, or record editing.

### Shared Rules

* Use the global header for primary navigation
* Current page must be clearly highlighted
* Keep navigation shallow with no deep nesting
* Footer must not contain primary workflow actions

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

The role-based flow should remain explicit:

```text
User: Pet -> Record -> Select Period -> Create Order
Admin: Manage Orders -> Update Status -> Export
```

### 2. Visibility of Actions

* Important actions must be visible without extra navigation
* Each page should show the action needed for that page
* Avoid hiding core actions

### 3. Separation of Concerns

* User screens and admin screens must be clearly separated
* Pets, Records, Orders, Admin Orders, and Export must be clearly separated
* Do not mix responsibilities in one screen
* Admin screens should focus only on order management and export

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

* Use only the color tokens defined in this document
* Do not add emotional or decorative UI
* Do not increase visual complexity
* Maintain consistency across all pages
* Prioritize usability over visual style
