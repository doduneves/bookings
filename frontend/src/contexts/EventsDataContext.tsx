import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { EventData, RoomingListItem } from "../types";

interface EventsDataContextType {
  eventsData: EventData[];
  loading: boolean;
  error: string | null;
  fetchAllEventsData: () => Promise<void>;
  runSeedData: () => Promise<void>;
}

const EventsDataContext = createContext<EventsDataContextType | undefined>(
  undefined
);

export const useEventsData = () => {
  const context = useContext(EventsDataContext);
  if (!context) {
    throw new Error("useEventsData must be used within EventsDataProvider");
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EVENTS = [
  { eventId: 1, eventName: "Rolling Loud" },
  { eventId: 2, eventName: "Ultra Miami" },
];

export const EventsDataProvider = ({ children }: { children: ReactNode }) => {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllEventsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const fetchedEvents: EventData[] = [];

    if (!API_BASE_URL) {
      setError("VITE_API_BASE_URL is not defined.");
      setLoading(false);
      return;
    }

    for (const { eventId, eventName } of EVENTS) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/rooming-lists?eventId=${eventId}`
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data: { items: RoomingListItem[] } = await response.json();
        fetchedEvents.push({
          id: eventId,
          name: eventName,
          roomingLists: data.items,
        });
      } catch (err) {
        console.error(`Error fetching eventId ${eventId}`, err);
        setError(`Failed to load data for Event ID ${eventId}`);
        fetchedEvents.push({
          id: eventId,
          name: `${eventName} (Failed to Load)`,
          roomingLists: [],
        });
      }
    }

    setEventsData(fetchedEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllEventsData();
  }, [fetchAllEventsData]);

  const runSeedData = useCallback(async () => {
    if (!API_BASE_URL) {
      alert("API Base URL is not configured.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/seeds/run-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Unknown error");
      }

      alert("Seed data generated successfully. Refreshing...");
      await fetchAllEventsData();
    } catch (e) {
      alert(`Failed to run seed data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchAllEventsData]);

  return (
    <EventsDataContext.Provider
      value={{ eventsData, loading, error, fetchAllEventsData, runSeedData }}
    >
      {children}
    </EventsDataContext.Provider>
  );
};
