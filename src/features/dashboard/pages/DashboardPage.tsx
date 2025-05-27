import { useEffect, useState } from "react";
import { BookingCalendar } from "@/features/bookings/components/BookingCalendar";
import { useNavigate } from "react-router-dom";
import { fetchBookings } from "@/features/bookings/api/fetchBookings";
import {
  Booking,
  BookingStatus,
} from "@/features/bookings/types/booking.types";
import { useToast } from "@/hooks/useToast";
import { BookingDetailsDrawer } from "@/features/bookings/components/BookingDetailsDrawer";
import { updateBookingStatus } from "@/features/bookings/api/updateBookingStatus";
import { deleteBooking } from "@/features/bookings/api/deleteBooking";
import { CreateBookingModal } from "@/features/bookings/components/modals/CreateBookingModal";
import { fetchTrailers } from "@/features/trailers/api/fetchTrailers";
import { fetchCustomers } from "@/features/customers/api/fetchCustomers";
import { createBooking } from "@/features/bookings/api/createBooking";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { Customer } from "@/features/customers/types/customer.types";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);

  // New state for CreateBookingModal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    const getBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetchBookings();

        let allBookings: Booking[] = [];

        if (response && response.bookings) {
          allBookings = response.bookings;
        }

        const transformedBookings = allBookings.map((booking: any) => {
          const customer = booking.customer || {};

          const startDate = new Date(booking.startDate);

          const endDate = new Date(booking.endDate);
          endDate.setHours(23, 59, 59);

          return {
            ...booking,
            customer: {
              _id: customer._id || "",
              firstName: customer.firstName || "",
              lastName: customer.lastName || "",
              email: customer.email || "",
              phoneNumber: customer.phoneNumber || "",
            },
            trailerName: booking.trailerName || `Trailer #${booking.trailerId}`,
            customerId: customer._id || booking.customerId,
            startDate: startDate,
            endDate: endDate,
            totalAmount: booking.totalAmount || booking.totalCost || 0,
            depositAmount: booking.depositAmount || 0,
          };
        });

        setBookings(transformedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        addToast({
          message: "Failed to load bookings data",
          variant: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getBookings();
  }, [addToast]);

  // Function to fetch trailers and customers when opening the create modal
  // Function to fetch trailers and customers when opening the create modal
  const handleOpenCreateModal = async () => {
    try {
      // Load trailers and customers in parallel
      const [trailersResponse, customersResponse] = await Promise.all([
        fetchTrailers(),
        fetchCustomers(),
      ]);

      // Get raw trailer data
      const allTrailers = trailersResponse.data || [];

      console.log("All trailers:", allTrailers);

      // Filter out unavailable trailers
      const availableTrailers = allTrailers.filter((trailer: any) => {
        // Check if the trailer is active and available
        if (
          !trailer.availability.isAvailable
        ) {
          return false;
        }

        // Additional check for trailers that might be reserved but not marked properly
        const currentlyBooked = bookings.some((booking) => {
          // Only consider pending or confirmed bookings
          if (booking.status !== "pending" && booking.status !== "confirmed") {
            return false;
          }

          // Check if this booking is for this trailer
          if (booking.trailerId !== trailer._id) {
            return false;
          }

          // Check if the trailer is currently in use (booking in progress)
          const now = new Date();
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);

          return now >= startDate && now <= endDate;
        });

        return !currentlyBooked;
      });

      setTrailers(availableTrailers);
      // @ts-ignore
      setCustomers(customersResponse?.customers || []);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Failed to load data for booking form:", error);
      addToast({
        message: "Failed to load required data. Please try again.",
        variant: "error",
        duration: 5000,
      });
    }
  };

  // Handle submission of new booking
  const handleCreateBooking = async (bookingData: Booking) => {
    setIsSubmittingBooking(true);
    try {
      const response = await createBooking(bookingData);

      const newBooking = {
        ...response.booking,
        customer: bookingData.customer,
        trailerName:
          bookingData.trailerName || `Trailer #${bookingData.trailerId}`,
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
      };

      setBookings((prevBookings) => [...prevBookings, newBooking]);

      addToast({
        message: "Booking created successfully",
        variant: "success",
        duration: 3000,
      });

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create booking:", error);
      addToast({
        message: "Failed to create booking. Please try again.",
        variant: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleViewBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsBookingDetailsOpen(true);
    } else {
      navigate(`/bookings/${bookingId}`);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      const updatedBookings = bookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: newStatus, updatedAt: new Date() }
          : booking
      );

      setBookings(updatedBookings);
      setSelectedBooking(null);
      setIsBookingDetailsOpen(false);

      addToast({
        message: "Booking status updated successfully",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      addToast({
        message: "Failed to update booking status",
        variant: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );

      addToast({
        message: "Booking deleted successfully",
        variant: "success",
        duration: 3000,
      });

      setIsBookingDetailsOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
      addToast({
        message: "Failed to delete booking",
        variant: "error",
        duration: 5000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Summary stats */}
      <div className="col-span-1 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Booking Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-md p-4">
            <p className="text-sm text-green-600 font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-green-800">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-md p-4">
            <p className="text-sm text-yellow-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-md p-4">
            <p className="text-sm text-blue-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-blue-800">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
          <div className="bg-red-50 rounded-md p-4">
            <p className="text-sm text-red-600 font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-800">
              {bookings.filter((b) => b.status === "cancelled").length}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="col-span-1 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleOpenCreateModal}
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700"
          >
            New Booking
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            View All
          </button>
        </div>
      </div>

      {/* Calendar component */}
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Upcoming Bookings</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              <span className="ml-2">Loading calendar...</span>
            </div>
          ) : (
            <BookingCalendar
              bookings={bookings}
              onViewBooking={handleViewBooking}
              variant="base"
              onAddBooking={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Booking details drawer */}
      {selectedBooking && (
        <BookingDetailsDrawer
          isOpen={isBookingDetailsOpen}
          onClose={() => setIsBookingDetailsOpen(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
        />
      )}

      {/* Create booking modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBooking}
        isLoading={isSubmittingBooking}
        trailers={trailers}
        customers={customers}
        existingBookings={bookings}
      />
    </div>
  );
};
