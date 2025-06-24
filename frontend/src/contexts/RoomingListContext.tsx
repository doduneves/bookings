import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  type ReactNode,
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

  const eventsToDisplay = useMemo(() => EVENTS, []);

  useEffect(() => {
    const fetchAllEventsData = async () => {
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
    };

    fetchAllEventsData();
  }, [eventsToDisplay]);

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

    return currentFilteredEvents;
  }, [eventsData, appliedSearchText, appliedFilterOption]);

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
    ]
  );

  return (
    <RoomingListContext.Provider value={contextValue}>
      {children}
    </RoomingListContext.Provider>
  );
};
