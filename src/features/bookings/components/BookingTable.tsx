import React from "react";
import { Table } from "@/components/Table";
import { Booking, BookingStatus } from "../types/booking.types";
import { format } from "date-fns";

interface BookingTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onRowClick,
}) => {
  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Create data for the table that uses string values
  const tableData = bookings.map((booking) => {
    const daysCount = Math.ceil(
      (booking.endDate.getTime() - booking.startDate.getTime()) /
        (1000 * 3600 * 24)
    );

    return {
      id: booking._id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      trailerName: booking.trailerName,
      startDate: formatDate(booking.startDate),
      endDate: formatDate(booking.endDate),
      daysCount: `${daysCount} day(s)`,
      status: booking.status,
      statusDisplay:
        booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      totalAmount: `$${booking.totalAmount.toFixed(2)}`,
      depositAmount: `$${booking.depositAmount.toFixed(2)}`,
      _original: booking, // Store the original booking for reference
    };
  });

  return (
    <Table
      columns={[
        { accessor: "id", header: "Booking ID" },
        { accessor: "customerName", header: "Customer" },
        { accessor: "trailerName", header: "Trailer" },
        { accessor: "startDate", header: "Booking Dates" },
        { accessor: "statusDisplay", header: "Status" },
        { accessor: "totalAmount", header: "Amount" },
        { accessor: "actions", header: "Actions", isAction: true },
      ]}
      data={tableData}
      onView={(item) => onRowClick(item._original)}
    />
  );
};
