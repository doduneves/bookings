import { useEffect, useState } from "react";
import { SearchFilter } from "./components/SearchFilter";
import { EventList } from "./components/EventList";
import type { EventData, RoomingListItem } from "./components/RoomCard";
import { PageTitle } from "./components/PageTitle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mocked for now as soon we have only this two events and not the Name info on DB
const EVENTS = [
  { eventId: 1, eventName: "Rolling Loud" },
  { eventId: 2, eventName: "Ultra Miami" },
];

function App() {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllEventsData = async () => {
      setLoading(true);
      setError(null);
      const fetchedEvents: EventData[] = [];

      if (!API_BASE_URL) {
        setError("API URL is not defined");
        setLoading(false);
        return;
      }

      for (const eventConfig of EVENTS) {
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-blue-light p-8 font-sans antialiased flex flex-col items-center justify-center text-brand-black">
        <p>Loading rooming lists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-blue-light p-8 font-sans antialiased flex flex-col items-center justify-center text-brand-red">
        <p>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-8 font-sans antialiased flex flex-col items-center">
      <div className="w-full mx-auto">
        <PageTitle title="Rooming List Management" />
        <SearchFilter />
        {eventsData.map((event) => (
          <EventList
            key={event.id}
            eventName={event.name}
            roomingLists={event.roomingLists}
          />
        ))}
        {eventsData.length === 0 && (
          <div className="p-8 text-center text-brand-black bg-brand-white rounded-lg shadow-md">
            <p>No events found or loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
