import { useRoomingList } from "../contexts/RoomingListContext";

export const SearchFilter = () => {
  const {
    searchText,
    setSearchText,
    filterOption,
    setFilterOption,
    handleSearchSubmit,
  } = useRoomingList();

  return (
    <div className="px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-8">
      <input
        type="text"
        placeholder="Search for rooms..."
        className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-medium text-brand-black bg-brand-white"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <select
        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-medium text-brand-black"
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Closed">Closed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        className="px-6 py-2 bg-brand-purple-medium-dark text-white rounded-md hover:bg-opacity-90 transition duration-300 shadow-lg"
        onClick={handleSearchSubmit}
      >
        Search
      </button>
    </div>
  );
};
