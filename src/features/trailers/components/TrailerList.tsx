import { useState } from "react";
import { Table } from "../../../components/Table";
import { TrailerDetailsDrawer } from "./TrailerDetailsDrawer";
import { Trailer } from "../types/trailer.types";

interface TrailerListProps {
  onEditClick?: (trailer: Trailer) => void;
}

export const TrailerList: React.FC<TrailerListProps> = ({ onEditClick }) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const trailers: Trailer[] = [
    {
      _id: "1",
      name: "Box Trailer Standard",
      capacity: "500kg",
      dimensions: {
        length: 2.5,
        width: 1.5,
        height: 1.8,
      },
      description:
        "Standard box trailer suitable for moving furniture and appliances",
      type: "Box",
      rentalPrices: {
        halfDay: 45,
        fullDay: 75,
      },
      deliveryFee: 30,
      weekendSurcharge: 15,
      maintenanceStatus: "Operational",
      lastMaintenanceDate: new Date("2024-03-15"),
      nextScheduledMaintenance: new Date("2025-03-15"),
      bookedDates: [],
      location: {
        address: "Depot A, 123 Main Street",
        coordinates: {
          latitude: -27.4705,
          longitude: 153.026,
        },
      },
      photos: ["trailer1_main.jpg", "trailer1_side.jpg"],
      features: ["Enclosed", "Lockable", "LED Lights"],
      usageHistory: [],
      insuranceRequired: true,
      towingRequirements: ["Standard Tow Ball", "7-Pin Connector"],
      serviceTypes: ["full", "self"],
      weight: {
        empty: 300,
        maxLoad: 500,
      },
      availability: {
        isAvailable: true,
      },
      ratings: {
        averageRating: 4.7,
        totalReviews: 45,
      },
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-04-01"),
    },
    // ...other trailers remain the same
  ];

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
