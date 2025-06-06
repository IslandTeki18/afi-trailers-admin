import { useState, useEffect } from "react";
import { TrailerDetailsDrawer } from "./TrailerDetailsDrawer";
import { fetchTrailers } from "../api/fetchTrailers";
import { PlusIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/Button";
import { deleteTrailer } from "../api/deleteTrailer";
import {
  Trailer,
  TrailerBookedDates,
  TrailerUsageHistory,
} from "../types/trailer.types";
import { Badge } from "../../../components/Badge";
import { TrailerCard } from "./TrailerCard";

interface TrailerListProps {
  onEditClick: (trailer: Trailer) => void;
  onAddClick: () => void;
  onBookingClick?: (trailer: Trailer, booking: TrailerBookedDates) => void;
  onAddBookingClick?: (trailer: Trailer) => void;
  onUsageHistoryClick?: (
    trailer: Trailer,
    usageHistory: TrailerUsageHistory
  ) => void;
  onAddUsageHistoryClick?: (trailer: Trailer) => void;
}

export const TrailerList: React.FC<TrailerListProps> = ({
  onEditClick,
  onAddClick,
  onBookingClick,
  onAddBookingClick,
  onUsageHistoryClick,
  onAddUsageHistoryClick,
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "bookings" | "usage">(
    "details"
  );

  // Fetch trailers data on component mount and handle refetching
  useEffect(() => {
    const fetchTrailersData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTrailers();
        setTrailers(response.data);
      } catch (error) {
        console.log("Error fetching trailers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailersData();

    const handleRefetch = () => fetchTrailersData();
    window.addEventListener("refetch-trailers", handleRefetch);

    return () => window.removeEventListener("refetch-trailers", handleRefetch);
  }, []);

  // Handle trailer view/details
  const handleTrailerView = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setIsDrawerOpen(true);
    setActiveTab("details");
  };

  // Handle trailer edit
  const handleTrailerEdit = (trailer: Trailer) => {
    if (onEditClick) {
      onEditClick(trailer);
    }
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Handle trailer delete
  const handleTrailerDelete = async (trailerId: string) => {
    try {
      await deleteTrailer(trailerId);
      setTrailers(trailers.filter((trailer) => trailer._id !== trailerId));
      window.dispatchEvent(new CustomEvent("refetch-trailers"));
    } catch (error) {
      console.log("Error deleting trailer:", error);
    }
  };

  // Render details tab for the drawer
  const renderDetailsTab = () => {
    if (!selectedTrailer) return null;

    return (
      <div className="mt-4">
        <div className="bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rental Information */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Rental Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Full Day Price
                  </p>
                  <p className="text-sm text-gray-900">
                    ${selectedTrailer.rentalPrices.fullDay.toFixed(2)}
                  </p>
                </div>
                {selectedTrailer.rentalPrices.halfDay !== undefined && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Half Day Price
                    </p>
                    <p className="text-sm text-gray-900">
                      ${selectedTrailer.rentalPrices.halfDay.toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Delivery Fee
                  </p>
                  <p className="text-sm text-gray-900">
                    ${selectedTrailer.deliveryFee.toFixed(2)}
                  </p>
                </div>
                {selectedTrailer.weekendSurcharge !== undefined && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Weekend Surcharge
                    </p>
                    <p className="text-sm text-gray-900">
                      ${selectedTrailer.weekendSurcharge.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <h4 className="text-xs font-medium text-gray-500 mt-4 mb-1">
                Service Types
              </h4>
              <div className="flex gap-2">
                {selectedTrailer.serviceTypes.includes("full") && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Full Service
                  </span>
                )}
                {selectedTrailer.serviceTypes.includes("self") && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Self Service
                  </span>
                )}
              </div>

              <h4 className="text-xs font-medium text-gray-500 mt-4 mb-1">
                Insurance
              </h4>
              <p className="text-sm text-gray-900">
                {selectedTrailer.insuranceRequired
                  ? "Required"
                  : "Not Required"}
              </p>
            </div>

            {/* Status & Location */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Status & Maintenance
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Current Status
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedTrailer.maintenanceStatus === "Operational"
                          ? "success"
                          : selectedTrailer.maintenanceStatus === "Maintenance"
                          ? "warning"
                          : "error"
                      }
                    >
                      {selectedTrailer.maintenanceStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Availability
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedTrailer.availability.isAvailable
                          ? "success"
                          : "error"
                      }
                    >
                      {selectedTrailer.availability.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Last Maintenance
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTrailer.lastMaintenanceDate
                      ? new Date(
                          selectedTrailer.lastMaintenanceDate
                        ).toLocaleDateString()
                      : "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Next Scheduled Maintenance
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTrailer.nextScheduledMaintenance
                      ? new Date(
                          selectedTrailer.nextScheduledMaintenance
                        ).toLocaleDateString()
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render bookings section for the drawer
  const renderBookingsTab = () => {
    if (!selectedTrailer) return null;

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Booked Dates</h3>
          <Button
            variant="base"
            size="small"
            onClick={() => onAddBookingClick?.(selectedTrailer)}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Booking
          </Button>
        </div>

        {selectedTrailer.bookedDates &&
        selectedTrailer.bookedDates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Range
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTrailer.bookedDates.map((booking, index) => (
                  <tr key={booking.bookingId || index}>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs capitalize">
                      {booking.serviceType}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <button
                        onClick={() =>
                          onBookingClick?.(selectedTrailer, booking)
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic py-4">
            No bookings scheduled for this trailer.
          </p>
        )}
      </div>
    );
  };

  // Render usage history section for the drawer
  const renderUsageHistoryTab = () => {
    if (!selectedTrailer) return null;

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Usage History</h3>
          <Button
            variant="base"
            size="small"
            onClick={() => onAddUsageHistoryClick?.(selectedTrailer)}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Usage Record
          </Button>
        </div>

        {selectedTrailer.usageHistory &&
        selectedTrailer.usageHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount Paid
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTrailer.usageHistory.map((usage, index) => (
                  <tr key={usage._id || index}>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {new Date(usage.rentalPeriod.start).toLocaleDateString()}{" "}
                      - {new Date(usage.rentalPeriod.end).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs capitalize">
                      {usage.serviceType}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      ${usage.totalPaid.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {usage.feedback?.rating
                        ? `${usage.feedback.rating}/5`
                        : "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <button
                        onClick={() =>
                          onUsageHistoryClick?.(selectedTrailer, usage)
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic py-4">
            No usage history for this trailer.
          </p>
        )}
      </div>
    );
  };

  // Empty state when no trailers are available
  if (!isLoading && trailers.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 8l-7 7-7-7"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No trailers available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first trailer to the fleet.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={onAddClick}
            className="flex items-center mx-auto"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New Trailer
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow">
        <div className="animate-pulse flex space-x-4 justify-center items-center">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Loading trailers...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {trailers.map((trailer) => (
          <TrailerCard
            key={trailer._id}
            trailer={trailer}
            onView={handleTrailerView}
            onEdit={handleTrailerEdit}
          />
        ))}
      </div>

      {selectedTrailer && (
        <TrailerDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          trailer={selectedTrailer}
          onEdit={handleTrailerEdit}
          onDelete={handleTrailerDelete}
          extraContent={
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === "details"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium flex items-center ${
                    activeTab === "bookings"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("bookings")}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Bookings
                  {selectedTrailer.bookedDates &&
                    selectedTrailer.bookedDates.length > 0 && (
                      <span className="ml-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 text-xs rounded-full">
                        {selectedTrailer.bookedDates.length}
                      </span>
                    )}
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium flex items-center ${
                    activeTab === "usage"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("usage")}
                >
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Usage History
                  {selectedTrailer.usageHistory &&
                    selectedTrailer.usageHistory.length > 0 && (
                      <span className="ml-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 text-xs rounded-full">
                        {selectedTrailer.usageHistory.length}
                      </span>
                    )}
                </button>
              </div>

              {activeTab === "details"
                ? renderDetailsTab()
                : activeTab === "bookings"
                ? renderBookingsTab()
                : renderUsageHistoryTab()}
            </div>
          }
        />
      )}
    </div>
  );
};
