import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ScheduleItem, PackingItem, Expense } from '../types';
import { useAuth } from './AuthContext';

interface TripContextType {
    isSetup: boolean;
    tripTitle: string;
    tripDate: Date | null;
    tripImage: string | null;
    members: string[]; // List of names
    schedule: ScheduleItem[];
    checkList: PackingItem[];
    checkListTabs: string[];
    expenses: Expense[];
    tripDuration: number;
    setTripInfo: (title: string, members: string[], date: Date | null, image?: string | null) => void;
    setSchedule: (items: ScheduleItem[]) => void;
    setCheckList: (items: PackingItem[]) => void;
    setCheckListTabs: (tabs: string[]) => void;
    setExpenses: (items: Expense[]) => void;
    setTripDuration: (days: number) => void;
    joinTrip: (tripId: string) => Promise<void>;
    resetTrip: () => void;
    tripId: string | null;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// Fallback for non-logged in users (demo mode)
const DEMO_TRIP_ID = "demo-trip";

export function TripProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [isSetup, setIsSetup] = useState(false);
    const [tripTitle, setTripTitle] = useState('');
    const [tripDate, setTripDate] = useState<Date | null>(null);
    const [tripImage, setTripImage] = useState<string | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [schedule, setScheduleState] = useState<ScheduleItem[]>([]);
    const [checkList, setCheckListState] = useState<PackingItem[]>([]);
    const [checkListTabs, setCheckListTabsState] = useState<string[]>([]);
    const [expenses, setExpensesState] = useState<Expense[]>([]);
    const [tripDuration, setTripDurationState] = useState(2); // Default to 2 days

    // The current active trip ID
    const [activeTripId, setActiveTripId] = useState<string | null>(null);

