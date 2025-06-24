export interface BookingItem {
  bookingId: string;
  hotelId: number;
  eventId: number;
  guestName: string;
  guestPhoneNumber: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomingListItem {
  roomingListId: string;
  eventId: number;
  hotelId: number;
  rfpName: string;
  cutOffDate: string;
  status: string;
  agreement_type: string;
  createdAt: string;
  updatedAt: string;
  bookings: BookingItem[];
}

export interface EventData {
  id: number;
  name: string;
  roomingLists: RoomingListItem[];
}

export interface RoomItemProps {
  roomingListItem: RoomingListItem;
}

export const RoomCard = ({ roomingListItem }: RoomItemProps) => {
  const { rfpName, status, cutOffDate, bookings, agreement_type } =
    roomingListItem;
  const numberOfBookings = bookings ? bookings.length : 0;

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonth = (dateString: string): string => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", { month: "short" });
  };

  const formatDay = (dateString: string): string => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", { day: "numeric" });
  };

  const findStartDate = (bookings: BookingItem[]): string => {
    if (!bookings || bookings.length === 0) {
      return "N/A";
    }
    let earliestDate = new Date(bookings[0].checkInDate);
    for (let i = 1; i < bookings.length; i++) {
      const currentDate = new Date(bookings[i].checkInDate);
      if (currentDate < earliestDate) {
        earliestDate = currentDate;
      }
    }
    return formatDate(earliestDate.toISOString().split("T")[0]);
  };

  const findEndDate = (bookings: BookingItem[]): string => {
    if (!bookings || bookings.length === 0) {
      return "N/A";
    }
    let latestDate = new Date(bookings[0].checkOutDate);
    for (let i = 1; i < bookings.length; i++) {
      const currentDate = new Date(bookings[i].checkOutDate);
      if (currentDate > latestDate) {
        latestDate = currentDate;
      }
    }
    return formatDate(latestDate.toISOString().split("T")[0]);
  };

  const startDate = findStartDate(bookings);
  const endDate = findEndDate(bookings);

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
          <p className="text-sm text-brand-black">
            {startDate} - {endDate}
          </p>
        </div>

        <div className="flex flex-col items-center text-brand-black">
          <div className="bg-brand-blue-light rounded-lg p-2 text-center w-16 h-16 flex flex-col justify-center items-center">
            <div className="text-sm font-semibold leading-none">
              {formatMonth(cutOffDate)}
            </div>
            <div className="text-3xl font-bold leading-none">
              {formatDay(cutOffDate)}
            </div>
          </div>
          <p className="text-sm mt-1">Cut-Off Date</p>
        </div>
      </div>

      <div className="flex items-center mt-auto gap-2">
        <button className="px-4 py-2 bg-brand-purple-medium-dark text-white rounded-md hover:bg-opacity-90 transition duration-300">
          View Bookings ({numberOfBookings})
        </button>
        <button className="p-2 bg-brand-white text-brand-purple-medium-dark border border-brand-purple-medium-dark rounded-md hover:bg-brand-purple-medium-dark hover:text-white transition duration-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
