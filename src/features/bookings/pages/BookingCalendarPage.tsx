import { useState, useEffect } from "react";
import { Button } from "../../../components/Button";
import { BookingCalendar } from "../components/BookingCalendar";
import { CreateBookingModal } from "../components/CreateBookingModal";
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer";
import { Booking, BookingStatus } from "../types/booking.types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { fetchTrailers } from "@/features/trailers/api/fetchTrailers";

// Use the same mock data as BookingPage
import { mockBookings } from "./BookingPage";
import { Trailer } from "@/features/trailers/types/trailer.types";

export const BookingCalendarPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTrailersData = async () => {
      try {
        console.log("Fetching trailers...");
        const trailersData = await fetchTrailers();
        console.log("Raw trailers data:", trailersData);

        if (
          trailersData &&
          typeof trailersData === "object" &&
          "data" in trailersData
        ) {
          console.log(
            "Setting trailers from data property:",
            trailersData.data
          );
          setTrailers(trailersData.data);
        }
        // Check if trailersData is an array directly
        else if (Array.isArray(trailersData)) {
          console.log("Setting trailers directly from array:", trailersData);
          setTrailers(trailersData);
        }
        // If we have no valid data, set an empty array
        else {
          console.error("Invalid trailer data format", trailersData);
          setTrailers([]);
        }
      } catch (error) {
        console.error("Error fetching trailers:", error);
      }
    };

    fetchTrailersData();
  }, []);

  const handleCreateBooking = (newBooking: Partial<Booking>) => {
    let startDate = new Date(newBooking.startDate || new Date());
    startDate.setHours(12, 0, 0, 0);

    let endDate = new Date(newBooking.endDate || new Date());
    endDate.setHours(12, 0, 0, 0);

    const returnDate = new Date(endDate);
    returnDate.setDate(returnDate.getDate() + 1);
    returnDate.setHours(8, 0, 0, 0);

    const bookingWithId: Booking = {
      ...newBooking,
      startDate: startDate,
      endDate: endDate,
      _id: `b${bookings.length + 1}`.padStart(4, "0"),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: newBooking.status || "pending",
    } as Booking;

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
        <Button variant="base" onClick={() => navigate("/bookings")}>
          View Booking Management
        </Button>
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
        trailers={trailers}
      />
    </div>
  );
};

export default BookingCalendarPage;
