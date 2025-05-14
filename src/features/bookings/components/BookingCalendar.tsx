import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "../../../components/Button";
import { Booking, BookingStatus } from "../types/booking.types";

// Updated FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

// Status to color mapping for booking events
const statusColors: Record<BookingStatus, string> = {
  pending: "#FBBF24", // Yellow
  confirmed: "#34D399", // Green
  cancelled: "#F87171", // Red
  completed: "#60A5FA", // Blue
};

interface BookingCalendarProps {
  bookings: Booking[];
  onAddBooking?: () => void;
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
  onDateSelect?: (date: Date) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings = [],
  onAddBooking,
  onViewBooking,
  variant = "primary",
  selectedDate = new Date(),
  onDateSelect,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    start: string;
    status: BookingStatus;
    bookingId: string;
  } | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMonthTitle, setCurrentMonthTitle] = useState("");

  // Convert bookings to FullCalendar events
  const calendarEvents = bookings.map((booking) => {
    // Extract dates and set to 8am
    const startDate = new Date(booking.startDate);
    startDate.setHours(8, 0, 0, 0);

    // For display in FullCalendar, we need to add a day to the end date
    // This is because the booking model stores the last day of possession as endDate
    // but FullCalendar treats end dates as exclusive
    const endDate = new Date(booking.endDate);
    endDate.setHours(8, 0, 0, 0);

    // Create an adjusted end date for FullCalendar (day after the booking ends)
    const displayEndDate = new Date(endDate);
    displayEndDate.setDate(displayEndDate.getDate() + 1);

    return {
      id: booking._id,
      title: `${booking.trailerName} - ${booking.customer.firstName} ${booking.customer.lastName}`,
      start: startDate,
      end: displayEndDate, // Use the adjusted end date for display
      allDay: true,
      backgroundColor: statusColors[booking.status],
      borderColor: statusColors[booking.status],
      extendedProps: {
        status: booking.status,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phoneNumber,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
      },
    };
  });

  // Update the month title when the view changes
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCurrentMonthTitle(api.view.title);

      // Add listener for view changes
      const handleViewDidMount = () => {
        setCurrentMonthTitle(api.view.title);
      };

      api.on("datesSet", handleViewDidMount);

      return () => {
        api.off("datesSet", handleViewDidMount);
      };
    }
  }, []);

  // Update handlers to maintain month title
  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentMonthTitle(calendarApi.view.title);

      if (onDateSelect) {
        onDateSelect(new Date());
      }
    }
  };

  const handlePrevious = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentMonthTitle(calendarApi.view.title);

      if (onDateSelect && calendarApi.getDate()) {
        onDateSelect(calendarApi.getDate());
      }
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentMonthTitle(calendarApi.view.title);

      if (onDateSelect && calendarApi.getDate()) {
        onDateSelect(calendarApi.getDate());
      }
    }
  };

  const handleViewChange = (viewType: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(viewType);
      setCurrentMonthTitle(calendarApi.view.title);
    }
  };

  // Handle date selection
  const handleDateSelect = (selectInfo: any) => {
    if (onDateSelect) {
      onDateSelect(selectInfo.start);
    }
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      status: clickInfo.event.extendedProps.status,
      bookingId: clickInfo.event.id,
    };

    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="booking-calendar space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Button variant={variant} size="small" onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant={variant} size="small" onClick={handleToday}>
            Today
          </Button>
          <Button variant={variant} size="small" onClick={handleNext}>
            Next
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          {currentMonthTitle}
        </h2>

        <div className="flex flex-wrap items-center space-x-2">
          <Button
            variant="base"
            size="small"
            onClick={() => handleViewChange("dayGridMonth")}
          >
            Month
          </Button>
          <Button
            variant="base"
            size="small"
            onClick={() => handleViewChange("timeGridWeek")}
          >
            Week
          </Button>
          <Button
            variant="base"
            size="small"
            onClick={() => handleViewChange("timeGridDay")}
          >
            Day
          </Button>
          <Button
            variant="base"
            size="small"
            onClick={() => handleViewChange("listMonth")}
          >
            List
          </Button>
        </div>

        <div>
          <Button
            variant={variant}
            onClick={onAddBooking}
            className="flex items-center"
          >
            Add Booking
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
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
          contentHeight={800}
          datesSet={(dateInfo) => {
            setCurrentMonthTitle(
              calendarRef.current?.getApi().view.title || ""
            );
          }}
        />
      </div>

      {/* Legend for booking statuses */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, color], idx) => (
            <div key={`${status}-${idx}`} className="flex items-center">
              <div
                className="h-4 w-4 rounded-full mr-2"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking details panel */}
      {isDetailsOpen && selectedEvent && (
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Booking Details
            </h3>
            <Button
              variant="gray"
              size="small"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-white px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-medium text-gray-700">Event</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedEvent.title}
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-700">Date</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {format(new Date(selectedEvent.start), "MMMM d, yyyy")}
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-700">
                    Status
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 capitalize">
                    {selectedEvent.status}
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    variant={variant}
                    onClick={() =>
                      onViewBooking && onViewBooking(selectedEvent.bookingId)
                    }
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
