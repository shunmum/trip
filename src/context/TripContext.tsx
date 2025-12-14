import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface TripContextType {
    isSetup: boolean;
    tripTitle: string;
    members: string[]; // List of names
    setTripInfo: (title: string, members: string[]) => void;
    resetTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
    const [isSetup, setIsSetup] = useState(false);
    const [tripTitle, setTripTitle] = useState('');
    const [members, setMembers] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedTrip = localStorage.getItem('futari-tabi-trip');
        if (savedTrip) {
            try {
                const parsed = JSON.parse(savedTrip);
                setTripTitle(parsed.title);
                setMembers(parsed.members);
                setIsSetup(true);
            } catch (e) {
                console.error("Failed to parse saved trip", e);
            }
        }
    }, []);

    const setTripInfo = (title: string, newMembers: string[]) => {
        setTripTitle(title);
        setMembers(newMembers);
        setIsSetup(true);
        localStorage.setItem('futari-tabi-trip', JSON.stringify({ title, members: newMembers }));
    };

    const resetTrip = () => {
        setIsSetup(false);
        setTripTitle('');
        setMembers([]);
        localStorage.removeItem('futari-tabi-trip');
    };

    return (
        <TripContext.Provider value={{ isSetup, tripTitle, members, setTripInfo, resetTrip }}>
            {children}
        </TripContext.Provider>
    );
}

export function useTrip() {
    const context = useContext(TripContext);
    if (context === undefined) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
}
