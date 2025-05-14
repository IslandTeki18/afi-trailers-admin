import React, { useState } from "react";
import { Button } from "../../../components/Button";
import { BookingCalendar } from "../components/BookingCalendar";
import { CreateBookingModal } from "../components/CreateBookingModal";
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer";
import { Booking, BookingStatus } from "../types/booking.types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

// Use the same mock data as BookingPage
import { mockBookings } from "./BookingPage";

export const BookingCalendarPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const handleViewBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsBookingDetailsOpen(true);
    }
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log(`Selected date: ${format(date, "yyyy-MM-dd")}`);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your bookings in calendar format
          </p>
        </div>
        <Button variant="base" onClick={() => navigate("/bookings")}>View Booking Management</Button>
      </div>

      <BookingCalendar
        bookings={bookings}
        onAddBooking={() => setIsCreateModalOpen(true)}
        onViewBooking={handleViewBooking}
        variant="base"
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {selectedBooking && (
        <BookingDetailsDrawer
          isOpen={isBookingDetailsOpen}
          onClose={() => setIsBookingDetailsOpen(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateBookingStatus}
        />
      )}

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
};

export default BookingCalendarPage;
