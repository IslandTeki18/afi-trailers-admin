import React, { useState, useRef, useEffect } from "react";
import { format, isWithinInterval } from "date-fns";
import { Button } from "../../../components/Button";
import { Booking, BookingStatus } from "../../bookings/types/booking.types";
import { Trailer } from "../types/trailer.types";
import { CreateBookingModal } from "../../bookings/components/CreateBookingModal";
import { fetchCustomers } from "../../customers/api/fetchCustomers";
import { Customer } from "../../customers/types/customer.types";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Status to color mapping for booking events
const statusColors: Record<BookingStatus, string> = {
  pending: "#FBBF24", // Yellow
  confirmed: "#34D399", // Green
  cancelled: "#F87171", // Red
  completed: "#60A5FA", // Blue
};

interface TrailerBookingCalendarProps {
  trailer: Trailer;
  bookings: Booking[];
  onAddBooking?: (date: Date) => void;
  onViewBooking?: (bookingId: string) => void;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "base"
    | "gray"
    | "info";
  selectedDate?: Date;
}

export const TrailerBookingCalendar: React.FC<TrailerBookingCalendarProps> = ({
  trailer,
  bookings = [],
  onAddBooking,
  onViewBooking,
  variant = "primary",
  selectedDate = new Date(),
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentMonthTitle, setCurrentMonthTitle] = useState("");
  const [availabilityInfo, setAvailabilityInfo] = useState({
    totalDaysBooked: 0,
    totalDaysAvailable: 0,
    utilization: 0,
  });

  // Add state for the CreateBookingModal
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | null>(
    null
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Filter bookings for this specific trailer
  const trailerBookings = bookings;

  // Load customers for the booking modal
  useEffect(() => {
    if (showCreateBookingModal) {
      setIsLoadingCustomers(true);
      fetchCustomers()
        .then((response) => {
          // @ts-ignore
          if (response && response.data) {
            // @ts-ignore
            setCustomers(response.data);
          }
        })
        .catch((error) => {
          console.error("Error loading customers:", error);
        })
        .finally(() => {
          setIsLoadingCustomers(false);
        });
    }
  }, [showCreateBookingModal]);

  // Convert bookings to FullCalendar events
  const calendarEvents = trailerBookings.map((booking) => {
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(booking.endDate);

    const isSingleDayBooking =
      startDate.toDateString() === endDate.toDateString();

    const displayEndDate = new Date(endDate);
    displayEndDate.setDate(displayEndDate.getDate() + 1);
    displayEndDate.setHours(0, 0, 0, 0);

    const customTitle = `${booking.customer.firstName} ${booking.customer.lastName}`;
    const singleDayNote = isSingleDayBooking ? " (Same Day Return)" : "";

    return {
      id: booking._id,
      title: customTitle + singleDayNote,
      start: startDate,
      end: displayEndDate,
      allDay: true,
      backgroundColor: statusColors[booking.status],
      borderColor: statusColors[booking.status],
      extendedProps: {
        status: booking.status,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phoneNumber,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        pickupDate: format(startDate, "MMM d, yyyy"),
        returnDate: isSingleDayBooking
          ? `${format(endDate, "MMM d, yyyy")} by 8:00 PM`
          : format(displayEndDate, "MMM d, yyyy"),
        description: `${booking.customer.firstName} ${booking.customer.lastName} | Status: ${booking.status}`,
        isSingleDayBooking: isSingleDayBooking,
      },
    };
  });

  // Add maintenance events if trailer has scheduled maintenance
  if (
    trailer.maintenanceStatus === "Maintenance" ||
    trailer.nextScheduledMaintenance
  ) {
    const maintenanceEvents = [];

    if (trailer.maintenanceStatus === "Maintenance") {
      let maintenanceEndDate = trailer.availability.nextAvailableDate;
      if (!maintenanceEndDate) {
        maintenanceEndDate = new Date();
        maintenanceEndDate.setDate(maintenanceEndDate.getDate() + 7);
      }

      maintenanceEvents.push({
        id: "current-maintenance",
        title: "Under Maintenance",
        start: new Date(),
        end: maintenanceEndDate,
        allDay: true,
        backgroundColor: "#9CA3AF", // Gray
        borderColor: "#6B7280",
      });
    }

    // Scheduled future maintenance
    if (trailer.nextScheduledMaintenance) {
      const maintenanceDate = new Date(trailer.nextScheduledMaintenance);
      const endDate = new Date(maintenanceDate);
      endDate.setDate(endDate.getDate() + 1);

      maintenanceEvents.push({
        id: "scheduled-maintenance",
        title: "Scheduled Maintenance",
        start: maintenanceDate,
        end: endDate,
        allDay: true,
        backgroundColor: "#9CA3AF", // Gray
        borderColor: "#6B7280",
      });
    }
    // @ts-ignore
    calendarEvents.push(...maintenanceEvents);
  }

  // Calculate availability statistics
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const currentView = api.view;
      const viewStart = currentView.currentStart;
      const viewEnd = currentView.currentEnd;

      const totalDays = Math.round(
        (viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24)
      );

      let bookedDays = 0;
      trailerBookings.forEach((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        for (
          let day = new Date(viewStart);
          day < viewEnd;
          day.setDate(day.getDate() + 1)
        ) {
          if (isWithinInterval(day, { start: bookingStart, end: bookingEnd })) {
            bookedDays++;
            break;
          }
        }
      });

      const availableDays = totalDays - bookedDays;
      const utilizationRate =
        totalDays > 0 ? Math.round((bookedDays / totalDays) * 100) : 0;

      setAvailabilityInfo({
        totalDaysBooked: bookedDays,
        totalDaysAvailable: availableDays,
        utilization: utilizationRate,
      });
    }
  }, [trailerBookings, currentMonthTitle]);

  // Update the month title when the view changes
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCurrentMonthTitle(api.view.title);

      const handleViewDidMount = () => {
        setCurrentMonthTitle(api.view.title);
      };

      api.on("datesSet", handleViewDidMount);

      return () => {
        api.off("datesSet", handleViewDidMount);
      };
    }
  }, []);

  // Navigation handlers
  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentMonthTitle(calendarApi.view.title);
    }
  };

  const handlePrevious = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentMonthTitle(calendarApi.view.title);
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentMonthTitle(calendarApi.view.title);
    }
  };

  // Handle date selection to create a new booking
  const handleDateSelect = (selectInfo: any) => {
    // If onAddBooking prop is provided, use that
    if (onAddBooking) {
      onAddBooking(selectInfo.start);
    } else {
      // Otherwise, show the create booking modal
      setSelectedBookingDate(selectInfo.start);
      setShowCreateBookingModal(true);
    }
  };

  // Handle booking creation from the modal
  const handleCreateBooking = (booking: Booking) => {
    setShowCreateBookingModal(false);

    // You might want to refresh the bookings list here or have the parent component do it
  };

  const handleEventClick = (clickInfo: any) => {
    if (onViewBooking) {
      onViewBooking(clickInfo.event.id);
    }
  };

  return (
    <div className="trailer-booking-calendar space-y-6">
      {/* Trailer header with info */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{trailer.name} Calendar</h1>
            <p className="text-sm text-gray-500">
              {trailer.type} · ID: {trailer._id?.substring(0, 8)}...
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                trailer.availability.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {trailer.availability.isAvailable ? "Available" : "Unavailable"}
            </div>

            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                trailer.maintenanceStatus === "Operational"
                  ? "bg-green-100 text-green-800"
                  : trailer.maintenanceStatus === "Maintenance"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {trailer.maintenanceStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Availability statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Booked Days</p>
          <p className="text-2xl font-semibold">
            {availabilityInfo.totalDaysBooked}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Available Days</p>
          <p className="text-2xl font-semibold">
            {availabilityInfo.totalDaysAvailable}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Utilization Rate</p>
          <p className="text-2xl font-semibold">
            {availabilityInfo.utilization}%
          </p>
        </div>
      </div>

      {/* Calendar controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="base" size="small" onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant="base" size="small" onClick={handleToday}>
            Today
          </Button>
          <Button variant="base" size="small" onClick={handleNext}>
            Next
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          {currentMonthTitle}
        </h2>

        <div>
          <Button
            variant="base"
            onClick={() => onAddBooking && onAddBooking(new Date())}
            className="flex items-center"
            disabled={!trailer.availability.isAvailable}
          >
            Add Booking
          </Button>
        </div>
      </div>

      {/* Main calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={calendarEvents}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialDate={selectedDate}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          contentHeight={700}
          eventContent={(eventInfo) => {
            return (
              <div className="p-1 cursor-pointer">
                <div className="font-semibold text-sm">
                  {eventInfo.event.title}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-medium mb-2">Booking Status Legend</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: statusColors.pending }}
            ></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: statusColors.confirmed }}
            ></div>
            <span className="text-sm">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: statusColors.cancelled }}
            ></div>
            <span className="text-sm">Cancelled</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: statusColors.completed }}
            ></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: "#9CA3AF" }}
            ></div>
            <span className="text-sm">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      {showCreateBookingModal && selectedBookingDate && (
        <CreateBookingModal
          isOpen={showCreateBookingModal}
          onClose={() => setShowCreateBookingModal(false)}
          onSubmit={handleCreateBooking}
          isLoading={isLoadingCustomers}
          trailers={[trailer]}
          customers={customers}
        />
      )}
    </div>
  );
};

export default TrailerBookingCalendar;
