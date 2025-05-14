import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/Button";
import { Booking, BookingStatus } from "../types/booking.types";
import { addDays, format } from "date-fns";

// Mock data for dropdowns
const mockCustomers = [
  {
    id: "c001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
  },
  {
    id: "c002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
  },
  {
    id: "c003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "(555) 456-7890",
  },
  {
    id: "c004",
    name: "Emily Brown",
    email: "emily.b@example.com",
    phone: "(555) 567-8901",
  },
];

const mockTrailers = [
  { id: "t001", name: "Utility Trailer 5x8", dailyRate: 60 },
  { id: "t002", name: "Cargo Trailer 6x12", dailyRate: 75 },
  { id: "t003", name: "Car Hauler Trailer", dailyRate: 90 },
  { id: "t004", name: "Dump Trailer", dailyRate: 100 },
];

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Booking) => void;
}

export const CreateBookingModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateBookingModalProps) => {
  const [bookingData, setBookingData] = useState<Partial<Booking>>({
    status: "pending",
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    depositAmount: 0,
    totalAmount: 0,
  });

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const [duration, setDuration] = useState(1);
  const [depositPercentage, setDepositPercentage] = useState(25);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate rental duration whenever start or end date changes
  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const days = Math.ceil(
        (bookingData.endDate.getTime() - bookingData.startDate.getTime()) /
          (1000 * 3600 * 24)
      );
      setDuration(days > 0 ? days : 1);
    }
  }, [bookingData.startDate, bookingData.endDate]);

  // Calculate total and deposit amounts when duration or selected trailer changes
  useEffect(() => {
    if (selectedTrailer) {
      const trailer = mockTrailers.find((t) => t.id === selectedTrailer);
      if (trailer) {
        const totalAmount = trailer.dailyRate * duration;
        const depositAmount = (totalAmount * depositPercentage) / 100;

        setBookingData((prev) => ({
          ...prev,
          totalAmount,
          depositAmount,
        }));
      }
    }
  }, [selectedTrailer, duration, depositPercentage]);

  // Update booking data when customer selection changes
  useEffect(() => {
    if (selectedCustomer) {
      const customer = mockCustomers.find((c) => c.id === selectedCustomer);
      if (customer) {
        setBookingData((prev) => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
        }));
      }
    }
  }, [selectedCustomer]);

  // Update booking data when trailer selection changes
  useEffect(() => {
    if (selectedTrailer) {
      const trailer = mockTrailers.find((t) => t.id === selectedTrailer);
      if (trailer) {
        setBookingData((prev) => ({
          ...prev,
          trailerId: trailer.id,
          trailerName: trailer.name,
        }));
      }
    }
  }, [selectedTrailer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomer) {
      newErrors.customer = "Customer is required";
    }

    if (!selectedTrailer) {
      newErrors.trailer = "Trailer is required";
    }

    if (!bookingData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!bookingData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      bookingData.startDate &&
      bookingData.endDate &&
      bookingData.endDate < bookingData.startDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // The booking object type is forced here since we've validated that all required fields exist
      onSubmit(bookingData as Booking);
    }
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setBookingData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Booking
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Selection */}
            <div>
              <label
                htmlFor="customer"
                className="block text-sm font-medium text-gray-700"
              >
                Customer
              </label>
              <select
                id="customer"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.customer ? "border-red-500" : ""
                }`}
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select a customer</option>
                {mockCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
              )}
            </div>

            {/* Trailer Selection */}
            <div>
              <label
                htmlFor="trailer"
                className="block text-sm font-medium text-gray-700"
              >
                Trailer
              </label>
              <select
                id="trailer"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.trailer ? "border-red-500" : ""
                }`}
                value={selectedTrailer}
                onChange={(e) => setSelectedTrailer(e.target.value)}
              >
                <option value="">Select a trailer</option>
                {mockTrailers.map((trailer) => (
                  <option key={trailer.id} value={trailer.id}>
                    {trailer.name} (${trailer.dailyRate}/day)
                  </option>
                ))}
              </select>
              {errors.trailer && (
                <p className="mt-1 text-sm text-red-600">{errors.trailer}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                  value={
                    bookingData.startDate
                      ? formatDateForInput(bookingData.startDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.endDate ? "border-red-500" : ""
                  }`}
                  value={
                    bookingData.endDate
                      ? formatDateForInput(bookingData.endDate)
                      : ""
                  }
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Booking Status
              </label>
              <select
                id="status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={bookingData.status as string}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    status: e.target.value as BookingStatus,
                  }))
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Deposit Percentage */}
            <div>
              <label
                htmlFor="depositPercentage"
                className="block text-sm font-medium text-gray-700"
              >
                Deposit Percentage
              </label>
              <select
                id="depositPercentage"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={depositPercentage}
                onChange={(e) => setDepositPercentage(Number(e.target.value))}
              >
                <option value="0">0% (No Deposit)</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="100">100% (Full Payment)</option>
              </select>
            </div>

            {/* Summary */}
            {selectedTrailer && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Booking Summary
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Duration:</dt>
                  <dd className="text-gray-900">{duration} day(s)</dd>

                  <dt className="text-gray-500">Daily Rate:</dt>
                  <dd className="text-gray-900">
                    $
                    {mockTrailers
                      .find((t) => t.id === selectedTrailer)
                      ?.dailyRate.toFixed(2)}
                    /day
                  </dd>

                  <dt className="text-gray-500">Total Amount:</dt>
                  <dd className="text-gray-900">
                    ${bookingData.totalAmount?.toFixed(2)}
                  </dd>

                  <dt className="text-gray-500">Deposit (Due Now):</dt>
                  <dd className="text-gray-900">
                    ${bookingData.depositAmount?.toFixed(2)}
                  </dd>

                  <dt className="text-gray-500">Balance Due:</dt>
                  <dd className="text-gray-900">
                    $
                    {(
                      (bookingData.totalAmount || 0) -
                      (bookingData.depositAmount || 0)
                    ).toFixed(2)}
                  </dd>
                </dl>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="base">
                Create Booking
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
