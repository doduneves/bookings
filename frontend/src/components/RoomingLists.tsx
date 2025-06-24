import { RoomCard, type RoomingListItem } from "./RoomCard";

export interface RoomingListsProps {
  roomingLists: RoomingListItem[];
}

export const RoomingLists = ({ roomingLists }: RoomingListsProps) => {
  if (roomingLists.length === 0) {
    return (
      <div className="p-8 text-center text-brand-black bg-brand-white rounded-lg shadow-md">
        <p>
          No rooming lists found for this event. Try adjusting your search or
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:flex-nowrap md:justify-start gap-4 md:overflow-x-auto pb-4">
      {roomingLists.map((item) => (
        <RoomCard key={item.roomingListId} roomingListItem={item} />
      ))}
    </div>
  );
};
