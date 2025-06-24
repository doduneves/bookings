import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EventData } from "../types";
import { useEventsData } from "./EventsDataContext";

interface RoomingListUIContextType {
  searchText: string;
  setSearchText: (text: string) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
  appliedSearchText: string;
  handleSearchSubmit: () => void;
  sortOrder: "asc" | "desc" | "none";
  setSortOrder: (order: "asc" | "desc" | "none") => void;
  filteredEventsData: EventData[];
}

const RoomingListUIContext = createContext<RoomingListUIContextType | undefined>(
  undefined
);

export const useRoomingListUI = () => {
  const context = useContext(RoomingListUIContext);
  if (!context) {
    throw new Error("useRoomingListUI must be used within RoomingListUIProvider");
  }
  return context;
};

export const RoomingListUIProvider = ({ children }: { children: ReactNode }) => {
  const { eventsData } = useEventsData();

  const [searchText, setSearchText] = useState("");
  const [appliedSearchText, setAppliedSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [appliedFilterOption, setAppliedFilterOption] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

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

  const handleSearchSubmit = () => {
    setAppliedSearchText(searchText);
    setAppliedFilterOption(filterOption);
  };

  const filteredEventsData = useMemo(() => {
    let result = eventsData;

    if (appliedSearchText) {
      result = result
        .map((event) => {
          const filteredLists = event.roomingLists.filter((list) => {
            return (
              event.name.toLowerCase().includes(appliedSearchText.toLowerCase()) ||
              list.rfpName.toLowerCase().includes(appliedSearchText.toLowerCase()) ||
              list.agreement_type.toLowerCase().includes(appliedSearchText.toLowerCase())
            );
          });
          return { ...event, roomingLists: filteredLists };
        })
        .filter((event) => event.roomingLists.length > 0);
    }

    if (appliedFilterOption) {
      const targetStatus = mapFilterToStatus(appliedFilterOption);
      if (targetStatus) {
        result = result
          .map((event) => {
            const filteredLists = event.roomingLists.filter(
              (list) => list.status.toLowerCase() === targetStatus
            );
            return { ...event, roomingLists: filteredLists };
          })
          .filter((event) => event.roomingLists.length > 0);
      }
    }

    if (sortOrder !== "none") {
      result = result.map((event) => {
        const sorted = [...event.roomingLists].sort((a, b) => {
          const dateA = new Date(a.cutOffDate).getTime();
          const dateB = new Date(b.cutOffDate).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        return { ...event, roomingLists: sorted };
      });
    }

    return result;
  }, [eventsData, appliedSearchText, appliedFilterOption, sortOrder]);

  return (
    <RoomingListUIContext.Provider
      value={{
        searchText,
        setSearchText,
        filterOption,
        setFilterOption,
        appliedSearchText,
        handleSearchSubmit,
        sortOrder,
        setSortOrder,
        filteredEventsData,
      }}
    >
      {children}
    </RoomingListUIContext.Provider>
  );
};
