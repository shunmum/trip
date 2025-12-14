import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ScheduleItem, PackingItem } from '../types';

interface TripContextType {
    isSetup: boolean;
    tripTitle: string;
    tripDate: Date | null;
    members: string[]; // List of names
    schedule: ScheduleItem[];
    checkList: PackingItem[];
    checkListTabs: string[];
    tripDuration: number;
    setTripInfo: (title: string, members: string[], date: Date | null) => void;
    setSchedule: (items: ScheduleItem[]) => void;
    setCheckList: (items: PackingItem[]) => void;
    setCheckListTabs: (tabs: string[]) => void;
    setTripDuration: (days: number) => void;
    resetTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// Hardcoded ID for shared demo purposes
const TRIP_ID = "shared-trip";

export function TripProvider({ children }: { children: ReactNode }) {
    const [isSetup, setIsSetup] = useState(false);
    const [tripTitle, setTripTitle] = useState('');
    const [tripDate, setTripDate] = useState<Date | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [schedule, setScheduleState] = useState<ScheduleItem[]>([]);
    const [checkList, setCheckListState] = useState<PackingItem[]>([]);
    const [checkListTabs, setCheckListTabsState] = useState<string[]>([]);
    const [tripDuration, setTripDurationState] = useState(2); // Default to 2 days

    // Load from Firestore on mount
    useEffect(() => {
        const tripRef = doc(db, "trips", TRIP_ID);
        const unsubscribe = onSnapshot(tripRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTripTitle(data.title || '');
                setMembers(data.members || []);
                if (data.date) {
                    setTripDate(new Date(data.date));
                }
                setScheduleState(data.schedule || []);
                setTripDurationState(data.duration || 2);
                setCheckListState(data.checkList || []);
                setCheckListTabsState(data.checkListTabs || []);
                setIsSetup(true);
            } else {
                // optional: handle case where trip doesn't exist yet (stay in setup mode)
                setIsSetup(false);
            }
        }, (error) => {
            console.error("Error fetching trip:", error);
        });

        return () => unsubscribe();
    }, []);

    const saveTripData = async (updates: Partial<any>) => {
        const currentData = {
            title: tripTitle,
            members,
            date: tripDate?.toISOString() || null,
            schedule,
            duration: tripDuration,
            checkList,
            checkListTabs,
            ...updates
        };

        try {
            await setDoc(doc(db, "trips", TRIP_ID), currentData, { merge: true });
        } catch (e) {
            console.error("Error saving trip to Firestore", e);
        }
    };

    const setTripInfo = (title: string, newMembers: string[], date: Date | null) => {
        setTripTitle(title);
        setMembers(newMembers);
        setTripDate(date);
        setIsSetup(true);
        saveTripData({ title, members: newMembers, date: date?.toISOString() || null });
    };

    const setSchedule = (items: ScheduleItem[]) => {
        // Optimistic update
        setScheduleState(items);
        saveTripData({ schedule: items });
    };

    const setCheckList = (items: PackingItem[]) => {
        setCheckListState(items);
        saveTripData({ checkList: items });
    };

    const setCheckListTabs = (tabs: string[]) => {
        setCheckListTabsState(tabs);
        saveTripData({ checkListTabs: tabs });
    };

    const setTripDuration = (days: number) => {
        setTripDurationState(days);
        saveTripData({ duration: days });
    };

    const resetTrip = async () => {
        setIsSetup(false);
        setTripTitle('');
        setMembers([]);
        setTripDate(null);
        setScheduleState([]);
        setCheckListState([]);
        setCheckListTabsState([]);
        setTripDurationState(2);
        // In Firestore, we might want to delete the doc or clear fields
        try {
            await setDoc(doc(db, "trips", TRIP_ID), {
                title: '', members: [], date: null, schedule: [], duration: 2, checkList: [], checkListTabs: []
            });
        } catch (e) {
            console.error("Error resetting trip", e);
        }
    };

    return (
        <TripContext.Provider value={{
            isSetup, tripTitle, tripDate, members, schedule, checkList, checkListTabs, tripDuration,
            setTripInfo, setSchedule, setCheckList, setCheckListTabs, setTripDuration, resetTrip
        }}>
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
