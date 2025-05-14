import { BookingStatus } from "../types/booking.types";

type BookingLegendStatusProps = {
  statusColors: Record<BookingStatus, string>;
};

export const BookingLegendStatus = (props: BookingLegendStatusProps) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Legend</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(props.statusColors).map(([status, color], idx) => (
          <div key={`${status}-${idx}`} className="flex items-center">
            <div
              className="h-4 w-4 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm text-gray-600 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
