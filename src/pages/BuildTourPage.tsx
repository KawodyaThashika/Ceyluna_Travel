import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { useContent } from '../context/ContentContext';
import {
    Compass, MapPin, Calendar, Users, Home, Car, AlertCircle, CheckCircle2,
    Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, DollarSign,
    ChevronRight, RefreshCw, FileText
} from 'lucide-react';
import { TourBuilderState, PriceBreakdown } from '../types';

export default function BuildTourPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const packageParam = searchParams.get('package');
    const { packages: tourPackages, getPackageById: getTourPackageById, vehicles, activities: allActivities } = useContent();

    // Multi-step form state
    const [step, setStep] = useState(1);
    const [builderState, setBuilderState] = useState<TourBuilderState>({
        step: 1,
        pickupLocation: {
            type: 'tangalle',
            airportCode: 'CMB',
            airportName: 'Bandaranaike International Airport',
            flightNumber: '',
            arrivalDate: '',
            arrivalTime: '',
            passengers: 2,
            luggage: 2,
            hotelName: '',
            city: '',
            address: '',
            additionalCost: 0,
        },
        travelDates: {
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // + 7 days
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // + 14 days
        },
        travelers: {
            adults: 2,
            children: 0,
        },
        selectedDestinations: ['tangalle'], // default
        accommodationPreference: 'standard',
        selectedVehicle: 'sedan',
        selectedActivities: [],
        additionalServices: [],
        specialRequests: '',
        travelStyle: 'standard',
        language: 'English',
        budgetRange: { min: 50, max: 200 }
    });

    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'LKR'>('USD');
    const currencySymbols = { USD: '$', EUR: '€', GBP: '£', LKR: 'Rs. ' };
    const currencyRates = { USD: 1, EUR: 0.92, GBP: 0.78, LKR: 300 };

    // Generate suggested itinerary and cost dynamically
    const [itineraryDays, setItineraryDays] = useState<any[]>([]);
    const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

    // Initialize from package param if exists
    useEffect(() => {
        if (packageParam) {
            const pkg = getTourPackageById(packageParam);
            if (pkg) {
                // Load package defaults
                const arrival = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const departure = new Date(arrival.getTime() + pkg.duration * 24 * 60 * 60 * 1000);

                setBuilderState(prev => ({
                    ...prev,
                    selectedDestinations: pkg.destinations,
                    accommodationPreference: pkg.accommodationCategory,
                    travelDates: {
                        start: arrival.toISOString().split('T')[0],
                        end: departure.toISOString().split('T')[0]
                    },
                    selectedVehicle: pkg.vehicleType === 'sedan' ? 'sedan' : pkg.vehicleType === 'suv' ? 'suv' : 'van',
                    travelStyle: pkg.category as any
                }));
            }
        }
    }, [packageParam, tourPackages]);

    // Duration in days
    const getDurationDays = () => {
        if (!builderState.travelDates.start || !builderState.travelDates.end) return 1;
        const start = new Date(builderState.travelDates.start);
        const end = new Date(builderState.travelDates.end);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    const totalDays = getDurationDays();
    const totalNights = Math.max(0, totalDays - 1);

    // Calculate pricing
    useEffect(() => {
        const days = totalDays;
        const travelersCount = builderState.travelers.adults + builderState.travelers.children;
        const roomsCount = Math.ceil(builderState.travelers.adults / 2);

        // 1. Transportation
        let airportCharges = 0;
        if (builderState.pickupLocation.type === 'airport') {
            airportCharges = builderState.pickupLocation.airportCode === 'CMB' ? 85 : 35;
        } else if (builderState.pickupLocation.type === 'custom') {
            airportCharges = 50; // default custom transfer fee
        }

        const selectedVehicleObj = vehicles.find(v => v.id === builderState.selectedVehicle) || vehicles[1]; // default sedan
        const vehicleRate = selectedVehicleObj.dailyRate;

        // Distance Estimation
        let estDistance = 150; // base km
        builderState.selectedDestinations.forEach(destId => {
            const dest = destinations.find(d => d.id === destId);
            if (dest) estDistance += dest.distanceFromTangalle * 1.5; // multiplier for touring/reversing
        });

        const fuelCost = Math.round(estDistance * selectedVehicleObj.perKmRate * 1.25);
        const driverCost = selectedVehicleObj.driverIncluded ? 0 : 25 * days;
        const highwayAndParking = 35;
        const vehicleRental = vehicleRate * days;

        const totalTransport = vehicleRental + driverCost + fuelCost + airportCharges + highwayAndParking;

        // 2. Accommodation
        // Average price per room per night
        let hotelRate = 50;
        switch (builderState.accommodationPreference) {
            case 'budget': hotelRate = 35; break;
            case 'standard': hotelRate = 65; break;
            case 'boutique': hotelRate = 120; break;
            case 'premium': hotelRate = 185; break;
            case 'luxury': hotelRate = 380; break;
        }
        const totalAccommodation = hotelRate * roomsCount * totalNights;

        // 3. Activities
        const actList: { name: string; cost: number }[] = [];
        builderState.selectedActivities.forEach(actId => {
            const actObj = allActivities.find(a => a.id === actId);
            if (actObj) {
                // Adult full price, child 50% price
                const cost = Math.round((actObj.price * builderState.travelers.adults) + (actObj.price * 0.5 * builderState.travelers.children));
                actList.push({ name: actObj.name, cost });
            }
        });
        const totalActivities = actList.reduce((acc, a) => acc + a.cost, 0);

        // 4. Additional Services
        const serviceList: { name: string; cost: number }[] = [];
        if (builderState.additionalServices.includes('english-guide')) {
            serviceList.push({ name: 'Dedicated English Speaking Guide', cost: 40 * days });
        }
        if (builderState.additionalServices.includes('child-seat')) {
            serviceList.push({ name: 'Child Safety Car Seat', cost: 15 });
        }
        if (builderState.additionalServices.includes('extra-baggage-car')) {
            serviceList.push({ name: 'Extra Baggage Transport Vehicle', cost: 60 * days });
        }
        if (builderState.additionalServices.includes('photography')) {
            serviceList.push({ name: 'Travel Photography Service', cost: 120 });
        }
        const totalServices = serviceList.reduce((acc, s) => acc + s.cost, 0);

        // Totals
        const subtotal = totalTransport + totalAccommodation + totalActivities + totalServices;
        const serviceCharge = Math.round(subtotal * 0.08); // 8% Ceyluna Travels planning fee
        const discount = travelersCount > 4 ? Math.round(subtotal * 0.05) : 0; // 5% discount for groups > 4
        const total = subtotal + serviceCharge - discount;
        const perPerson = Math.round(total / travelersCount);

        setPriceBreakdown({
            transportation: {
                vehicleRental,
                driverCost,
                fuelCost,
                airportPickup: airportCharges,
                parking: 15,
                highway: 20
            },
            accommodation: {
                hotelCost: totalAccommodation,
                nights: totalNights
            },
            activities: {
                items: actList,
                total: totalActivities
            },
            additionalServices: {
                items: serviceList,
                total: totalServices
            },
            subtotal,
            serviceCharge,
            discount,
            total,
            perPerson,
            currency: 'USD'
        });

        // Make visual day-by-day Itinerary
        const calculatedDays: any[] = [];
        const totalDestLength = builderState.selectedDestinations.length;

        for (let d = 1; d <= days; d++) {
            // Evenly distribute selected destinations across travel days
            const destIndex = Math.min(totalDestLength - 1, Math.floor(((d - 1) / days) * totalDestLength));
            const currentDestId = builderState.selectedDestinations[destIndex] || 'tangalle';
            const currentDestObj = destinations.find(dest => dest.id === currentDestId) || destinations[0];

            // Match activities for this destination
            const dayActs = allActivities
                .filter(act => act.destinationId === currentDestId && builderState.selectedActivities.includes(act.id))
                .map(act => act.name);

            calculatedDays.push({
                day: d,
                title: d === 1 && builderState.pickupLocation.type === 'airport'
                    ? `Arrival & Strategic Transfer to ${currentDestObj.name}`
                    : d === days
                        ? `Relaxation & Departure from ${currentDestObj.name}`
                        : `Explore the Wonders of ${currentDestObj.name}`,
                destination: currentDestObj.name,
                activities: dayActs.length > 0 ? dayActs : ['Leisurely local exploration', 'Relaxation at hotel'],
                accommodation: d === days ? 'End of journey' : `${builderState.accommodationPreference.toUpperCase()} class hotel in ${currentDestObj.name}`
            });
        }
        setItineraryDays(calculatedDays);

    }, [builderState, totalDays]);

    const handleNextStep = () => {
        if (step < 10) setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleDestinationToggle = (destId: string) => {
        setBuilderState(prev => {
            const selected = prev.selectedDestinations.includes(destId)
                ? prev.selectedDestinations.filter(id => id !== destId)
                : [...prev.selectedDestinations, destId];
            // Keep at least one destination
            const selectedDestinations = selected.length > 0 ? selected : [destId];
            return { ...prev, selectedDestinations };
        });
    };

    const handleActivityToggle = (actId: string) => {
        setBuilderState(prev => {
            const selectedActivities = prev.selectedActivities.includes(actId)
                ? prev.selectedActivities.filter(id => id !== actId)
                : [...prev.selectedActivities, actId];
            return { ...prev, selectedActivities };
        });
    };

    const handleServiceToggle = (servId: string) => {
        setBuilderState(prev => {
            const additionalServices = prev.additionalServices.includes(servId)
                ? prev.additionalServices.filter(id => id !== servId)
                : [...prev.additionalServices, servId];
            return { ...prev, additionalServices };
        });
    };

    const convertPrice = (priceInUSD: number) => {
        const rate = currencyRates[selectedCurrency];
        return Math.round(priceInUSD * rate).toLocaleString();
    };

    const handleCreateBooking = () => {
        let msg = `Hi Ceyluna Travels! I would like to book a custom tour.\n\n`;
        msg += `*Travelers:* ${builderState.travelers.adults} Adults, ${builderState.travelers.children} Children\n`;
        msg += `*Dates:* ${builderState.travelDates.start} to ${builderState.travelDates.end}\n`;
        msg += `*Pickup:* ${builderState.pickupLocation.type}\n`;
        msg += `*Accommodation:* ${builderState.accommodationPreference}\n`;
        msg += `*Destinations:* ${builderState.selectedDestinations.map((id) => destinations.find((d) => d.id === id)?.name || id).join(', ')}\n`;
        if (priceBreakdown) {
            msg += `*Estimated Total:* $${priceBreakdown.total}\n\n`;
        }
        msg += `Please send me the final quotation!`;

        const whatsappUrl = `https://wa.me/94767674827?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            <div className="container-custom">
                <div className="text-center mb-8">
                    <span className="badge-accent mb-3">🛠️ Interactive Travel Planner</span>
                    <h1 className="text-3xl sm:text-5xl font-display font-semibold text-surface-900 mb-2">Build Your Dream Sri Lanka Tour</h1>
                    <p className="text-xs sm:text-sm text-surface-500">Day budget estimation updates dynamically as you toggle transport, hotels, and activities.</p>
                </div>

                {/* Step Progression Bar */}
                <div className="hidden lg:flex justify-between items-center bg-white p-4 rounded-xl border mb-8 text-xs font-semibold overflow-x-auto gap-2">
                    {[
                        'Pickup', 'Dates', 'Travelers', 'Destinations',
                        'Hotels', 'Vehicle', 'Activities', 'Services', 'Itinerary', 'Estimations'
                    ].map((name, i) => (
                        <button
                            key={name}
                            onClick={() => setStep(i + 1)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${step === i + 1 ? 'bg-primary-600 text-white shadow-sm' : i + 1 < step ? 'text-primary-700 bg-primary-50' : 'text-surface-450 hover:bg-surface-50'}`}
                        >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>
                            {name}
                        </button>
                    ))}
                </div>

                {/* Main Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-150 shadow-sm min-h-[480px] flex flex-col justify-between">
                            <div>
                                {/* Visual Header of Current Step */}
                                <div className="flex justify-between items-center border-b border-surface-100 pb-4 mb-6">
                                    <h2 className="text-xl font-bold font-display text-surface-900 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-xl bg-primary-100 text-primary-750 font-bold text-sm flex items-center justify-center">{step}</span>
                                        {step === 1 && 'Select Starting Location'}
                                        {step === 2 && 'Choose Travel Dates'}
                                        {step === 3 && 'Number of Travelers'}
                                        {step === 4 && 'Browse & Select Destinations'}
                                        {step === 5 && 'Select Accommodation preference'}
                                        {step === 6 && 'Recommend & Select Vehicle'}
                                        {step === 7 && 'Add Activities & Experiences'}
                                        {step === 8 && 'Select Additional Services'}
                                        {step === 9 && 'Review Generated Itinerary'}
                                        {step === 10 && 'Price Breakdowns & Book Tour'}
                                    </h2>
                                    <span className="text-xs text-surface-400 font-semibold">Step {step} of 10</span>
                                </div>

                                {/* STEP 1: PICKUP */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {['tangalle', 'airport', 'custom'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setBuilderState(prev => ({
                                                        ...prev,
                                                        pickupLocation: { ...prev.pickupLocation, type: type as any }
                                                    }))}
                                                    className={`p-5 rounded-xl border text-left flex flex-col justify-between h-36 transition-all ${builderState.pickupLocation.type === type ? 'border-primary-600 bg-primary-50/50 shadow-sm ring-1 ring-primary-650' : 'border-surface-200 hover:border-surface-300 bg-white'}`}
                                                >
                                                    <MapPin className={builderState.pickupLocation.type === type ? 'text-primary-750' : 'text-surface-450'} size={24} />
                                                    <div>
                                                        <h4 className="font-bold text-sm text-surface-900 capitalize">{type === 'airport' ? 'Airport Pickup' : type === 'tangalle' ? 'Start from Tangalle' : 'Custom Location'}</h4>
                                                        <p className="text-[10px] text-surface-500 mt-1">
                                                            {type === 'tangalle' && 'Base starting location (Default)'}
                                                            {type === 'airport' && 'Bandaranaike (CMB) or Mattala (HRI)'}
                                                            {type === 'custom' && 'Hotel or city anywhere in Sri Lanka'}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {builderState.pickupLocation.type === 'airport' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-surface-50 border border-surface-150 animate-in">
                                                <div>
                                                    <label className="label">Airport Terminal</label>
                                                    <select
                                                        value={builderState.pickupLocation.airportCode}
                                                        onChange={(e) => setBuilderState(prev => ({
                                                            ...prev,
                                                            pickupLocation: {
                                                                ...prev.pickupLocation,
                                                                airportCode: e.target.value,
                                                                airportName: e.target.value === 'CMB' ? 'Bandaranaike International Airport' : 'Mattala Rajapaksa International Airport'
                                                            }
                                                        }))}
                                                        className="select"
                                                    >
                                                        <option value="CMB">Bandaranaike (CMB) - Colombo</option>
                                                        <option value="HRI">Mattala (HRI) - Hambantota</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="label">Flight Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. UL 504"
                                                        value={builderState.pickupLocation.flightNumber}
                                                        onChange={(e) => setBuilderState(prev => ({
                                                            ...prev,
                                                            pickupLocation: { ...prev.pickupLocation, flightNumber: e.target.value }
                                                        }))}
                                                        className="input"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {builderState.pickupLocation.type === 'custom' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-surface-55 border border-surface-150 animate-in">
                                                <div>
                                                    <label className="label">City / Location Address</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Weligama beach resort"
                                                        value={builderState.pickupLocation.hotelName}
                                                        onChange={(e) => setBuilderState(prev => ({
                                                            ...prev,
                                                            pickupLocation: { ...prev.pickupLocation, hotelName: e.target.value }
                                                        }))}
                                                        className="input"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label">Google Maps Link (Optional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="https://maps.google.com/..."
                                                        value={builderState.pickupLocation.address}
                                                        onChange={(e) => setBuilderState(prev => ({
                                                            ...prev,
                                                            pickupLocation: { ...prev.pickupLocation, address: e.target.value }
                                                        }))}
                                                        className="input"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 2: DATES */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="label">Arrival / Tour Start Date</label>
                                                <input
                                                    type="date"
                                                    value={builderState.travelDates.start}
                                                    onChange={(e) => setBuilderState(prev => ({
                                                        ...prev,
                                                        travelDates: { ...prev.travelDates, start: e.target.value }
                                                    }))}
                                                    className="input animate-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="label">Departure / Tour End Date</label>
                                                <input
                                                    type="date"
                                                    value={builderState.travelDates.end}
                                                    onChange={(e) => setBuilderState(prev => ({
                                                        ...prev,
                                                        travelDates: { ...prev.travelDates, end: e.target.value }
                                                    }))}
                                                    className="input animate-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-primary-50 p-4 rounded-xl text-primary-750 flex items-center justify-between border border-primary-200">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={20} />
                                                <span className="text-sm font-semibold">Total Duration Calculated:</span>
                                            </div>
                                            <span className="text-xl font-bold font-display">{totalDays} Days / {totalNights} Nights</span>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: TRAVELERS */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-surface-50 p-6 rounded-xl border border-surface-150 flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-sm text-surface-900">Adults</h4>
                                                    <p className="text-[10px] text-surface-450">Ages 12+ years</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBuilderState(prev => ({
                                                            ...prev,
                                                            travelers: { ...prev.travelers, adults: Math.max(1, prev.travelers.adults - 1) }
                                                        }))}
                                                        className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shadow-xs hover:border-surface-300"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-lg font-bold w-6 text-center">{builderState.travelers.adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBuilderState(prev => ({
                                                            ...prev,
                                                            travelers: { ...prev.travelers, adults: prev.travelers.adults + 1 }
                                                        }))}
                                                        className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shadow-xs hover:border-surface-300"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-surface-50 p-6 rounded-xl border border-surface-150 flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-sm text-surface-900">Children</h4>
                                                    <p className="text-[10px] text-surface-450">Ages 2-11 years (50% tariff discount)</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBuilderState(prev => ({
                                                            ...prev,
                                                            travelers: { ...prev.travelers, children: Math.max(0, prev.travelers.children - 1) }
                                                        }))}
                                                        className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shadow-xs hover:border-surface-300"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-lg font-bold w-6 text-center">{builderState.travelers.children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBuilderState(prev => ({
                                                            ...prev,
                                                            travelers: { ...prev.travelers, children: prev.travelers.children + 1 }
                                                        }))}
                                                        className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shadow-xs hover:border-surface-300"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label">Preferred Travel Language</label>
                                            <select
                                                value={builderState.language}
                                                onChange={(e) => setBuilderState(prev => ({ ...prev, language: e.target.value }))}
                                                className="select"
                                            >
                                                <option value="English">English</option>
                                                <option value="German">German</option>
                                                <option value="French">French</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="Japanese">Japanese</option>
                                                <option value="Chinese">Chinese</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: DESTINATIONS */}
                                {step === 4 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Select destinations to include in your booking itinerary:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {destinations.map(dest => {
                                                const isSelected = builderState.selectedDestinations.includes(dest.id);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={dest.id}
                                                        onClick={() => handleDestinationToggle(dest.id)}
                                                        className={`p-3.5 rounded-xl border text-left transition-all ${isSelected ? 'border-primary-600 bg-primary-50/50 shadow-xs' : 'border-surface-200 hover:border-surface-300 bg-white'}`}
                                                    >
                                                        <span className={`text-xs block font-bold ${isSelected ? 'text-primary-750' : 'text-surface-850'}`}>{dest.name}</span>
                                                        <span className="text-[9.5px] text-surface-450">{dest.region} Region</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: ACCOMMODATION STYLE */}
                                {step === 5 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Choose your hotel/resort classification tier preference:</p>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'budget', label: 'Budget Lodging', price: '$25-$45/night', desc: 'Family guesthouses, clean basic lodging with hot water and WiFi.' },
                                                { id: 'standard', label: 'Standard Hotels', price: '$50-$80/night', desc: 'Comfortable 3-star hotels featuring scenic views and pool areas.' },
                                                { id: 'boutique', label: 'Boutique Retreats', price: '$90-$160/night', desc: 'Exceptional mid-scale wellness spots, eco lodges & heritage buildings.' },
                                                { id: 'premium', label: 'Premium Class', price: '$170-$250/night', desc: 'Premium 4-star hotels, award-winning hill country resorts.' },
                                                { id: 'luxury', label: 'Luxury Resorts & Villas', price: '$300+/night', desc: 'Out of this world 5-star private beachfront villas and clifftop properties.' },
                                            ].map(acc => (
                                                <button
                                                    type="button"
                                                    key={acc.id}
                                                    onClick={() => setBuilderState(prev => ({ ...prev, accommodationPreference: acc.id }))}
                                                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${builderState.accommodationPreference === acc.id ? 'border-primary-600 bg-primary-50/50 shadow-xs' : 'border-surface-200 hover:border-surface-300 bg-white'}`}
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-sm text-surface-900">{acc.label}</h4>
                                                        <p className="text-xs text-surface-500 mt-1 max-w-lg">{acc.desc}</p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-primary-750 bg-primary-100/50 px-2.5 py-1 rounded-lg">
                                                        {acc.price}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 6: VEHICLE */}
                                {step === 6 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Recommended vehicles based on group capacity ({builderState.travelers.adults + builderState.travelers.children} passengers):</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {vehicles.map(v => {
                                                const isRecommended = (builderState.travelers.adults + builderState.travelers.children) <= v.passengerCapacity;
                                                return (
                                                    <div
                                                        key={v.id}
                                                        className={`p-4 border rounded-xl flex gap-3 sm:flex-col justify-between items-start transition-all ${builderState.selectedVehicle === v.id ? 'border-primary-600 bg-primary-50/50 ring-1 ring-primary-600' : 'border-surface-200'}`}
                                                    >
                                                        <div className="flex gap-3 items-center">
                                                            <img src={v.image} alt={v.name} className="w-16 h-16 rounded-xl object-cover" />
                                                            <div>
                                                                <h4 className="font-bold text-sm text-surface-850">{v.name}</h4>
                                                                <p className="text-[10px] text-surface-500 mt-0.5">Capacity: {v.passengerCapacity} Pax / {v.luggageCapacity} Bags</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex sm:flex-row justify-between items-center gap-2 mt-2">
                                                            <div>
                                                                <span className="text-sm font-bold text-primary-750">${v.dailyRate}</span>
                                                                <span className="text-[10px] text-surface-450">/ day + ${v.perKmRate}/km</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setBuilderState(prev => ({ ...prev, selectedVehicle: v.id }))}
                                                                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${builderState.selectedVehicle === v.id ? 'bg-primary-600 border-primary-600 text-white shadow-xs' : 'border-surface-200 text-surface-700 bg-white hover:border-surface-300'}`}
                                                            >
                                                                Select
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 7: ACTIVITIES */}
                                {step === 7 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Add excursions to lock in tour price (pricing matches selection group):</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar bg-slate-50 p-4 rounded-xl border border-surface-150">
                                            {allActivities.map(act => {
                                                const isSelected = builderState.selectedActivities.includes(act.id);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={act.id}
                                                        onClick={() => handleActivityToggle(act.id)}
                                                        className={`p-3 rounded-xl border text-left flex gap-3 items-center transition-all ${isSelected ? 'border-primary-600 bg-white shadow-sm ring-1 ring-primary-500' : 'border-surface-200 bg-white hover:border-surface-230'}`}
                                                    >
                                                        <img src={act.image} alt={act.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <h4 className="font-bold text-xs text-surface-850 truncate">{act.name}</h4>
                                                            <p className="text-[9px] text-surface-400 block truncate mt-0.5">{act.location} ({act.duration})</p>
                                                            <span className="text-[10px] font-bold text-primary-650 mt-1 block">${act.price} / person</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 8: ADDITIONAL SERVICES */}
                                {step === 8 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Add custom requests or personnel updates:</p>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'english-guide', label: 'Dedicated English Speaking Guide', price: '$40/day', desc: 'Expert guide to coordinate entry points and histories.' },
                                                { id: 'child-seat', label: 'Child Safety Car Seat', price: '$15 total', desc: 'Secure fit booster/baby seat installed in selection vehicle.' },
                                                { id: 'extra-baggage-car', label: 'Extra Baggage Transport Vehicle', price: '$60/day', desc: 'Dedicated cargo car to carry excess bags for big groups.' },
                                                { id: 'photography', label: 'Travel Photography Service', price: '$120 total', desc: 'Accompanying professional portrait session in Sigiriya or Galle Fort.' },
                                            ].map(serv => {
                                                const isSelected = builderState.additionalServices.includes(serv.id);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={serv.id}
                                                        onClick={() => handleServiceToggle(serv.id)}
                                                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${isSelected ? 'border-primary-600 bg-primary-50/50 shadow-xs' : 'border-surface-200 hover:border-surface-300 bg-white'}`}
                                                    >
                                                        <div>
                                                            <h4 className="font-bold text-sm text-surface-900">{serv.label}</h4>
                                                            <p className="text-xs text-surface-500 mt-0.5">{serv.desc}</p>
                                                        </div>
                                                        <span className="text-xs font-semibold text-primary-750 bg-primary-100/50 px-2.5 py-1 rounded-lg">
                                                            {serv.price}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 9: REVIEW ITINERARY */}
                                {step === 9 && (
                                    <div className="space-y-4 animate-in">
                                        <p className="text-xs text-surface-450">Pre-generated day schedule based on target destinations:</p>
                                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {itineraryDays.map((day, idx) => (
                                                <div key={idx} className="p-4 bg-surface-50 border rounded-xl flex gap-3 items-start">
                                                    <span className="px-2 py-1 rounded bg-primary-600 text-white font-bold text-xs uppercase">
                                                        Day {day.day}
                                                    </span>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-surface-850">{day.title}</h4>
                                                        <p className="text-xs text-surface-500 mt-1">📍 Destination Hub: {day.destination}</p>
                                                        <p className="text-xs text-surface-500">🏢 Lodging: {day.accommodation}</p>
                                                        <p className="text-xs text-surface-500 mt-1">Events: {day.activities.join(', ')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 10: ESTIMATIONS & SUBMIT */}
                                {step === 10 && (
                                    <div className="space-y-6 animate-in">
                                        <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 space-y-4">
                                            <h3 className="font-bold text-primary-850 text-base flex items-center gap-1">
                                                <CheckCircle2 /> Final Itinerary Summary
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4 text-xs text-primary-700">
                                                <p>👤 <strong>Adults:</strong> {builderState.travelers.adults}</p>
                                                <p>👶 <strong>Children:</strong> {builderState.travelers.children}</p>
                                                <p>📅 <strong>Duration:</strong> {totalDays} Days / {totalNights} Nights</p>
                                                <p>🚗 <strong>Vehicle type:</strong> <span className="capitalize">{builderState.selectedVehicle}</span></p>
                                                <p className="col-span-2">📍 <strong>Destinations:</strong> {builderState.selectedDestinations.map(id => destinations.find(d => d.id === id)?.name || id).join(' → ')}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border bg-yellow-50/50 border-yellow-200 text-xs text-yellow-800 leading-relaxed">
                                            💡 <strong>Note to traveler:</strong> This quotation contains automatically compiled calculations based on dynamic tariffs. Our head travel experts will review the reservation request and send a final confirmation via email/WhatsApp within 24 hours.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation controls */}
                            <div className="flex justify-between items-center pt-6 border-t border-surface-100 mt-8">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    disabled={step === 1}
                                    className={`btn-secondary !py-2.5 !px-5 text-sm ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>

                                {step < 10 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="btn-primary !py-2.5 !px-6 text-sm"
                                    >
                                        Next Step <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleCreateBooking}
                                        className="btn-accent !py-2.5 !px-8 text-sm shadow-md"
                                    >
                                        Book via WhatsApp
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Cost Calculator Widget */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-premium border border-primary-100 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold font-display text-surface-900">Cost Calculator</h3>
                                <div className="flex gap-1.5">
                                    {(['USD', 'EUR', 'GBP', 'LKR'] as const).map(curr => (
                                        <button
                                            key={curr}
                                            onClick={() => setSelectedCurrency(curr)}
                                            className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors ${selectedCurrency === curr ? 'bg-primary-600 border-primary-600 text-white' : 'bg-surface-50 border-surface-200 text-surface-700'}`}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {priceBreakdown ? (
                                <div className="space-y-4">
                                    {/* Category break ups */}
                                    <div className="space-y-2.5 text-xs text-surface-600 pb-4 border-b border-surface-100">
                                        <div className="flex justify-between items-center">
                                            <span>🚗 Transportation Cost</span>
                                            <span className="font-semibold text-surface-850">
                                                {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.transportation.vehicleRental + priceBreakdown.transportation.fuelCost + priceBreakdown.transportation.airportPickup + 35)}
                                            </span>
                                        </div>
                                        {builderState.pickupLocation.type === 'airport' && (
                                            <div className="flex justify-between items-center pl-4 text-[10.5px] text-surface-450">
                                                <span>• Airport Transfer Pickup</span>
                                                <span>{currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.transportation.airportPickup)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span>🏨 Accommodation ({priceBreakdown.accommodation.nights} nights)</span>
                                            <span className="font-semibold text-surface-850">
                                                {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.accommodation.hotelCost)}
                                            </span>
                                        </div>
                                        {priceBreakdown.activities.total > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span>🎢 Activities ({priceBreakdown.activities.items.length})</span>
                                                <span className="font-semibold text-surface-850">
                                                    {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.activities.total)}
                                                </span>
                                            </div>
                                        )}
                                        {priceBreakdown.additionalServices.total > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span>Special Personnel & Guides</span>
                                                <span className="font-semibold text-surface-850">
                                                    {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.additionalServices.total)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Calculations */}
                                    <div className="space-y-2.5 text-xs pb-4 border-b border-surface-100">
                                        <div className="flex justify-between text-surface-500">
                                            <span>Subtotal</span>
                                            <span>{currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-surface-500">
                                            <span>Planning Fee / Service charge</span>
                                            <span>{currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.serviceCharge)}</span>
                                        </div>
                                        {priceBreakdown.discount > 0 && (
                                            <div className="flex justify-between text-green-600 font-medium">
                                                <span>Group Discount (5%)</span>
                                                <span>-{currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.discount)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grand total */}
                                    <div className="pt-2">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className="text-sm font-semibold text-surface-900">Total Quotation</span>
                                            <span className="text-3xl font-extrabold text-primary-850 font-display">
                                                {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-surface-500 pt-2 border-t border-dotted border-surface-200">
                                            <span>Price per traveler ({builderState.travelers.adults + builderState.travelers.children} total)</span>
                                            <span className="font-bold text-surface-700">
                                                {currencySymbols[selectedCurrency]}{convertPrice(priceBreakdown.perPerson)} / pax
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                                    <RefreshCw className="animate-spin mb-2" size={20} />
                                    <span className="text-xs">Connecting Pricing Engine...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
