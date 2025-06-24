import { formatDay, formatMonth } from "../../utils/dateUtils";

export const CutOffBadge = ({ cutOffDate }: { cutOffDate: string }) => {
  return (
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
  );
};
