import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  useCallback,
} from "react";
import type { RoomingListItem, EventData } from "../types";

interface RoomingListContextType {
  filteredEventsData: EventData[];
  loading: boolean;
  error: string | null;
  searchText: string;
  setSearchText: (text: string) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
  handleSearchSubmit: () => void;
  appliedSearchText: string;
  sortOrder: "asc" | "desc" | "none";
  setSortOrder: (order: "asc" | "desc" | "none") => void;
  runSeedData: () => Promise<void>;
}

const RoomingListContext = createContext<RoomingListContextType | undefined>(
  undefined
);

export const useRoomingList = () => {
  const context = useContext(RoomingListContext);
  if (context === undefined) {
    throw new Error("useRoomingList must be used within a RoomingListProvider");
  }
  return context;
};

interface RoomingListProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EVENTS = [
  { eventId: 1, eventName: "Rolling Loud" },
  { eventId: 2, eventName: "Ultra Miami" },
];

export const RoomingListProvider = ({ children }: RoomingListProviderProps) => {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState("");
  const [appliedFilterOption, setAppliedFilterOption] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const eventsToDisplay = useMemo(() => EVENTS, []);

  const fetchAllEventsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const fetchedEvents: EventData[] = [];

    if (!API_BASE_URL) {
      setError(
        "VITE_API_BASE_URL is not defined in your .env file in the /frontend directory."
      );
      setLoading(false);
      return;
    }

    for (const eventConfig of eventsToDisplay) {
      const { eventId, eventName } = eventConfig;
      try {
        const response = await fetch(
          `${API_BASE_URL}/rooming-lists?eventId=${eventId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData: { items: RoomingListItem[] } =
          await response.json();
        const data: RoomingListItem[] = responseData.items;

        fetchedEvents.push({
          id: eventId,
          name: eventName,
          roomingLists: data,
        });
      } catch (e) {
        console.error(
          `Failed to fetch rooming lists for eventId ${eventId}:`,
          e
        );
        setError(`Failed to load data for Event ID ${eventId}.`);
        fetchedEvents.push({
          id: eventId,
          name: `${eventName} (Failed to Load)`,
          roomingLists: [],
        });
      }
    }
    setEventsData(fetchedEvents);
    setLoading(false);
  }, [eventsToDisplay]);

  useEffect(() => {
    fetchAllEventsData();
  }, [eventsToDisplay, fetchAllEventsData]);


  const runSeedData = useCallback(async () => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined for seeding.');
      alert('Error: API Base URL is not configured for seeding data.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/seeds/run-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Seed API error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Seed data ran successfully:', result);
      alert('Seed data generated successfully! Refreshing data...');
      fetchAllEventsData(); 
    } catch (e) {
      console.error('Error running seed data:', e);
      alert(`Failed to run seed data: ${e.message}. Please check your backend.`); 
      setLoading(false);
    }
  }, [fetchAllEventsData]);

  const mapFilterToStatus = (filter: string): string | null => {
    switch (filter.toLowerCase()) {
      case "active":
        return "received";
      case "closed":
        return "completed";
      case "cancelled":
        return "archived";
      default:
        return null;
    }
  };

  const filteredEventsData = useMemo(() => {
    let currentFilteredEvents = eventsData;

    if (appliedSearchText) {
      currentFilteredEvents = currentFilteredEvents
        .map((event) => {
          const filteredRoomingLists = event.roomingLists.filter(
            (roomingList) => {
              const matchesEventName = event.name
                .toLowerCase()
                .includes(appliedSearchText.toLowerCase());

              const matchesRfpName = roomingList.rfpName
                .toLowerCase()
                .includes(appliedSearchText.toLowerCase());

              const matchesAgreementType = roomingList.agreement_type
                .toLowerCase()
                .includes(appliedSearchText.toLowerCase());

              return matchesEventName || matchesRfpName || matchesAgreementType;
            }
          );
          return { ...event, roomingLists: filteredRoomingLists };
        })
        .filter((event) => event.roomingLists.length > 0);
    }

    if (appliedFilterOption) {
      const targetStatus = mapFilterToStatus(appliedFilterOption);
      if (targetStatus) {
        currentFilteredEvents = currentFilteredEvents
          .map((event) => {
            const filteredRoomingLists = event.roomingLists.filter(
              (roomingList) => {
                return roomingList.status.toLowerCase() === targetStatus;
              }
            );
            return { ...event, roomingLists: filteredRoomingLists };
          })
          .filter((event) => event.roomingLists.length > 0);
      }
    }

    if (sortOrder !== "none") {
      currentFilteredEvents = currentFilteredEvents.map((event) => {
        const sortedRoomingLists = [...event.roomingLists].sort((a, b) => {
          const dateA = new Date(a.cutOffDate).getTime();
          const dateB = new Date(b.cutOffDate).getTime();

          if (sortOrder === "asc") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        });
        return { ...event, roomingLists: sortedRoomingLists };
      });
    }

    return currentFilteredEvents;
  }, [eventsData, appliedSearchText, appliedFilterOption, sortOrder]);

  const handleSearchSubmit = () => {
    setAppliedSearchText(searchText);
    setAppliedFilterOption(filterOption);
  };

  const contextValue = useMemo(
    () => ({
      filteredEventsData,
      loading,
      error,
      searchText,
      setSearchText,
      filterOption,
      setFilterOption,
      handleSearchSubmit,
      appliedSearchText,
      sortOrder,
      setSortOrder,
      runSeedData,
    }),
    [
      filteredEventsData,
      loading,
      error,
      searchText,
      setSearchText,
      filterOption,
      setFilterOption,
      handleSearchSubmit,
      appliedSearchText,
      sortOrder,
      setSortOrder,
      runSeedData,
    ]
  );

  return (
    <RoomingListContext.Provider value={contextValue}>
      {children}
    </RoomingListContext.Provider>
  );
};
