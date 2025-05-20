import { useState } from "react";
import { format } from "date-fns";
import { Drawer } from "../../../components/Drawer";
import { Button } from "../../../components/Button";
import { Booking, BookingStatus } from "../types/booking.types";

interface BookingDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

export const BookingDetailsDrawer = ({
  isOpen,
  onClose,
  booking,
  onUpdateStatus,
}: BookingDetailsDrawerProps) => {
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    visible: boolean;
    status?: BookingStatus;
    message?: string;
  }>({ visible: false });

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
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

  const calculateBookingDuration = (
    start: Date | string,
    end: Date | string
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays;
  };

  const handleStatusChange = (newStatus: BookingStatus) => {
    let message = "";

    switch (newStatus) {
      case "confirmed":
        message = "Are you sure you want to confirm this booking?";
        break;
      case "cancelled":
        message = "Are you sure you want to cancel this booking?";
        break;
      case "completed":
        message = "Are you sure you want to mark this booking as completed?";
        break;
      default:
        message = `Are you sure you want to change the status to ${newStatus}?`;
    }

    setConfirmAction({
      visible: true,
      status: newStatus,
      message,
    });
    setShowStatusOptions(false);
  };

  const confirmStatusChange = () => {
    if (confirmAction.status) {
      onUpdateStatus(booking._id!, confirmAction.status);
    }
    setConfirmAction({ visible: false });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking #${booking._id}`}
      position="right"
      maxWidth="lg"
    >
      <div className="space-y-8 pb-6">
        {/* Booking Status */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-md font-semibold text-gray-700">Status</h2>
            <span
              className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-medium ${getStatusBadgeClass(
                booking.status
              )}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="relative">
            <Button
              variant="base"
              size="small"
              onClick={() => setShowStatusOptions(!showStatusOptions)}
            >
              Update Status
            </Button>

            {showStatusOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {booking.status !== "pending" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange("pending")}
                    >
                      Set as Pending
                    </button>
                  )}
                  {booking.status !== "confirmed" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange("confirmed")}
                    >
                      Confirm Booking
                    </button>
                  )}
                  {booking.status !== "completed" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange("completed")}
                    >
                      Mark as Completed
                    </button>
                  )}
                  {booking.status !== "cancelled" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleStatusChange("cancelled")}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.customer.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.customer.phoneNumber}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Customer ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.customer._id}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Trailer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Trailer Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Trailer</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.trailerName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Trailer ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {booking.trailerId}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Booking Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Details
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Start Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(booking.startDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Pick-up Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(booking.startDate)} (8:00 AM)
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Day of Use
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(booking.endDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculateBookingDuration(
                    new Date(booking.startDate),
                    new Date(booking.endDate)
                  ) + 1}{" "}
                  day(s)
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Return Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(
                    new Date(new Date(booking.endDate).getTime() + 86400000)
                  )}{" "}
                  (8:00 AM)
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total Amount
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${booking.totalAmount.toFixed(2) || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Deposit</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  $
                  {(booking.depositAmount &&
                    booking.depositAmount.toFixed(2)) ||
                    0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Balance Due
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  $
                  {(booking.totalAmount - (booking.depositAmount || 0)).toFixed(
                    2
                  ) || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Daily Rate (Estimated)
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  $
                  {(
                    booking.totalAmount /
                    calculateBookingDuration(booking.startDate, booking.endDate)
                  ).toFixed(2) || 0}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <Button variant="gray" size="medium" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="base"
            size="medium"
            onClick={() => setShowStatusOptions(true)}
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Status Change
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction.message}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="gray"
                size="medium"
                onClick={() => setConfirmAction({ visible: false })}
              >
                Cancel
              </Button>
              <Button
                variant="base"
                size="medium"
                onClick={confirmStatusChange}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
