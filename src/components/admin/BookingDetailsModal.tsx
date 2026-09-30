import {
    X, User, Mail, Phone, MapPin, Calendar, Users, Car, Sparkles,
    Wallet, PlaneLanding, Home, MessageSquareText, Globe
} from 'lucide-react';
import { destinations } from '../../data/destinations';
import { useContent } from '../../context/ContentContext';

interface BookingDetailsModalProps {
    booking: any;
    onClose: () => void;
}

const destinationName = (id: string) => destinations.find(d => d.id === id)?.name || id;

const statusLabel = (status: string) => (status || '').replace(/_/g, ' ');

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
    const { vehicles, activities } = useContent();
    const vehicleInfo = (id: string) => vehicles.find(v => v.id === id);
    const activityName = (id: string) => activities.find(a => a.id === id)?.name || id;

    if (!booking) return null;

    const state = booking.state || {};
    const pricing = booking.priceBreakdown || {};
    const pickup = state.pickupLocation || {};
    const days = booking.itineraryDays || [];
    const vehicle = vehicleInfo(state.selectedVehicle);

    return (
        <div
            className="fixed inset-0 z-50 bg-surface-950/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-3xl rounded-2xl border border-surface-200 shadow-xl my-6 sm:my-0 max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-surface-150 p-5 sm:p-6 flex justify-between items-start gap-4 rounded-t-2xl">
                    <div>
                        <span className="text-[10px] font-bold text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded-full uppercase">
                            Booking Details
                        </span>
                        <h2 className="text-lg sm:text-xl font-display font-bold text-surface-900 mt-1.5 font-mono">{booking.bookingRef}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-primary-100/60 font-bold text-primary-750 px-2 py-0.5 rounded uppercase">
                                {statusLabel(booking.status)}
                            </span>
                            {booking.createdAt && (
                                <span className="text-[10px] text-surface-450">
                                    Submitted {new Date(booking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-800 transition-colors flex-shrink-0"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                    {/* Total cost banner */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-900 via-primary-850 to-surface-950 text-white grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-md">
                        <div>
                            <span className="text-[10px] text-white/60 block uppercase font-bold tracking-wider">Grand Total</span>
                            <span className="text-xl font-extrabold font-display mt-1 block">
                                {pricing.currency || 'USD'} {pricing.total?.toLocaleString() ?? '—'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/60 block uppercase font-bold tracking-wider">Per Person</span>
                            <span className="text-sm font-bold mt-1 block">{pricing.currency || 'USD'} {pricing.perPerson?.toLocaleString() ?? '—'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/60 block uppercase font-bold tracking-wider">Duration</span>
                            <span className="text-sm font-bold mt-1 block">{days.length || 1} Days</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/60 block uppercase font-bold tracking-wider">Travelers</span>
                            <span className="text-sm font-bold mt-1 block">{state.travelers?.adults ?? 0} Adults, {state.travelers?.children ?? 0} Children</span>
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <User size={14} className="text-primary-600" /> Customer
                        </h3>
                        <div className="bg-surface-50 border border-surface-150 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Name</span>
                                <span className="font-semibold text-surface-800">{booking.user?.fullName || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold flex items-center gap-1"><Mail size={11} /> Email</span>
                                <span className="font-semibold text-surface-800 break-all">{booking.user?.email || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold flex items-center gap-1"><Phone size={11} /> Phone</span>
                                <span className="font-semibold text-surface-800">{booking.user?.phone || '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trip Overview */}
                    <div>
                        <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <Calendar size={14} className="text-primary-600" /> Trip Overview
                        </h3>
                        <div className="bg-surface-50 border border-surface-150 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Travel Dates</span>
                                <span className="font-semibold text-surface-800">{state.travelDates?.start || '—'} → {state.travelDates?.end || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Travel Style</span>
                                <span className="font-semibold text-surface-800 capitalize">{state.travelStyle || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Accommodation</span>
                                <span className="font-semibold text-surface-800 capitalize">{state.accommodationPreference || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold flex items-center gap-1"><Globe size={11} /> Language</span>
                                <span className="font-semibold text-surface-800 capitalize">{state.language || '—'}</span>
                            </div>
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold flex items-center gap-1"><Users size={11} /> Group Size</span>
                                <span className="font-semibold text-surface-800">{(state.travelers?.adults ?? 0) + (state.travelers?.children ?? 0)} Pax</span>
                            </div>
                            {state.budgetRange && (
                                <div>
                                    <span className="text-surface-450 block text-[10px] uppercase font-semibold flex items-center gap-1"><Wallet size={11} /> Budget Range</span>
                                    <span className="font-semibold text-surface-800">${state.budgetRange.min?.toLocaleString()} - ${state.budgetRange.max?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pickup */}
                    <div>
                        <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <PlaneLanding size={14} className="text-primary-600" /> Pickup &amp; Arrival
                        </h3>
                        <div className="bg-surface-50 border border-surface-150 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Pickup Type</span>
                                <span className="font-semibold text-surface-800 capitalize">{pickup.type || '—'}</span>
                            </div>
                            {pickup.type === 'airport' && (
                                <>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Airport</span>
                                        <span className="font-semibold text-surface-800">{pickup.airportName || pickup.airportCode || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Flight No.</span>
                                        <span className="font-semibold text-surface-800">{pickup.flightNumber || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Arrival</span>
                                        <span className="font-semibold text-surface-800">{pickup.arrivalDate || '—'} {pickup.arrivalTime || ''}</span>
                                    </div>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Passengers / Luggage</span>
                                        <span className="font-semibold text-surface-800">{pickup.passengers ?? '—'} pax / {pickup.luggage ?? '—'} bags</span>
                                    </div>
                                </>
                            )}
                            {pickup.type === 'custom' && (
                                <>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Hotel</span>
                                        <span className="font-semibold text-surface-800">{pickup.hotelName || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">City</span>
                                        <span className="font-semibold text-surface-800">{pickup.city || '—'}</span>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <span className="text-surface-450 block text-[10px] uppercase font-semibold">Address</span>
                                        <span className="font-semibold text-surface-800">{pickup.address || '—'}</span>
                                    </div>
                                </>
                            )}
                            <div>
                                <span className="text-surface-450 block text-[10px] uppercase font-semibold">Extra Pickup Cost</span>
                                <span className="font-semibold text-surface-800">${pickup.additionalCost ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Destinations, Vehicle, Activities, Services */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                <MapPin size={14} className="text-primary-600" /> Destinations
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {(state.selectedDestinations || []).length > 0 ? (
                                    state.selectedDestinations.map((id: string) => (
                                        <span key={id} className="text-[10px] font-semibold bg-primary-50 text-primary-750 px-2.5 py-1 rounded-full">
                                            {destinationName(id)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-surface-400">No destinations selected.</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                <Car size={14} className="text-primary-600" /> Vehicle
                            </h3>
                            <span className="text-xs font-semibold text-surface-800">
                                {vehicle ? `${vehicle.name} (${vehicle.passengerCapacity} pax max)` : (state.selectedVehicle || '—')}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                <Sparkles size={14} className="text-primary-600" /> Activities
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {(state.selectedActivities || []).length > 0 ? (
                                    state.selectedActivities.map((id: string) => (
                                        <span key={id} className="text-[10px] font-semibold bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full">
                                            {activityName(id)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-surface-400">No activities selected.</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                <Home size={14} className="text-primary-600" /> Additional Services
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {(pricing.additionalServices?.items || []).length > 0 ? (
                                    pricing.additionalServices.items.map((s: any, i: number) => (
                                        <span key={i} className="text-[10px] font-semibold bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full">
                                            {s.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-surface-400">None requested.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    {state.specialRequests && (
                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                <MessageSquareText size={14} className="text-primary-600" /> Special Requests
                            </h3>
                            <p className="bg-surface-50 border border-surface-150 rounded-xl p-4 text-xs text-surface-700 whitespace-pre-wrap">{state.specialRequests}</p>
                        </div>
                    )}

                    {/* Day-by-day itinerary */}
                    {days.length > 0 && (
                        <div>
                            <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider mb-2.5">Day-by-Day Itinerary</h3>
                            <div className="space-y-2.5">
                                {days.map((day: any) => (
                                    <div key={day.day} className="p-3.5 bg-surface-50 rounded-xl border border-surface-150 text-xs">
                                        <div className="flex gap-2 items-center mb-1 bg-white p-1.5 rounded-lg border w-fit">
                                            <span className="font-bold text-primary-750">Day {day.day}</span>
                                            {day.destination && (
                                                <>
                                                    <span className="text-surface-400">|</span>
                                                    <span className="font-semibold text-surface-800">{day.destination}</span>
                                                </>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-surface-900 text-xs mt-1.5">{day.title}</h4>
                                        <div className="mt-2 pl-3 border-l-2 border-primary-500 space-y-1 text-surface-555">
                                            {day.accommodation && <p>🏨 <strong>Accommodation:</strong> {day.accommodation}</p>}
                                            {day.activities && <p><strong>Excursions:</strong> {Array.isArray(day.activities) ? day.activities.join(', ') : day.activities}</p>}
                                            {day.meals && <p>🍽️ <strong>Meals:</strong> {Array.isArray(day.meals) ? day.meals.join(', ') : day.meals}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price breakdown */}
                    <div>
                        <h3 className="font-bold text-surface-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <Wallet size={14} className="text-primary-600" /> Price Breakdown
                        </h3>
                        <div className="bg-surface-50 border border-surface-150 rounded-xl p-4 text-xs divide-y divide-surface-200">
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Vehicle Rental</span>
                                <span className="font-semibold">${pricing.transportation?.vehicleRental?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Driver Cost</span>
                                <span className="font-semibold">${pricing.transportation?.driverCost?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Fuel Cost</span>
                                <span className="font-semibold">${pricing.transportation?.fuelCost?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Airport Pickup</span>
                                <span className="font-semibold">${pricing.transportation?.airportPickup?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Parking &amp; Highway</span>
                                <span className="font-semibold">${((pricing.transportation?.parking ?? 0) + (pricing.transportation?.highway ?? 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Accommodation ({pricing.accommodation?.nights ?? 0} nights)</span>
                                <span className="font-semibold">${pricing.accommodation?.hotelCost?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Activities</span>
                                <span className="font-semibold">${pricing.activities?.total?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Additional Services</span>
                                <span className="font-semibold">${pricing.additionalServices?.total?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Subtotal</span>
                                <span className="font-semibold">${pricing.subtotal?.toLocaleString() ?? 0}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                                <span className="text-surface-555">Service Charge</span>
                                <span className="font-semibold">${pricing.serviceCharge?.toLocaleString() ?? 0}</span>
                            </div>
                            {(pricing.discount ?? 0) > 0 && (
                                <div className="flex justify-between py-1.5">
                                    <span className="text-green-600">Group Discount</span>
                                    <span className="font-semibold text-green-600">-${pricing.discount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-2 pt-3">
                                <span className="font-bold text-surface-900">Grand Total</span>
                                <span className="font-extrabold text-primary-750">{pricing.currency || 'USD'} ${pricing.total?.toLocaleString() ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
