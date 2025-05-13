import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
import { TrailerDetailsDrawer } from "./TrailerDetailsDrawer";
import { Trailer } from "../types/trailer.types";
import { fetchTrailers } from "../api/fetchTrailers";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/Button";

interface TrailerListProps {
  onEditClick?: (trailer: Trailer) => void;
  onAddClick?: () => void;
}

export const TrailerList: React.FC<TrailerListProps> = ({
  onEditClick,
  onAddClick,
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrailersData = async () => {
      setIsLoading(true);
      try {
        const trailers = await fetchTrailers();
        setTrailers(trailers);
      } catch (error) {
        console.error("Error fetching trailers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailersData();

    // Add event listener for refetching trailers
    const handleRefetch = () => fetchTrailersData();
    window.addEventListener("refetch-trailers", handleRefetch);

    // Clean up event listener
    return () => window.removeEventListener("refetch-trailers", handleRefetch);
  }, []);

  // Define table columns
  const columns = [
    { header: "ID", accessor: "_id" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: "maintenanceStatus",
    },
    {
      header: "Availability",
      accessor: "availability",
    },
    {
      header: "Capacity",
      accessor: "capacity",
    },
    {
      header: "Rating",
      accessor: "ratings",
    },
    { header: "Location", accessor: "location.address" },
    { header: "Actions", accessor: "actions", isAction: true },
  ];

  // Handle trailer view/details
  const handleTrailerView = (trailer: any) => {
    const originalTrailer = trailers.find((t) => t._id === trailer._id);
    if (originalTrailer) {
      setSelectedTrailer(originalTrailer);
      setIsDrawerOpen(true);
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

  const formattedData = trailers.map((trailer) => ({
    ...trailer,
    maintenanceStatus: trailer.maintenanceStatus,
    availability: trailer.availability.isAvailable
      ? "Available"
      : "Unavailable",
    ratings: `${trailer.ratings.averageRating}/5 (${trailer.ratings.totalReviews})`,
    "location.address": trailer.location.address,
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
        />
      )}
    </div>
  );
};
