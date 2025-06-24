import type { BookingItem } from "../types";

export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatMonth = (dateString: string): string => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short" });
};

export const formatDay = (dateString: string): string => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "numeric" });
};

export const findStartDate = (bookings: BookingItem[]): string => {
  if (!bookings?.length) return "N/A";
  const earliest = bookings.reduce((min, curr) =>
    new Date(curr.checkInDate) < new Date(min.checkInDate) ? curr : min
  );
  return formatDate(earliest.checkInDate);
};

export const findEndDate = (bookings: BookingItem[]): string => {
  if (!bookings?.length) return "N/A";
  const latest = bookings.reduce((max, curr) =>
    new Date(curr.checkOutDate) > new Date(max.checkOutDate) ? curr : max
  );
  return formatDate(latest.checkOutDate);
};
