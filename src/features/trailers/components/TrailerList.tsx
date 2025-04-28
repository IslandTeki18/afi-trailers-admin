import { useState } from "react";
import { Table } from "../../../components/Table";
import { TrailerDetailsDrawer } from "./TrailerDetailsDrawer";
import { Trailer } from "../types/trailer.types";

export const TrailerList = () => {
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
    {
      _id: "2",
      name: "Flatbed Heavy Duty",
      capacity: "1500kg",
      dimensions: {
        length: 3.5,
        width: 2.0,
        height: 0.5,
      },
      description:
        "Heavy duty flatbed for construction materials and machinery",
      type: "Flatbed",
      rentalPrices: {
        fullDay: 120,
      },
      deliveryFee: 50,
      maintenanceStatus: "Maintenance",
      lastMaintenanceDate: new Date("2024-04-10"),
      nextScheduledMaintenance: new Date("2024-04-25"),
      bookedDates: [],
      location: {
        address: "Customer Site B, 456 Industry Road",
      },
      photos: ["flatbed1.jpg"],
      features: ["Reinforced Base", "Tie-Down Points", "Ramps"],
      usageHistory: [],
      insuranceRequired: true,
      towingRequirements: [
        "Heavy Duty Tow Ball",
        "7-Pin Connector",
        "Electric Brakes",
      ],
      serviceTypes: ["full"],
      weight: {
        empty: 500,
        maxLoad: 1500,
      },
      availability: {
        isAvailable: false,
        nextAvailableDate: new Date("2024-04-26"),
      },
      ratings: {
        averageRating: 4.5,
        totalReviews: 32,
      },
      createdAt: new Date("2022-08-10"),
      updatedAt: new Date("2024-04-10"),
    },
    {
      _id: "3",
      name: "Refrigerated Trailer Medium",
      capacity: "750kg",
      dimensions: {
        length: 3.0,
        width: 1.8,
        height: 2.0,
      },
      description:
        "Temperature-controlled refrigerated trailer for food transport",
      type: "Refrigerated",
      rentalPrices: {
        halfDay: 95,
        fullDay: 180,
      },
      deliveryFee: 60,
      weekendSurcharge: 25,
      maintenanceStatus: "Out of Service",
      lastMaintenanceDate: new Date("2024-03-01"),
      bookedDates: [],
      location: {
        address: "Service Center, 789 Tech Boulevard",
        coordinates: {
          latitude: -27.5,
          longitude: 153.015,
        },
      },
      photos: ["refrig1.jpg", "refrig2.jpg", "refrig3.jpg"],
      features: ["Temperature Control", "Digital Display", "Backup Battery"],
      usageHistory: [],
      insuranceRequired: true,
      towingRequirements: ["Standard Tow Ball", "12-Pin Connector"],
      serviceTypes: ["full", "self"],
      weight: {
        empty: 600,
        maxLoad: 750,
      },
      availability: {
        isAvailable: false,
        nextAvailableDate: new Date("2024-05-15"),
      },
      ratings: {
        averageRating: 4.9,
        totalReviews: 28,
      },
      createdAt: new Date("2023-05-20"),
      updatedAt: new Date("2024-04-05"),
    },
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
      // Custom rendering handled in Table component
    },
    { header: "Location", accessor: "location.address" },
    { header: "Actions", accessor: "actions", isAction: true },
  ];

  // Handle trailer edit/view
const handleTrailerEdit = (trailer: any) => {
  const originalTrailer = trailers.find((t) => t._id === trailer._id);
  if (originalTrailer) {
    setSelectedTrailer(originalTrailer);
    setIsDrawerOpen(true);
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