    // 1. Listen for User's Active Trip ID
    useEffect(() => {
        if (!user) {
            setActiveTripId(DEMO_TRIP_ID);
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().activeTripId) {
                setActiveTripId(docSnap.data().activeTripId);
            } else {
                // User has no trip yet or activeTripId is null
                setActiveTripId(null);
                setIsSetup(false);
                // Clear local state if no active trip
                setTripTitle('');
                setMembers([]);
                setTripDate(null);
                setTripImage(null);
                setScheduleState([]);
                setCheckListState([]);
                setCheckListTabsState([]);
                setExpensesState([]);
                setTripDurationState(2);
            }
        }, (error) => {
            console.error("Error fetching user's active trip ID:", error);
        });
        return () => unsubscribe();
    }, [user]);

    // 2. Listen for Trip Data based on Active ID
    useEffect(() => {
        if (!activeTripId) {
            // If no active trip ID, ensure state is reset
            setIsSetup(false);
            setTripTitle('');
            setMembers([]);
            setTripDate(null);
            setTripImage(null);
            setScheduleState([]);
            setCheckListState([]);
            setCheckListTabsState([]);
            setExpensesState([]);
            setTripDurationState(2);
            return;
        }

        const tripRef = doc(db, "trips", activeTripId);
        const unsubscribe = onSnapshot(tripRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTripTitle(data.title || '');
                setMembers(data.members || []);
                if (data.date) {
                    setTripDate(new Date(data.date));
                }
                setTripImage(data.image || null);
                setScheduleState(data.schedule || []);
                setTripDurationState(data.duration || 2);
                setCheckListState(data.checkList || []);
                setCheckListTabsState(data.checkListTabs || []);

                // Handle expense dates correctly (convert string/timestamp to Date)
                const loadedExpenses = (data.expenses || []).map((e: any) => ({
                    ...e,
                    date: e.date && typeof e.date.toDate === 'function' ? e.date.toDate() : new Date(e.date || Date.now())
                }));
                setExpensesState(loadedExpenses);

                setIsSetup(true);
            } else {
                // Trip document does not exist for the activeTripId
                setIsSetup(false);
                setTripTitle('');
                setMembers([]);
                setTripDate(null);
                setTripImage(null);
                setScheduleState([]);
                setCheckListState([]);
                setCheckListTabsState([]);
                setExpensesState([]);
                setTripDurationState(2);
                if (user && activeTripId !== DEMO_TRIP_ID) {
                    setDoc(doc(db, "users", user.uid), { activeTripId: null }, { merge: true })
                        .catch(e => console.error("Error clearing invalid activeTripId:", e));
                }
            }
        }, (error) => {
            console.error("Error fetching trip:", error);
            setIsSetup(false);
        });

        return () => unsubscribe();
    }, [activeTripId, user]);

    const saveTripData = async (updates: Partial<any>) => {
        if (!activeTripId) {
            console.warn("Attempted to save trip data without an activeTripId.");
            return;
        }

        const targetId = activeTripId;

        const currentData = {
            title: tripTitle,
            members,
            date: tripDate?.toISOString() || null,
            image: tripImage,
            schedule,
            duration: tripDuration,
            checkList,
            checkListTabs,
            expenses,
            id: targetId,
            ...updates
        };

        try {
            await setDoc(doc(db, "trips", targetId), currentData, { merge: true });
        } catch (e) {
            console.error("Error saving trip to Firestore", e);
        }
    };

    const joinTrip = async (tripId: string) => {
        if (!user) {
            console.warn("Cannot join trip: User not authenticated.");
            throw new Error("User not authenticated.");
        }
        try {
            // Verify trip exists
            const tripDoc = doc(db, "trips", tripId);
            const tripSnap = await getDoc(tripDoc);
            if (!tripSnap.exists()) {
                throw new Error("Trip does not exist.");
            }

            // Set user's active trip
            await setDoc(doc(db, "users", user.uid), { activeTripId: tripId }, { merge: true });
        } catch (error) {
            console.error("Error joining trip:", error);
            throw error;
        }
    };

    const setTripInfo = async (title: string, newMembers: string[], date: Date | null, image?: string | null) => {
        setTripTitle(title);
        setMembers(newMembers);
        setTripDate(date);
        if (image !== undefined) setTripImage(image);
        setIsSetup(true);

        const updates = {
            title,
            members: newMembers,
            date: date?.toISOString() || null,
            ...(image !== undefined ? { image } : {})
        };

        if (user) {
            let targetId = activeTripId;
            if (!targetId) {
                targetId = generateTripId();

                await setDoc(doc(db, "trips", targetId), {
                    ...updates,
                    id: targetId,
                    schedule,
                    duration: tripDuration,
                    checkList,
                    checkListTabs,
                    expenses
                }, { merge: true });

                await setDoc(doc(db, "users", user.uid), { activeTripId: targetId }, { merge: true });
            } else {
                await setDoc(doc(db, "trips", targetId), {
                    ...updates,
                    id: targetId,
                    schedule,
                    duration: tripDuration,
                    checkList,
                    checkListTabs,
                    expenses
                }, { merge: true });
            }
        } else {
            saveTripData(updates);
        }
    };

    const generateTripId = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const setSchedule = (items: ScheduleItem[]) => {
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

    const setExpenses = (items: Expense[]) => {
        setExpensesState(items);
        saveTripData({ expenses: items });
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
        setTripImage(null);
        setScheduleState([]);
        setCheckListState([]);
        setCheckListTabsState([]);
        setExpensesState([]);
        setTripDurationState(2);

        if (user) {
            await setDoc(doc(db, "users", user.uid), { activeTripId: null }, { merge: true });
        } else {
            try {
                await setDoc(doc(db, "trips", DEMO_TRIP_ID), {
                    title: '', members: [], date: null, image: null, schedule: [], duration: 2, checkList: [], checkListTabs: [], expenses: []
                });
            } catch (e) {
                console.error("Error resetting demo trip", e);
            }
        }
    };

    return (
        <TripContext.Provider value={{
            isSetup, tripTitle, tripDate, tripImage, members, schedule, checkList, checkListTabs, expenses, tripDuration,
            setTripInfo, setSchedule, setCheckList, setCheckListTabs, setExpenses, setTripDuration, resetTrip, joinTrip, tripId: activeTripId
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
