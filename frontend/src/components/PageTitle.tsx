import { AlertTriangle } from "lucide-react";
import { useEventsData } from "../contexts/EventsDataContext";

interface PageTitleProps {
  title: string;
}
export const PageTitle = ({ title }: PageTitleProps) => {
  const { runSeedData } = useEventsData();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-10 p-4">
      <div className="flex justify-end sm:order-2">
        <button
          onClick={runSeedData}
          className="flex p-1 px-2 gap-x-2 text-brand-white rounded-md hover:bg-opacity-80 bg-red-700 transition duration-300 text-sm font-extrabold"
        >
          <AlertTriangle width={20} />
          <p className="py-1">Run Seed Data</p>
        </button>
      </div>

      <h1 className="text-4xl font-bold md:text-left text-brand-black mb-2 sm:mb-0 sm:order-1 text-center">
        {title}
      </h1>
    </div>
  );
};
