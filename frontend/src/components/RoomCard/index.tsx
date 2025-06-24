import { Calendar, FileCheck2 } from "lucide-react";
import type { RoomingListItem } from "../../types";
import { findStartDate, findEndDate } from "../../utils/dateUtils";
import { CutOffBadge } from "./CutOffBadge";

export interface RoomItemProps {
  roomingListItem: RoomingListItem;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const RoomCard = ({ roomingListItem }: RoomItemProps) => {
  const { roomingListId, rfpName, cutOffDate, bookings, agreement_type } =
    roomingListItem;
  const numberOfBookings = bookings ? bookings.length : 0;

  const startDate = findStartDate(bookings);
  const endDate = findEndDate(bookings);

  const handleViewBookingsClick = async () => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in your .env file.");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/rooming-lists/${roomingListId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: RoomingListItem = await response.json();
      console.log(`${rfpName}:`, data.bookings);
    } catch (error) {
      console.error(
        `Failed to fetch bookings for rooming list ${rfpName}:`,
        error
      );
    }
  };

  return (
    <div
      className={`w-full md:w-[calc((100%-2rem)/3)] p-4 bg-brand-white rounded-lg border border-brand-gray flex flex-col justify-between mb-4 flex-shrink-0`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-brand-black mb-1">
            {rfpName}
          </h3>
          <p className="text-sm text-brand-black">
            Agreement:{" "}
            <span className="font-bold">
              {agreement_type.charAt(0).toUpperCase() + agreement_type.slice(1)}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Calendar width={12} />
            <p className="text-sm text-brand-black">
              {startDate} - {endDate}
            </p>
          </div>
        </div>

        <CutOffBadge cutOffDate={cutOffDate} />
      </div>

      <div className="flex items-center mt-auto gap-2">
        <button
          className="px-4 py-2 bg-brand-purple-medium-dark text-white rounded-md hover:bg-opacity-90 transition duration-300"
          onClick={handleViewBookingsClick}
        >
          View Bookings ({numberOfBookings})
        </button>
        <div className="relative group">
          <button className="p-2 bg-brand-white text-brand-purple-medium-dark border border-brand-purple-medium-dark rounded-md hover:bg-brand-purple-medium-dark hover:text-white transition duration-300 flex items-center justify-center">
            <FileCheck2 />
          </button>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-brand-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
            Show Agreement as PDF
          </span>
        </div>
      </div>
    </div>
  );
};
