import { EventsDataProvider } from "./EventsDataContext";
import { type ReactNode } from "react";
import { RoomingListUIProvider } from "./RoomingListUIContext";

export const RoomingListProvider = ({ children }: { children: ReactNode }) => {
  return (
    <EventsDataProvider>
      <RoomingListUIProvider>{children}</RoomingListUIProvider>
    </EventsDataProvider>
  );
};
