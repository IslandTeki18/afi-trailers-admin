import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/Button";
import { AutoComplete } from "@/components/AutoComplete";
import { Tabs } from "@/components/Tabs";
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer";
import { CreateBookingModal } from "../components/CreateBookingModal";
import { BookingTable } from "../components/BookingTable";
import { Booking, BookingStatus } from "../types/booking.types";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
export const mockBookings: Booking[] = [];

export const BookingPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] =
    useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchOption, setSelectedSearchOption] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create search options for AutoComplete component
  const searchOptions = useMemo(() => {
    const options: any[] = [];

    // Add customer name options
    bookings.forEach((booking) => {
      options.push({
        id: `customer-${booking._id}`,
        name: booking.customer.firstName + " " + booking.customer.lastName,
      });
    });

    // Add trailer name options
    bookings.forEach((booking) => {
      const exists = options.some(
        (option) => option.name === booking.trailerName
      );
      if (!exists) {
        options.push({
          id: `trailer-${booking.trailerId}`,
          name: booking.trailerName,
        });
      }
    });

    // Add booking ID options
    bookings.forEach((booking) => {
      options.push({
        id: `booking-${booking._id}`,
        name: booking._id,
      });
    });

    // Remove duplicates
    return options.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.name === option.name)
    );
  }, [bookings]);

  // Function to get bookings for a specific status (for the tab content)
  const getBookingsForStatus = (status: string) => {
    let result = bookings;

    // If a search option is selected, filter by the exact term
    if (selectedSearchOption && selectedSearchOption.name) {
      const searchValue = selectedSearchOption.name.toLowerCase();
      const optionType = selectedSearchOption.id.split("-")[0];

      switch (optionType) {
        case "customer":
          result = result.filter(
            (booking) => {
              const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
              return customerName.toLowerCase() === searchValue;
            }
          );
          break;
        case "trailer":
          result = result.filter(
            (booking) => booking.trailerName.toLowerCase() === searchValue
          );
          break;
        case "booking":
          result = result.filter(
            (booking) => booking._id.toLowerCase() === searchValue
          );
          break;
        default:
          if (searchTerm) {
            result = result.filter(
              (booking) =>
                booking.customer.firstName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                booking.trailerName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                booking._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
      }
    } else if (searchTerm) {
      // Standard search behavior if no option is selected
      result = result.filter(
        (booking) =>
          booking.customer.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.trailerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (status !== "all") {
      result = result.filter((booking) => booking.status === status);
    }

    return result;
  };

  useEffect(() => {
    setFilteredBookings(getBookingsForStatus(activeTab));
  }, [searchTerm, selectedSearchOption, activeTab, bookings]);

  const handleSearchOptionSelect = (option: { id: string; name: string }) => {
    setSelectedSearchOption(option.name ? option : null);
    setSearchTerm(option.name);
  };

  const handleCreateBooking = (newBooking: Booking) => {
    // In a real application, this would make an API call
    const bookingWithId = {
      ...newBooking,
      _id: `b${bookings.length + 1}`.padStart(4, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBookings([bookingWithId, ...bookings]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    // In a real application, this would make an API call
    const updatedBookings = bookings.map((booking) =>
      booking._id === bookingId
        ? { ...booking, status: newStatus, updatedAt: new Date() }
        : booking
    );

    setBookings(updatedBookings);
    setSelectedBooking(null);
    setIsBookingDetailsOpen(false);
  };

  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  // Create tab items for the Tabs component
  const tabItems = [
    {
      id: "all",
      label: "All Bookings",
      value: (
        <BookingTable
          bookings={getBookingsForStatus("all")}
          onRowClick={handleRowClick}
        />
      ),
    },
    {
      id: "pending",
      label: "Pending",
      value: (
        <BookingTable
          bookings={getBookingsForStatus("pending")}
          onRowClick={handleRowClick}
        />
      ),
    },
    {
      id: "confirmed",
      label: "Confirmed",
      value: (
        <BookingTable
          bookings={getBookingsForStatus("confirmed")}
          onRowClick={handleRowClick}
        />
      ),
    },
    {
      id: "completed",
      label: "Completed",
      value: (
        <BookingTable
          bookings={getBookingsForStatus("completed")}
          onRowClick={handleRowClick}
        />
      ),
    },
    {
      id: "cancelled",
      label: "Cancelled",
      value: (
        <BookingTable
          bookings={getBookingsForStatus("cancelled")}
          onRowClick={handleRowClick}
        />
      ),
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your bookings in one place
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="base" onClick={() => navigate("calendar")}>
            View Booking Calendar
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full">
              <Tabs
                items={tabItems}
                variant="base"
                defaultTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId)}
                className="mb-4"
              />
            </div>
            <div className="flex justify-end mt-4 sm:mt-0 w-full sm:w-64">
              <AutoComplete
                label="Search bookings"
                options={searchOptions}
                variant="base"
                onSelect={handleSearchOptionSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsDrawer
          isOpen={isBookingDetailsOpen}
          onClose={() => setIsBookingDetailsOpen(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateBookingStatus}
        />
      )}
    </div>
  );
};
