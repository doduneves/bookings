import { AlertTriangle } from "lucide-react";
import { useEventsData } from "../contexts/EventsDataContext";

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  const { runSeedData } = useEventsData();
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-4xl font-bold text-left text-brand-black mb-2">
        {title}
      </h1>
      <button
        onClick={runSeedData}
        className="flex gap-2 p-2 text-brand-white rounded-md hover:bg-opacity-80 bg-red-700 transition duration-300 text-md font-extrabold"
      >
        <AlertTriangle width={20}/>
        Run Seed Data
      </button>
    </div>
  );
};
