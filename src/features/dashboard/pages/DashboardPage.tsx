import { BookingCalendar } from "@/features/bookings/components/BookingCalendar";
import { mockBookings } from "@/features/bookings/pages/BookingPage";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleViewBooking = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Other dashboard widgets */}

      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Upcoming Bookings</h2>
          <BookingCalendar
            bookings={mockBookings}
            onViewBooking={handleViewBooking}
            variant="primary"
            onAddBooking={() => navigate("/bookings/new")}
          />
        </div>
      </div>

      {/* Other dashboard widgets */}
    </div>
  );
};
