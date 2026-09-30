// Central API client for the Ceyluna Travels backend.
// Set VITE_API_URL in a .env file at the project root, e.g.:
//   VITE_API_URL=http://localhost:5000/api        (local dev)
//   VITE_API_URL=https://api.yourdomain.com/api    (production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'cj_token';
const USER_KEY = 'cj_user';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function setSession(token: string, user: any) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function request(path: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new ApiError(data.message || 'Something went wrong. Please try again.', res.status);
    }
    return data;
}

export const api = {
    // ---- Auth ----
    register: (fullName: string, email: string, password: string, phone?: string) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify({ fullName, email, password, phone }) }),

    login: (email: string, password: string) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    me: () => request('/auth/me'),

    // ---- Bookings (tour builder quotes) ----
    createBooking: (payload: { state: any; priceBreakdown: any; itineraryDays: any }) =>
        request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

    myBookings: () => request('/bookings'),

    // ---- Inquiries (custom tour request / contact form) ----
    submitInquiry: (payload: Record<string, any>) =>
        request('/inquiries', { method: 'POST', body: JSON.stringify(payload) }),

    myInquiries: () => request('/inquiries/mine'),

    // ---- Admin ----
    adminStats: () => request('/admin/stats'),
    adminBookings: () => request('/admin/bookings'),
    adminUpdateBookingStatus: (id: string, status: string) =>
        request(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    adminDeleteBooking: (id: string) => request(`/admin/bookings/${id}`, { method: 'DELETE' }),

    adminInquiries: () => request('/admin/inquiries'),
    adminUpdateInquiryStatus: (id: string, status: string) =>
        request(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    adminDeleteInquiry: (id: string) => request(`/admin/inquiries/${id}`, { method: 'DELETE' }),

    // ---- Public content (Tours, Fleet, Activities) ----
    getPackages: () => request('/content/packages'),
    getVehicles: () => request('/content/vehicles'),
    getActivities: () => request('/content/activities'),

    // ---- Admin: Tours (Packages) ----
    adminCreatePackage: (payload: Record<string, any>) =>
        request('/admin/packages', { method: 'POST', body: JSON.stringify(payload) }),
    adminUpdatePackage: (id: string, payload: Record<string, any>) =>
        request(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    adminDeletePackage: (id: string) => request(`/admin/packages/${id}`, { method: 'DELETE' }),

    // ---- Admin: Fleet (Vehicles) ----
    adminCreateVehicle: (payload: Record<string, any>) =>
        request('/admin/vehicles', { method: 'POST', body: JSON.stringify(payload) }),
    adminUpdateVehicle: (id: string, payload: Record<string, any>) =>
        request(`/admin/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    adminDeleteVehicle: (id: string) => request(`/admin/vehicles/${id}`, { method: 'DELETE' }),

    // ---- Admin: Activities ----
    adminCreateActivity: (payload: Record<string, any>) =>
        request('/admin/activities', { method: 'POST', body: JSON.stringify(payload) }),
    adminUpdateActivity: (id: string, payload: Record<string, any>) =>
        request(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    adminDeleteActivity: (id: string) => request(`/admin/activities/${id}`, { method: 'DELETE' }),
};

export { ApiError };
