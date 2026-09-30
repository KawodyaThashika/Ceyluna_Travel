import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { api } from '../lib/api';
import { TourPackage, Vehicle, Activity } from '../types';

// ---- Static fallback data (used when backend is unavailable) ----
import { tourPackages as staticPackages } from '../data/packages';
import { vehicles as staticVehicles, activities as staticActivities } from '../data/services';


interface ContentContextValue {
    packages: TourPackage[];
    vehicles: Vehicle[];
    activities: Activity[];
    loading: boolean;
    refresh: () => Promise<void>;
    getPackageById: (id: string) => TourPackage | undefined;
    getPackageBySlug: (slug: string) => TourPackage | undefined;
    getFeaturedPackages: () => TourPackage[];
    getActivitiesByDestination: (destinationId: string) => Activity[];
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const POLL_INTERVAL_MS = 12000;

export function ContentProvider({ children }: { children: ReactNode }) {
    const [packages, setPackages] = useState<TourPackage[]>(staticPackages);
    const [vehicles, setVehicles] = useState<Vehicle[]>(staticVehicles);
    const [activities, setActivities] = useState<Activity[]>(staticActivities);
    const [loading, setLoading] = useState(false);
    const hasLoadedOnce = useRef(false);

    const refresh = useCallback(async () => {
        try {
            const [pkgRes, vehRes, actRes] = await Promise.all([
                api.getPackages(),
                api.getVehicles(),
                api.getActivities(),
            ]);
            if (pkgRes.packages?.length) setPackages(pkgRes.packages);
            if (vehRes.vehicles?.length) setVehicles(vehRes.vehicles);
            if (actRes.activities?.length) setActivities(actRes.activities);
        } catch {
            // Backend unavailable — keep using static fallback data, no error shown
        } finally {
            if (!hasLoadedOnce.current) {
                hasLoadedOnce.current = true;
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, POLL_INTERVAL_MS);
        const onVisible = () => {
            if (document.visibilityState === 'visible') refresh();
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [refresh]);

    const getPackageById = (id: string) => packages.find((p) => p.id === id);
    const getPackageBySlug = (slug: string) => packages.find((p) => p.slug === slug);
    const getFeaturedPackages = () => packages.filter((p) => p.featured);
    const getActivitiesByDestination = (destinationId: string) =>
        activities.filter((a) => (a as any).destinationId === destinationId);

    return (
        <ContentContext.Provider
            value={{
                packages,
                vehicles,
                activities,
                loading,
                refresh,
                getPackageById,
                getPackageBySlug,
                getFeaturedPackages,
                getActivitiesByDestination,
            }}
        >
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const ctx = useContext(ContentContext);
    if (!ctx) throw new Error('useContent must be used within a ContentProvider');
    return ctx;
}
