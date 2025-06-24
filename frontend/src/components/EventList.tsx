import type { RoomingListItem } from "../types";
import { RoomingLists } from "./RoomingLists";

interface EventRoomListProps {
  eventName: string;
  roomingLists: RoomingListItem[];
}

export const EventList = ({ eventName, roomingLists }: EventRoomListProps) => {
  return (
    <div className="my-16">
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow border-t-2 border-brand-green-success mx-4"></div>
        <div className="p-2 border border-brand-green-success rounded-lg text-brand-green-success font-extrabold text-md bg-brand-green-light shadow-sm">
          {eventName}
        </div>
        <div className="flex-grow border-t-2 border-brand-green-success mx-4"></div>
      </div>
      <RoomingLists roomingLists={roomingLists} />
    </div>
  );
};
