import { useState, useEffect } from "react";
import { Button } from "../../../components/Button";
import { BookingCalendar } from "../components/BookingCalendar";
import { CreateBookingModal } from "../components/CreateBookingModal";
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer";
import { Booking, BookingStatus } from "../types/booking.types";
import { useNavigate } from "react-router-dom";
import { fetchTrailers } from "@/features/trailers/api/fetchTrailers";
import { fetchCustomers } from "@/features/customers/api/fetchCustomers";
import { fetchCustomerById } from "@/features/customers/api/fetchCustomerById";
import { fetchTrailerById } from "@/features/trailers/api/fetchTrailerById";
import { fetchBookings } from "../api/fetchBookings";
import {
  createBooking,
  CreateBookingPayload,
  validateBookingData,
} from "../api/createBooking";
import { useToast } from "@/hooks/useToast";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { Customer } from "@/features/customers/types/customer.types";

// Use the same mock data as BookingPage

export const BookingCalendarPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTrailersData = async () => {
      try {
        const trailersData = await fetchTrailers();

        if (
          trailersData &&
          typeof trailersData === "object" &&
          "data" in trailersData
        ) {
          setTrailers(trailersData.data);
        } else if (Array.isArray(trailersData)) {
          setTrailers(trailersData);
        } else {
          setTrailers([]);
        }
      } catch (error) {
        console.log("Error fetching trailers:", error);
      }
    };

    fetchTrailersData();
  }, []);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await fetchBookings();

        const transformedBookings = response.map((booking: any) => {
          const customer = booking.customerId || {};

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
        console.log("Failed to fetch bookings:", error);
        addToast({
          message: "Failed to load bookings. Please try again.",
          variant: "error",
        });
      }
    };

    getBookings();
  }, [addToast]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        // @ts-ignore
        setCustomers(data.customers);
      } catch (error) {
        console.log("Failed to fetch customers:", error);
        addToast({
          message: "Failed to load customers. Please try again.",
          variant: "error",
        });
      }
    };

    loadCustomers();
  }, []);

  const handleCreateBooking = async (newBooking: Booking) => {
    try {
      let startDate = new Date(newBooking.startDate || new Date());
      startDate.setHours(12, 0, 0, 0);

      let endDate = new Date(newBooking.endDate || new Date());
      endDate.setHours(12, 0, 0, 0);

      const returnDate = new Date(endDate);
      returnDate.setDate(returnDate.getDate() + 1);
      returnDate.setHours(8, 0, 0, 0);

      const bookingWithId: CreateBookingPayload = {
        ...newBooking,
        startDate: startDate,
        endDate: endDate,
        status: newBooking.status || "pending",
        customerId: newBooking.customer._id!,
        // @ts-ignore
        trailerId: newBooking.trailerId,
        serviceType: "full",
        totalAmount: newBooking.totalAmount || 0,
      };

      const { isValid, errors } = validateBookingData(bookingWithId);
      if (!isValid) {
        addToast({
          message: `Error creating booking: ${Object.values(errors).join(
            ", "
          )}`,
          variant: "error",
          duration: 5000,
        });
        return;
      }

      const createdBooking = await createBooking(bookingWithId);

      const [customer, trailer] = await Promise.all([
        fetchCustomerById(createdBooking.customer._id!),
        fetchTrailerById(createdBooking.trailerId),
      ]);

      const completeBooking: Booking = {
        ...createdBooking,
        customer,
        trailerId: trailer._id || "No Trailer ID",
        trailerName: trailer.name || "Unknown Trailer",
      };

      setBookings([completeBooking, ...bookings]);
      setIsCreateModalOpen(false);

      addToast({
        message: "Booking created successfully",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log("Error creating booking:", error);
      addToast({
        message: "Failed to create booking. Please try again.",
        variant: "error",
        duration: 5000,
      });
    }
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
        customers={customers}
      />
    </div>
  );
};

export default BookingCalendarPage;
