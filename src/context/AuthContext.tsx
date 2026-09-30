import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getStoredUser, setSession, clearSession, getToken } from '../lib/api';

interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: 'customer' | 'admin';
    phone?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthUser>;
    register: (fullName: string, email: string, password: string) => Promise<AuthUser>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Revalidate the stored session against the backend on load.
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        api.me()
            .then((res) => setUser(res.user))
            .catch(() => {
                clearSession();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.login(email, password);
        setSession(res.token, res.user);
        setUser(res.user);
        return res.user as AuthUser;
    };

    const register = async (fullName: string, email: string, password: string) => {
        const res = await api.register(fullName, email, password);
        setSession(res.token, res.user);
        setUser(res.user);
        return res.user as AuthUser;
    };

    const logout = () => {
        clearSession();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
