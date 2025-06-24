import { SearchFilter } from "./components/SearchFilter";
import { EventList } from "./components/EventList";
import { PageTitle } from "./components/PageTitle";
import {
  RoomingListProvider,
  useRoomingList,
} from "./contexts/RoomingListContext";

function App() {
  const { filteredEventsData, loading, error, appliedSearchText } =
    useRoomingList();

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
        {filteredEventsData.map((event) => (
          <EventList
            key={event.id}
            eventName={event.name}
            roomingLists={event.roomingLists}
          />
        ))}
        {filteredEventsData.length === 0 && appliedSearchText !== "" && (
          <div className="p-8 text-center text-brand-black bg-brand-white rounded-lg shadow-md">
            <p>No results found for your search.</p>
          </div>
        )}
        {filteredEventsData.length === 0 &&
          appliedSearchText === "" &&
          !loading && (
            <div className="p-8 text-center text-brand-black bg-brand-white rounded-lg shadow-md">
              <p>No events found or loaded.</p>
            </div>
          )}
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <RoomingListProvider>
    <App />
  </RoomingListProvider>
);

export default AppWrapper;
