import { SearchIcon } from "lucide-react";
import { useRoomingListUI } from "../contexts/RoomingListUIContext";

export const SearchFilter = () => {
  const {
    searchText,
    setSearchText,
    filterOption,
    setFilterOption,
    handleSearchSubmit,
    setSortOrder,
    sortOrder,
  } = useRoomingListUI();

  return (
    <div className="p-4 rounded-lg flex flex-col space-y-4 md:mb-8 md:flex-row md:space-y-0 md:space-x-4 md:justify-between md:items-center">
      <input
        type="text"
        placeholder="Event names, agreement types or RTP names..."
        className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-purple-medium-dark text-brand-black bg-brand-white"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 w-full md:w-auto">
        <select
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-purple-medium-dark text-brand-black w-full md:w-auto bg-brand-white"
          value={filterOption}
          onChange={(e) => {
            setFilterOption(e.target.value);
          }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          className="flex gap-2 px-6 py-2 bg-brand-purple-medium-dark text-white rounded-md hover:bg-opacity-90 transition duration-300 shadow-lg w-full md:w-auto"
          onClick={handleSearchSubmit}
        >
          <SearchIcon />
          Search
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center text-center">
        <span className="text-brand-black font-semibold whitespace-nowrap md:mr-2 mb-2 md:mb-0">
          Order By Cut-Off-Date:
        </span>
        <div className="flex space-x-2 justify-center md:justify-start">
          <button
            className={`px-4 py-2 rounded-md transition duration-300 ${
              sortOrder === "asc"
                ? "bg-brand-green-success text-white"
                : "bg-brand-white text-brand-black border border-brand-gray hover:bg-gray-100"
            }`}
            onClick={() => setSortOrder("asc")}
          >
            ASC
          </button>
          <button
            className={`px-4 py-2 rounded-md transition duration-300 ${
              sortOrder === "desc"
                ? "bg-brand-green-success text-white"
                : "bg-brand-white text-brand-black border border-brand-gray hover:bg-gray-100"
            }`}
            onClick={() => setSortOrder("desc")}
          >
            DESC
          </button>
        </div>
      </div>
    </div>
  );
};
