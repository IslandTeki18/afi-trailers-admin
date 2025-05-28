import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
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

  // Define table columns
  // Define table columns
  const columns = [
    { header: "ID", accessor: "_id" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: "maintenanceStatus",
      render: (row: any) => {
        const statusVariantMap: any = {
          Operational: "success",
          Maintenance: "warning",
          "Out of Service": "error",
        };

        return (
          <Badge variant={statusVariantMap[row.maintenanceStatus] || "gray"}>
            {row.maintenanceStatus}
          </Badge>
        );
      },
    },
    {
      header: "Availability",
      accessor: "availability",
      render: (row: any) => (
        <Badge variant={row.availability === "Available" ? "success" : "error"}>
          {row.availability}
        </Badge>
      ),
    },
    {
      header: "Capacity",
      accessor: "capacity",
    },
    {
      header: "Bookings",
      accessor: "bookingsCount", // Change from bookedDates to bookingsCount
      render: (row: any) => {
        return (
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{row.bookingsCount}</span>
          </div>
        );
      },
    },
    {
      header: "Rating",
      accessor: "ratings",
    },
    { header: "Actions", accessor: "actions", isAction: true },
  ];

  // Handle trailer view/details
  const handleTrailerView = (trailer: any) => {
    const originalTrailer = trailers.find((t) => t._id === trailer._id);
    if (originalTrailer) {
      setSelectedTrailer(originalTrailer);
      setIsDrawerOpen(true);
      setActiveTab("details");
    }
  };

  // Handle trailer edit
  const handleTrailerEdit = (trailer: any) => {
    const originalTrailer = trailers.find((t) => t._id === trailer._id);
    if (originalTrailer && onEditClick) {
      onEditClick(originalTrailer);
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

  // Get active bookings count
  const getActiveBookingsCount = (trailer: Trailer) => {
    if (!trailer.bookedDates) return 0;
    const now = new Date();
    return trailer.bookedDates.filter(
      (booking) =>
        booking.status !== "cancelled" && new Date(booking.endDate) >= now
    ).length;
  };

  const formattedData = trailers.map((trailer) => ({
    ...trailer,
    maintenanceStatus: trailer.maintenanceStatus,
    availability: trailer.availability.isAvailable
      ? "Available"
      : "Unavailable",
    ratings: `${trailer.ratings.averageRating}/5 (${trailer.ratings.totalReviews})`,
    "location.address": trailer.location.address,
    bookingsCount: getActiveBookingsCount(trailer),
  }));

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

  return (
    <div className="container mx-auto">
      <Table
        data={formattedData}
        columns={columns}
        onView={handleTrailerView}
        onEdit={handleTrailerEdit}
        variant="primary"
      />

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
                ? null
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
