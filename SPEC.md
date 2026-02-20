# Cost Split Calculator - Specification

## 1. Project Overview

**Project Name:** Vibe Split  
**Type:** Single-page React Web Application  
**Core Functionality:** A tip calculator that allows groups to add items, assign participants, and calculate individual shares including tax, tip, and fees.  
**Target Users:** Groups dining out, roommates splitting expenses, or any scenario requiring fair cost distribution.

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Header:** App title with subtle glow effect
- **Members Panel:** Left sidebar for adding/managing group members
- **Main Content:** Item list with add/edit functionality
- **Summary Panel:** Right sidebar showing totals and per-person breakdown

**Grid Layout:**
- Desktop: 3-column layout (280px | flex-1 | 320px)
- Tablet: 2-column (Members collapse to drawer)
- Mobile: Single column with bottom navigation

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Background Primary: `#0D0D0D`
- Background Secondary: `#1A1A1A`
- Background Tertiary: `#262626`
- Surface: `#1F1F1F`
- Primary Accent: `#BB86FC` (Purple)
- Secondary Accent: `#03DAC6` (Teal)
- Error: `#CF6679`
- Text Primary: `#FFFFFF`
- Text Secondary: `#B3B3B3`
- Text Muted: `#666666`
- Divider: `#333333`

**Typography:**
- Font Family: `'JetBrains Mono', 'Fira Code', monospace` for numbers, `'DM Sans', sans-serif` for text
- Heading Large: 28px, weight 700
- Heading Medium: 20px, weight 600
- Body: 14px, weight 400
- Caption: 12px, weight 400
- Monospace Numbers: 16px, weight 500

**Spacing System:**
- Base unit: 8px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, XXL: 48px

**Visual Effects:**
- Card shadows: `0 4px 20px rgba(0, 0, 0, 0.4)`
- Hover glow on primary elements: `0 0 20px rgba(187, 134, 252, 0.3)`
- Subtle gradient overlays on headers
- Smooth transitions: 200ms ease-out
- Micro-animations on state changes (scale, fade)

### Components

**Member Chip:**
- Pill-shaped with avatar initial
- States: default, selected (glowing border), excluded (dimmed)
- Remove button on hover

**Item Card:**
- Elevated card with icon, name, price, quantity
- Expandable to show participant selection
- Checkboxes with custom styling
- Delete/edit actions

**Participant Selector:**
- Multi-select chip group
- "Select All" toggle
- "Split Equally" indicator showing share count

**Summary Card:**
- Sticky position
- Animated number counters
- Per-person breakdown list
- Copy summary button

**Input Fields:**
- Dark filled variant
- Floating labels
- Validation states with icons

**Buttons:**
- Primary: Purple gradient with glow
- Secondary: Outlined with hover fill
- Icon buttons with ripple effect
- FAB for adding items

---

## 3. Functionality Specification

### Core Features

**1. Member Management**
- Add members by name (Enter key or button)
- Remove members with confirmation
- Members displayed as selectable chips
- Default: Empty state with prompt

**2. Item Management**
- Add items with: name, price, quantity (default 1)
- Edit existing items inline
- Delete items with undo option
- Items can be marked as "shared" or "individual"

**3. Percentage/Fixed Items (Tax, Tip, Fee)**
- Special item type: Percentage or Fixed amount
- Percentage applied to subtotal
- Fixed amounts added directly to total
- Configurable label (Tax 8%, Tip 20%, etc.)

**4. Participant Selection**
- Per-item participant selection
- Toggle individual members on/off
- "Select All" / "Deselect All" bulk actions
- Visual indicator showing split count

**5. Quantity Support**
- Number input for quantity
- Price multiplied by quantity
- Display shows "2x $15.00 = $30.00" format

**6. Calculation Engine**
- Subtotal: Sum of all item prices × quantities
- Percentage items: Applied to subtotal
- Fixed items: Added directly
- Per-person share: (item price × quantity) / participant count
- Each person's total: Sum of all their shares
- Real-time recalculation on any change

### User Interactions

- Click to add/edit/delete
- Drag to reorder items (optional enhancement)
- Keyboard navigation support
- Tab through inputs
- Escape to cancel edits

### Data Handling

- All state managed in React (useState/useReducer)
- LocalStorage persistence for session recovery
- No external API calls

### Edge Cases

- Zero members: Show prompt to add members
- Zero participants on item: Show warning
- All items excluded: Show zero totals
- Very long names: Truncate with ellipsis
- Decimal precision: 2 decimal places, round half-up

---

## 4. Acceptance Criteria

1. ✓ Can add/remove members by name
2. ✓ Can add items with name, price, and quantity
3. ✓ Can add percentage-based items (tax, tip)
4. ✓ Can add fixed-fee items
5. ✓ Can select which members split each item
6. ✓ Can exclude specific members from items
7. ✓ Calculates correct per-person total in real-time
8. ✓ Responsive layout works on mobile/tablet/desktop
9. ✓ Dark Material UI with specified color palette
10. ✓ Smooth animations and micro-interactions
11. ✓ Data persists in localStorage
