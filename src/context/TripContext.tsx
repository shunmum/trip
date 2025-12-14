import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

export function TripProvider({ children }: { children: ReactNode }) {
    const [isSetup, setIsSetup] = useState(false);
    const [tripTitle, setTripTitle] = useState('');
    const [tripDate, setTripDate] = useState<Date | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [schedule, setScheduleState] = useState<ScheduleItem[]>([]);
    const [checkList, setCheckListState] = useState<PackingItem[]>([]);
    const [checkListTabs, setCheckListTabsState] = useState<string[]>([]);
    const [tripDuration, setTripDurationState] = useState(2); // Default to 2 days

    // Load from localStorage on mount
    useEffect(() => {
        const savedTrip = localStorage.getItem('futari-tabi-trip');
        if (savedTrip) {
            try {
                const parsed = JSON.parse(savedTrip);
                setTripTitle(parsed.title);
                setMembers(parsed.members);
                if (parsed.date) {
                    setTripDate(new Date(parsed.date));
                }
                if (parsed.schedule) {
                    setScheduleState(parsed.schedule);
                }
                if (parsed.duration) {
                    setTripDurationState(parsed.duration);
                }
                if (parsed.checkList) {
                    setCheckListState(parsed.checkList);
                }
                if (parsed.checkListTabs) {
                    setCheckListTabsState(parsed.checkListTabs);
                }
                setIsSetup(true);
            } catch (e) {
                console.error("Failed to parse saved trip", e);
            }
        }
    }, []);

    const saveTripData = (updates: Partial<any>) => {
        const currentData = {
            title: tripTitle,
            members,
            date: tripDate?.toISOString(),
            schedule,
            duration: tripDuration,
            checkList,
            checkListTabs,
            ...updates
        };
        localStorage.setItem('futari-tabi-trip', JSON.stringify(currentData));
    };

    const setTripInfo = (title: string, newMembers: string[], date: Date | null) => {
        setTripTitle(title);
        setMembers(newMembers);
        setTripDate(date);
        setIsSetup(true);
        saveTripData({ title, members: newMembers, date: date?.toISOString() });
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

    const setTripDuration = (days: number) => {
        setTripDurationState(days);
        saveTripData({ duration: days });
    };

    const resetTrip = () => {
        setIsSetup(false);
        setTripTitle('');
        setMembers([]);
        setTripDate(null);
        setScheduleState([]);
        setCheckListState([]);
        setCheckListTabsState([]);
        setTripDurationState(2);
        localStorage.removeItem('futari-tabi-trip');
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
