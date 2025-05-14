import React, { useState, useRef, useEffect } from "react";
import { format, isWithinInterval } from "date-fns"; // Add these imports
import { Button } from "../../../components/Button";
import { Booking, BookingStatus } from "../types/booking.types";
import BookingDetailsPanel from "./BookingDetailsPanel";

// Updated FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { BookingLegendStatus } from "./BookingLegendStatus";

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
  const [selectedEvents, setSelectedEvents] = useState<
    Array<{
      id: string;
      title: string;
      start: string;
      status: BookingStatus;
      bookingId: string;
    }>
  >([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMonthTitle, setCurrentMonthTitle] = useState("");
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | null>(null);

  // Convert bookings to FullCalendar events
  const calendarEvents = bookings.map((booking) => {
    const startDate = new Date(booking.startDate);

    startDate.setHours(12, 0, 0, 0);

    const endDate = new Date(booking.endDate);
    endDate.setHours(12, 0, 0, 0);

    const displayEndDate = new Date(endDate);
    displayEndDate.setDate(displayEndDate.getDate() + 1);

    return {
      id: booking._id,
      title: `${booking.trailerName} - ${booking.customer.firstName} ${booking.customer.lastName}`,
      start: startDate,
      end: displayEndDate,
      allDay: true,
      backgroundColor: statusColors[booking.status],
      borderColor: statusColors[booking.status],
      extendedProps: {
        status: booking.status,
        customerEmail: booking.customer.email,
        customerPhone: booking.customer.phoneNumber,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        pickupDate: format(startDate, "MMM d, yyyy"),
        lastDayOfUse: format(endDate, "MMM d, yyyy"),
        returnDate: format(displayEndDate, "MMM d, yyyy"),
        description: `Pickup: ${format(startDate, "MMM d")} | Return: ${format(
          displayEndDate,
          "MMM d"
        )} | Status: ${booking.status}`,
      },
    };
  });

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

  // Handle date selection - updated to find all bookings on selected date
  const handleDateSelect = (selectInfo: any) => {
    const selectedDay = new Date(selectInfo.start);
    selectedDay.setHours(12, 0, 0, 0);

    setLastSelectedDate(selectedDay);

    // Find all bookings for the selected day
    const eventsOnDay = bookings.filter((booking) => {
      const startDate = new Date(booking.startDate);
      startDate.setHours(12, 0, 0, 0);

      const endDate = new Date(booking.endDate);
      endDate.setHours(12, 0, 0, 0);

      // Add one day to endDate for proper interval comparison
      const displayEndDate = new Date(endDate);
      displayEndDate.setDate(displayEndDate.getDate() + 1);

      // Check if selected day falls within this booking's range
      return isWithinInterval(selectedDay, {
        start: startDate,
        end: displayEndDate,
      });
    });

    if (eventsOnDay.length > 0) {
      const formattedEvents = eventsOnDay.map((booking) => ({
        id: booking._id,
        title: `${booking.trailerName} - ${booking.customer.firstName} ${booking.customer.lastName}`,
        start: booking.startDate.toString(),
        status: booking.status,
        bookingId: booking._id,
      }));

      setSelectedEvents(formattedEvents);
      setIsDetailsOpen(true);
    } else {
      setSelectedEvents([]);
      setIsDetailsOpen(false);
    }

    if (onDateSelect) {
      onDateSelect(selectInfo.start);
    }
  };

  // Handle event click - now adds just the clicked event to the list
  const handleEventClick = (clickInfo: any) => {
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      status: clickInfo.event.extendedProps.status,
      bookingId: clickInfo.event.id,
    };

    // Replace the selection with just this event
    setSelectedEvents([event]);
    setIsDetailsOpen(true);

    // Also update the lastSelectedDate for consistency
    setLastSelectedDate(new Date(clickInfo.event.start));
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
      <BookingLegendStatus statusColors={statusColors} />

      {/* Booking details panel */}
      {selectedEvents.length > 0 && (
        <div className="mt-6">
          <div className="px-4 py-3 bg-gray-100 rounded-t-lg">
            <h3 className="text-lg font-medium text-gray-900">
              Bookings for{" "}
              {lastSelectedDate
                ? format(lastSelectedDate, "MMMM d, yyyy")
                : "Selected Date"}
            </h3>
          </div>
          <div className="space-y-4">
            {selectedEvents.map((event) => (
              <BookingDetailsPanel
                key={event.id}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                selectedEvent={event}
                onViewBooking={onViewBooking}
                variant={variant}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
