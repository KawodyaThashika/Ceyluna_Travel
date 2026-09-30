# Ceyluna Travels Travel Platform Manual
=========================================

Welcome to the **Ceyluna Travels** Travel Platform manual. This document provides a comprehensive guide for developers, system administrators, and end-users (travelers) on how to initialize, operate, and extend the Ceyluna Travels travel planner and operator platform.

Ceyluna Travels is a premium, React-based Single Page Application (Vite + TypeScript + Tailwind CSS) designed for Sri Lankan travel operators, centered around Tangalle. It features an interactive, dynamic 10-step tour builder, a dual-role authentication simulator, individual customer dashboards, and an executive administration dashboard.

---

## Table of Contents
1. [System Quick Start](#1-system-quick-start)
2. [Dual-Role Authentication & Simulator Accounts](#2-dual-role-authentication--simulator-accounts)
3. [The 10-Step Interactive Tour Builder](#3-the-10-step-interactive-tour-builder)
4. [Pricing Engine & Cost Calculator Breakdown](#4-pricing-engine--cost-calculator-breakdown)
5. [Customer Dashboard Features](#5-customer-dashboard-features)
6. [Admin Control Centre Features](#6-admin-control-centre-features)
7. [Contact & Support Details](#7-contact--support-details)
8. [Developer Architecture & Data Structures](#8-developer-architecture--data-structures)

---

## 1. System Quick Start

### Installation & Initialization
To run the server locally, clone or copy the project directory to your workstation and execute the following commands in your shell:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   *Note: If the default port (5173) is in use, Vite will automatically select the next available port (e.g., 5174).*
3. **Compile and Type-Check**:
   ```bash
   npx tsc --noEmit
   ```
4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   This generates a high-efficiency production distribution inside the `dist/` directory.

---

## 2. Dual-Role Authentication & Simulator Accounts

Ceyluna Travels ships with an authentication workflow (`src/pages/AuthPages.tsx`) that routes users based on their credentials and chosen roles.

### User Roles
- **Client (Traveler)**: Registers or logs in using standard credentials. Once authenticated, they are redirected to their personalized customer dashboard.
- **Administrator (Operator)**: Authenticates using the preconfigured admin account to access metrics, pending actions, and booking pipelines.

### Preconfigured Administrator Account
To access the **Admin Control Centre**, go to the Sign In page at `/auth` (or click "Login" in the navigation bar) and enter:
- **Email**: `kawodyathashika@gmail.com`
- **Password**: `Kawodya2001@`

*Simulation details:* Any other email/password input combination will default to a client traveler simulation and direct you to the **Customer Dashboard**.

---

## 3. The 10-Step Interactive Tour Builder

The **Interactive Tour Builder** (`src/pages/BuildTourPage.tsx`) is a 10-step wizard that enables travelers to build their dream custom Sri Lankan itinerary with instant, dynamic pricing.

### Wizard Steps Breakdown:
1. **Pickup Location**: Select from:
   - **Start from Tangalle** (Default starting configuration)
   - **Airport Transfer**: Pick Bandaranaike International (CMB) or Mattala Rajapaksa International (HRI), with input fields for Flight Number.
   - **Custom Location**: Specify beach resorts or other hotels anywhere in Sri Lanka.
2. **Travel Dates**: Select the Arrival and Departure dates. The system automatically computes the total tour duration in Days and Nights.
3. **Travelers Group**: Increment or decrement adult group members (ages 12+) and children (ages 2-11). Select preferred travel language (English, German, French, Spanish, Japanese, or Chinese).
4. **Select Destinations**: Browse and toggle target destinations (e.g., Colombo, Kandy, Nuwara Eliya, Ella, Yala National Park, Mirissa, Galle Fort, Sigiriya).
5. **Accommodation Class**: Select from 5 property tiers:
   - **Budget ($25-$45/night)**: Clean guesthouses/homestays with basic WiFi.
   - **Standard ($50-$80/night)**: Comfort 3-star resort hotels with pools.
   - **Boutique ($90-$160/night)**: Wellness retreats, eco-lodges, or heritage reserves.
   - **Premium ($170-$250/night)**: Luxurious 4-star boutique hotels.
   - **Luxury ($300+/night)**: Spectacular 5-star ocean-facing villas.
6. **Vehicle Selection**: Select from available fleets (Sedan, Tour Van, Luxury Mini-Coach, or SUV). If the traveler count exceeds passenger capacities, the system raises a recommendation warning.
7. **Activities & Experiences**: Add specific local excursions (e.g., Sigiriya Citadel climb, Whale watching in Mirissa, Udawalawe Safari).
8. **Additional Services**: Opt-in for dedicated services such as a dedicated English-speaking guide ($40/day), child safety seats ($15), photography package ($120), or cargo luggage car ($60/day).
9. **Review Itinerary**: View an auto-compiled, day-by-day routing that distributes destinations and custom-selected excursions evenly across the trip timeline.
10. **Confirm & Book**: Review warning notices, final cost structures, and clicks "Confirm & Save Tour" to save the booking quote.

---

## 4. Pricing Engine & Cost Calculator Breakdown

The pricing calculations update React states instantly upon any traveler input modification. Let's delve into the backend mechanics of this pricing calculation engine:

### 1. Transportation Charges
*   **Base Rent**: (Vehicle Daily Tariff Rate) × (Total Days)
*   **Fuel Estimates**: Est. distance in kilometers (computed dynamically from the destination's custom distance values to Tangalle: `distanceFromTangalle * 1.5` multiplier) × (Vehicle per-kilometer tariff fuel rate × 1.25)
*   **Driver Wages**: $0/day if driver services are listed in base vehicle package, or flat $25/day for standalone vehicles.
*   **Airport Surcharge**: Fixed $85 (CMB transfer) or $35 (HRI transfer) if airport pickup was check-marked.
*   **Highways & Parking**: Flat $35 configuration.

### 2. Accommodation Charges
Calculates room counts dynamically using: $\text{Rooms} = \lceil \frac{\text{Adults}}{2} \rceil$.
*   **Hotels Cost**: (Tariff rate determined by hotel category) × (Rooms Count) × (Total Nights)
    - *Rates per night*: Budget ($35), Standard ($65), Boutique ($120), Premium ($185), Luxury ($380)

### 3. Excursions & Activities
Individual excursion prices are added up based on group numbers:
*   $\text{Excursion Cost} = (\text{Base Excursion Price} \times \text{AdultsCount}) + (50\% \times \text{Base Price} \times \text{ChildrenCount})$

### 4. Special Services
*   **English speaking guide**: $40 / day
*   **Extra luggage vehicle**: $60 / day
*   **Child safety car seat**: $15 flat
*   **Travel photography**: $120 flat

### 5. Discounts & Fees
*   ** Ceyluna Travels Planning Fee**: 8% service charge is added to subtotal.
*   **Group Discount**: If traveling group count (Adults + Children) exceeds 4 people, a **5% discount** is deducted from the subtotal.
*   **Currency Conversion**: Supports instant switching between USD ($), EUR (€), GBP (£), and LKR (Rs.) using live-updating mock rates.

---

## 5. Customer Dashboard Features

The **Customer Dashboard** (`src/pages/CustomerDashboard.tsx`) provides full booking control to end-users via frontend `localStorage` persistence.

- **Saved Quotes Panel**: Displays all saved tours generated through the Interactive Tour Builder, showing Reference IDs, itineraries, pricing, and statuses (e.g., Quotation Sent).
- **Standalone Custom Requests**: Shows custom inquiries submitted through the standalone inquiry form.
- **Detailed Itinerary View**: Renders the complete route schedule and breakdowns. Users can review day-by-day accommodations, events, and highlights.
- **Print Functionality**: Native print style rules format the itinerary into a clean, physical brochure.
- **WhatsApp Support Link**: Quick connect to the Ceyluna Travels operator hotline (+94 76 767 4827) to request modifications.

---

## 6. Admin Control Centre Features

The **Admin Control Centre** (`src/pages/AdminDashboard.tsx`) is the management center for tour operators, showing real-time statistics and pipelines.

- **Pipeline Statistics**:
  - **Booking Pipeline Total**: Displays the aggregate dollar value of all pipeline quotations + base mock earnings ($12,850).
  - **System Web Traffic**: Counts total virtual system visits (incremented by stored quotations and inquiries).
  - **Conversion Rate**: Measures ratios of quotations versus inquiries.
  - **Pending Workspace Actions**: Counts total items requiring operator confirmation.
- **Quoted Reservations List**: Display grid of all builder quotes. Admins can confirm custom reservations (updating state to 'confirmed' in both Admin and Client workspaces) or delete stale quotes.
- **Inbound Inquiries List**: Lists all standalone custom tour requests with full contact emails, phone numbers, and dietary requirements.
- **Fleet Inventory & Activities List**: Real-time reference grid displaying vehicle rental tariffs ($/day) and individual excursion pricing.

---

## 7. Contact & Support Details

Across the platform (navbars, footers, contact page, and inquiry confirmation forms), contact endpoints have been standardized to:

*   **Email Support**: `ceylunatravelstours@gmail.com`
*   **WhatsApp Support**: `+94 76 767 4827` (Tangalle Head Office)
*   **Physical Office Address**: Tangalle, Southern Province, Sri Lanka.

---

## 8. Developer Architecture & Data Structures

For developer reference, Ceyluna Travels uses `localStorage` keys to maintain states across sessions.

### LocalStorage Keys
1.  `customer_bookings` and `admin_quotations`:
    Holds array of customized itinerary objects generated from the tour builder.
    ```json
    [
      {
        "id": "BK-XXXXXX",
        "state": { ...TourBuilderState },
        "priceBreakdown": { ...PriceBreakdown },
        "itineraryDays": [ ...CalculatedDays ],
        "status": "quotation_sent",
        "createdAt": "2026-07-16T..."
      }
    ]
    ```
2.  `tour_requests` and `customer_inquiries`:
    Holds array of custom inquiries submitted via `CustomTourRequestPage.tsx`.
    ```json
    [
      {
        "id": "inq-XXXXXX",
        "customerName": "John Doe",
        "email": "john@example.com",
        "phone": "+44123456",
        "country": "Germany",
        "arrivalDate": "2026-08-01",
        "departureDate": "2026-08-14",
        "adults": 2,
        "children": 1,
        "budget": "standard",
        "interests": ["Beach Relaxation", "Wildlife Safari"],
        "preferredDestinations": ["tangalle", "galle-fort"],
        "accommodationType": "standard",
        "airportPickup": true,
        "flightNumber": "UL 504",
        "arrivalTime": "12:00",
        "specialRequirements": "",
        "dietaryRequirements": "None",
        "notes": "",
        "status": "inquiry_submitted",
        "createdAt": "2026-07-16T..."
      }
    ]
    ```

### Seed Data Modules
Developers can inspect, add, or customize destinations, tour packages, vehicles, and activities standard packages in:
- `src/data/destinations.ts`
- `src/data/packages.ts`
- `src/data/services.ts`
