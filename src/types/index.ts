// ============================
// Type Definitions for Ceyluna Travels
// ============================

export interface Destination {
    id: string;
    name: string;
    slug: string;
    region: string;
    category: string[];
    description: string;
    shortDescription: string;
    image: string;
    gallery: string[];
    attractions: string[];
    activities: string[];
    bestTimeToVisit: string;
    estimatedTimeRequired: string;
    nearbyDestinations: string[];
    lat: number;
    lng: number;
    distanceFromTangalle: number; // km
    travelTimeFromTangalle: string;
}

export interface TourPackage {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    duration: number; // days
    destinations: string[];
    category: string;
    description: string;
    image: string;
    gallery: string[];
    startingPrice: number;
    includes: string[];
    excludes: string[];
    itinerary: PackageDay[];
    vehicleType: string;
    accommodationCategory: string;
    rating: number;
    reviewCount: number;
    featured: boolean;
    popular: boolean;
}

export interface PackageDay {
    day: number;
    title: string;
    description: string;
    destinations: string[];
    activities: string[];
    meals: string[];
    accommodation: string;
    travelDistance?: string;
    travelTime?: string;
}

export interface Vehicle {
    id: string;
    name: string;
    type: string;
    passengerCapacity: number;
    luggageCapacity: number;
    hasAC: boolean;
    dailyRate: number;
    perKmRate: number;
    driverIncluded: boolean;
    image: string;
    features: string[];
    available: boolean;
}

export interface Activity {
    id: string;
    name: string;
    slug: string;
    location: string;
    destinationId: string;
    category: string;
    duration: string;
    price: number;
    priceNote?: string;
    minParticipants: number;
    maxParticipants?: number;
    description: string;
    image: string;
    included: string[];
    bestTime?: string;
    difficulty?: string;
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    destinationId: string;
    category: 'budget' | 'standard' | 'boutique' | 'premium' | 'luxury';
    priceRange: { min: number; max: number };
    roomTypes: string[];
    amenities: string[];
    description: string;
    image: string;
    rating: number;
}

export interface Review {
    id: string;
    customerName: string;
    country: string;
    avatar: string;
    rating: number;
    title: string;
    content: string;
    tourName: string;
    date: string;
    photos?: string[];
}

export interface PickupLocation {
    type: 'tangalle' | 'airport' | 'custom';
    airportCode?: string;
    airportName?: string;
    flightNumber?: string;
    arrivalDate?: string;
    arrivalTime?: string;
    passengers?: number;
    luggage?: number;
    hotelName?: string;
    city?: string;
    address?: string;
    additionalCost: number;
}

export interface TourRequest {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    country: string;
    arrivalDate: string;
    departureDate: string;
    adults: number;
    children: number;
    budget: string;
    interests: string[];
    preferredDestinations: string[];
    accommodationType: string;
    airportPickup: boolean;
    specialRequirements: string;
    dietaryRequirements: string;
    notes: string;
    status: BookingStatus;
    createdAt: string;
}

export type BookingStatus =
    | 'draft'
    | 'inquiry_submitted'
    | 'under_review'
    | 'quotation_sent'
    | 'changes_requested'
    | 'accepted'
    | 'deposit_pending'
    | 'partially_paid'
    | 'confirmed'
    | 'completed'
    | 'cancelled';

export type TravelStyle =
    | 'budget' | 'standard' | 'premium' | 'luxury'
    | 'adventure' | 'family' | 'honeymoon'
    | 'nature' | 'wildlife' | 'beach'
    | 'cultural' | 'relaxation' | 'custom';

export interface TourBuilderState {
    step: number;
    pickupLocation: PickupLocation;
    travelDates: { start: string; end: string };
    travelers: { adults: number; children: number };
    selectedDestinations: string[];
    accommodationPreference: string;
    selectedVehicle: string;
    selectedActivities: string[];
    additionalServices: string[];
    specialRequests: string;
    travelStyle: TravelStyle;
    language: string;
    budgetRange: { min: number; max: number };
}

export interface PriceBreakdown {
    transportation: {
        vehicleRental: number;
        driverCost: number;
        fuelCost: number;
        airportPickup: number;
        parking: number;
        highway: number;
    };
    accommodation: {
        hotelCost: number;
        nights: number;
    };
    activities: {
        items: { name: string; cost: number }[];
        total: number;
    };
    additionalServices: {
        items: { name: string; cost: number }[];
        total: number;
    };
    subtotal: number;
    serviceCharge: number;
    discount: number;
    total: number;
    perPerson: number;
    currency: string;
}

export interface FAQ {
    question: string;
    answer: string;
}
