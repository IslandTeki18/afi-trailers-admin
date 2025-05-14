import React, { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { Button } from "../../../components/Button";
import { Customer } from "@/features/customers/types/customer.types";
import { Booking, BookingStatus } from "../types/booking.types";
import { Trailer } from "@/features/trailers/types/trailer.types";

// Mock trailer data - in a real app, you would fetch this from your API

interface BookingFormProps {
  customers: Customer[];
  trailers: Trailer[];
  initialValues?: Partial<Booking>;
  onSubmit: (bookingData: Partial<Booking>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "base"
    | "gray"
    | "info";
}

export const BookingForm: React.FC<BookingFormProps> = ({
  customers = [],
  trailers = [],
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  variant = "primary",
}) => {
  const [bookingData, setBookingData] = useState<Partial<Booking>>(
    initialValues || {
      status: "pending" as BookingStatus,
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      depositAmount: 0,
      totalAmount: 0,
    }
  );

  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >(initialValues?.customer?._id || "");
  const [selectedTrailerId, setSelectedTrailerId] = useState<
    string | undefined
  >(initialValues?.trailerId || "");
  const [duration, setDuration] = useState(1);
  const [depositPercentage, setDepositPercentage] = useState(25);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);

  // Filter customers when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  // Calculate rental duration whenever start or end date changes
  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );
      setDuration(days > 0 ? days : 1);
    }
  }, [bookingData.startDate, bookingData.endDate]);

  // Calculate total and deposit amounts when duration or selected trailer changes
  useEffect(() => {
    if (selectedTrailerId) {
      const trailer = trailers.find((t) => t._id === selectedTrailerId);
      if (trailer) {
        const totalAmount = trailer.rentalPrices.fullDay * duration;
        const depositAmount = (totalAmount * depositPercentage) / 100;

        setBookingData((prev) => ({
          ...prev,
          totalAmount,
          depositAmount,
          trailerId: trailer._id,
          trailerName: trailer.name,
        }));
      }
    }
  }, [selectedTrailerId, duration, depositPercentage, trailers]);

  // Update booking data when customer selection changes
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find((c) => c._id === selectedCustomerId);
      if (customer) {
        setBookingData((prev) => ({
          ...prev,
          customer,
        }));
      }
    }
  }, [selectedCustomerId, customers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomerId) {
      newErrors.customer = "Customer is required";
    }

    if (!selectedTrailerId) {
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
      new Date(bookingData.endDate) < new Date(bookingData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(bookingData);
    }
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      // Always set to 8:00 AM
      date.setHours(8, 0, 0, 0);

      setBookingData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);

      // For the duration calculation, we need exact days
      // Add one day to the calculation since end date is exclusive in our system
      // The rental is from 8am on start date to 8am on the day AFTER end date
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );

      setDuration(days > 0 ? days : 1);
    }
  }, [bookingData.startDate, bookingData.endDate]);

  // When initializing dates, ensure they're set to 8am
  useEffect(() => {
    if (!initialValues) {
      const now = new Date();
      now.setHours(8, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);

      setBookingData((prev) => ({
        ...prev,
        startDate: now,
        endDate: tomorrow,
      }));
    }
  }, [initialValues]);

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection with Search */}
      <div>
        <label
          htmlFor="customerSearch"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Customer Search
        </label>
        <input
          type="text"
          id="customerSearch"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-2"
          placeholder="Search by name, email or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="mt-1">
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700"
          >
            Select Customer
          </label>
          <select
            id="customer"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.customer ? "border-red-500" : ""
            }`}
            value={selectedCustomerId || ""}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Select a customer</option>
            {filteredCustomers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.firstName} {customer.lastName} ({customer.email})
              </option>
            ))}
          </select>
          {errors.customer && (
            <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
          )}
        </div>

        {selectedCustomerId && (
          <div className="mt-2 text-sm">
            {(() => {
              const customer = customers.find(
                (c) => c._id === selectedCustomerId
              );
              if (customer) {
                return (
                  <div className="bg-gray-50 p-3 rounded">
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {customer.phoneNumber}
                    </p>
                    {customer.address && (
                      <p className="mt-1">
                        <span className="font-medium">Address:</span>{" "}
                        {customer.address.street}, {customer.address.city},{" "}
                        {customer.address.state} {customer.address.zipCode}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </div>
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
          value={selectedTrailerId || ""}
          onChange={(e) => setSelectedTrailerId(e.target.value)}
        >
          <option value="">Select a trailer</option>
          {trailers.map((trailer) => (
            <option key={trailer._id} value={trailer._id}>
              {trailer.name} (${trailer.rentalPrices.fullDay}/day)
            </option>
          ))}
        </select>
        {errors.trailer && (
          <p className="mt-1 text-sm text-red-600">{errors.trailer}</p>
        )}
      </div>

      <div className="mb-4 p-3 bg-blue-50 text-sm rounded-md border border-blue-200">
        <p className="font-medium text-blue-800">Rental Period Info:</p>
        <p className="text-blue-700">
          Rentals run from 8:00 AM on the start date until 8:00 AM on the day{" "}
          <strong>after</strong> the end date. The end date is the last full day
          of possession.
        </p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date (8:00 AM pickup)
          </label>
          <input
            type="date"
            id="startDate"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.startDate ? "border-red-500" : ""
            }`}
            value={formatDateForInput(bookingData.startDate)}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date (last full day, return 8:00 AM next day)
          </label>
          <input
            type="date"
            id="endDate"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.endDate ? "border-red-500" : ""
            }`}
            value={formatDateForInput(bookingData.endDate)}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            min={
              bookingData.startDate
                ? formatDateForInput(bookingData.startDate)
                : ""
            }
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

      {/* Notes field */}
      {/* <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Add any special instructions or notes about this booking"
          value={bookingData.notes || ""}
          onChange={(e) =>
            setBookingData((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </div> */}

      {/* Summary */}
      {selectedTrailerId && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Booking Summary
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Pickup:</dt>
            <dd className="text-gray-900">
              {bookingData.startDate
                ? format(bookingData.startDate, "MMM d, yyyy")
                : "-"}{" "}
              at 8:00 AM
            </dd>

            <dt className="text-gray-500">Return:</dt>
            <dd className="text-gray-900">
              {bookingData.endDate
                ? format(
                    addDays(new Date(bookingData.endDate), 1),
                    "MMM d, yyyy"
                  )
                : "-"}{" "}
              at 8:00 AM
            </dd>

            <dt className="text-gray-500">Duration:</dt>
            <dd className="text-gray-900">{duration} day(s)</dd>

            <dt className="text-gray-500">Daily Rate:</dt>
            <dd className="text-gray-900">
              $
              {trailers
                .find((t) => t._id === selectedTrailerId)
                ?.rentalPrices.fullDay.toFixed(2)}
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
        {onCancel && (
          <Button type="button" variant="gray" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant={variant} disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : initialValues?._id
            ? "Update Booking"
            : "Create Booking"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
