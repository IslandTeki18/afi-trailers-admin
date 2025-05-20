import React, { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select, SelectOption } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Customer } from "@/features/customers/types/customer.types";
import { Booking, BookingStatus } from "../types/booking.types";
import { Trailer } from "@/features/trailers/types/trailer.types";

interface BookingFormProps {
  customers: Customer[];
  trailers: Trailer[];
  initialValues?: Booking;
  onSubmit: (bookingData: Booking) => void;
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
  variant = "base",
}) => {
  // Add state for single day rental
  const [isSingleDayRental, setIsSingleDayRental] = useState(false);

  const [bookingData, setBookingData] = useState<Booking>(
    initialValues || {
      status: "pending" as BookingStatus,
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      depositAmount: 0,
      totalAmount: 0,
      trailerId: "",
      trailerName: "",
      serviceType: "self",
      specialRequests: "",
      deliveryAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      hasTowingInsurance: false,
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        accountStatus: "active",
      },
    }
  );
  const [isDumpTrailer, setIsDumpTrailer] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialValues?.customer?._id || ""
  );
  const [selectedTrailerId, setSelectedTrailerId] = useState(
    initialValues?.trailerId || ""
  );
  const [duration, setDuration] = useState(1);
  const [depositPercentage, setDepositPercentage] = useState(25);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);

  // Check for single day rental on load
  useEffect(() => {
    if (initialValues && initialValues.startDate && initialValues.endDate) {
      const start = new Date(initialValues.startDate);
      const end = new Date(initialValues.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (start.getTime() === end.getTime()) {
        setIsSingleDayRental(true);
      }
    }
  }, [initialValues]);

  const customerOptions: SelectOption[] = [
    { value: "", label: "Select a customer" },
    ...filteredCustomers.map((customer) => ({
      value: customer._id as string,
      label: `${customer.firstName} ${customer.lastName} (${customer.email})`,
      customer: customer,
    })),
  ];

  const trailerOptions: SelectOption[] = [
    { value: "", label: "Select a trailer" },
    ...trailers.map((trailer) => ({
      value: trailer._id as string,
      label: `${trailer.name} ($${trailer.rentalPrices.fullDay}/day)`,
      trailer: trailer,
    })),
  ];

  const serviceTypeOptions: SelectOption[] = [
    { value: "self", label: "Self Service (Customer Pickup)" },
    { value: "full", label: "Full Service (Delivery)" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  const depositOptions: SelectOption[] = [
    { value: "0", label: "0% (No Deposit)" },
    { value: "25", label: "25%" },
    { value: "50", label: "50%" },
    { value: "100", label: "100% (Full Payment)" },
  ];

  // Initialize date values with 8am timestamps
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

  // Additional duration calculation
  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const diffTime = Math.abs(
        bookingData.endDate.getTime() - bookingData.startDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(diffDays + 1);
    }
  }, [bookingData.startDate, bookingData.endDate]);

  // Calculate total and deposit amounts when duration or selected trailer changes
  useEffect(() => {
    if (selectedTrailerId) {
      const trailer = trailers.find((t) => t._id === selectedTrailerId);
      if (trailer) {
        const totalAmount = trailer.rentalPrices.fullDay * duration;
        const depositAmount = (totalAmount * depositPercentage) / 100;

        const isDump =
          trailer.type === "Dump" ||
          trailer.name.toLowerCase().includes("dump");

        setIsDumpTrailer(isDump);

        setBookingData((prev) => ({
          ...prev,
          totalAmount,
          depositAmount,
          trailerId: trailer._id || "",
          trailerName: trailer.name,
          serviceType: isDump ? prev.serviceType : "self",
        }));
      }
    } else {
      setIsDumpTrailer(false);
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

  // Auto-fill delivery address when service type is "full" for dump trailers
  useEffect(() => {
    if (isDumpTrailer && bookingData.serviceType === "full") {
      fillDeliveryAddressFromCustomer();
    }
  }, [bookingData.serviceType, isDumpTrailer, selectedCustomerId]);

  // Function to fill delivery address from customer
  const fillDeliveryAddressFromCustomer = () => {
    if (selectedCustomerId) {
      const customer = customers.find((c) => c._id === selectedCustomerId);
      if (customer && customer.address) {
        setBookingData((prev) => ({
          ...prev,
          deliveryAddress: {
            street: customer.address?.street || "",
            city: customer.address?.city || "",
            state: customer.address?.state || "",
            zipCode: customer.address?.zipCode || "",
            country: customer.address?.country || "Australia",
          },
        }));
      }
    }
  };

  // Validate form data
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(bookingData);
    }
  };

  // Handle date change and set end date to match start date for single day rentals
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    if (!value) return;
    const date = new Date(value + "T12:00:00");

    if (field === "startDate") {
      if (isSingleDayRental) {
        setBookingData((prev) => ({
          ...prev,
          startDate: date,
          endDate: date,
        }));
      } else {
        setBookingData((prev) => ({
          ...prev,
          startDate: date,
        }));

        if (bookingData.endDate && date > bookingData.endDate) {
          const newEndDate = new Date(date);
          newEndDate.setDate(newEndDate.getDate() + 1);
          newEndDate.setHours(12, 0, 0, 0);

          setBookingData((prev) => ({
            ...prev,
            endDate: newEndDate,
          }));
        }
      }
    } else {
      if (!isSingleDayRental) {
        setBookingData((prev) => ({
          ...prev,
          [field]: date,
        }));
      }
    }
  };

  // Handle toggle of single day rental checkbox
  const handleSingleDayRentalToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;
    setIsSingleDayRental(isChecked);

    if (isChecked) {
      // When checked, set end date to match start date
      setBookingData((prev) => ({
        ...prev,
        endDate: prev.startDate,
      }));
    } else {
      // When unchecked, set end date to start date + 1 day
      setBookingData((prev) => ({
        ...prev,
        endDate: addDays(new Date(prev.startDate), 1),
      }));
    }
  };

  // Format date for input field
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="overflow-y-auto max-h-[80vh] px-1 py-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection with Search */}
        <div>
          <label
            htmlFor="customerSearch"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Search
          </label>
          <Input
            type="text"
            id="customerSearch"
            className="mb-2"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant={variant}
          />

          <div className="mt-1">
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-gray-700"
            >
              Select Customer
            </label>
            <Select
              id="customer"
              options={customerOptions}
              className="mt-1"
              value={selectedCustomerId || ""}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              variant={errors.customer ? "error" : variant}
            />
            {errors.customer && (
              <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
            )}
          </div>

          {/* Customer info display remains unchanged */}
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
          <Select
            id="trailer"
            options={trailerOptions}
            className="mt-1"
            value={selectedTrailerId || ""}
            onChange={(e) => setSelectedTrailerId(e.target.value)}
            variant={errors.trailer ? "error" : variant}
          />
          {errors.trailer && (
            <p className="mt-1 text-sm text-red-600">{errors.trailer}</p>
          )}
        </div>

        {/* Service Type Selection */}
        {isDumpTrailer && (
          <div>
            <label
              htmlFor="serviceType"
              className="block text-sm font-medium text-gray-700"
            >
              Service Type
            </label>
            <Select
              id="serviceType"
              options={serviceTypeOptions}
              className="mt-1"
              value={bookingData.serviceType || "self"}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  serviceType: e.target.value as "full" | "self",
                }))
              }
              variant={errors.serviceType ? "error" : variant}
            />
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
            )}
          </div>
        )}

        {/* Rental Period Info */}
        <div className="mb-4 p-3 bg-blue-50 text-sm rounded-md border border-blue-200">
          <p className="font-medium text-blue-800">Rental Period Info:</p>
          <p className="text-blue-700">
            Rentals run from 8:00 AM on the start date until 8:00 AM on the day{" "}
            <strong>after</strong> the end date. The end date is the last full
            day of possession.
          </p>
        </div>

        {/* Dates section with single day rental option */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Rental Period
          </h3>

          {/* Single Day Rental Checkbox */}
          <div className="flex items-center mb-4">
            <input
              id="singleDayRental"
              name="singleDayRental"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isSingleDayRental}
              onChange={handleSingleDayRentalToggle}
            />
            <label
              htmlFor="singleDayRental"
              className="ml-2 block text-sm text-gray-700"
            >
              Single day rental (same day pickup and return)
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Pick-up Date
              </label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                variant={errors.startDate ? "error" : variant}
                className="mt-1"
                value={formatDateForInput(bookingData.startDate)}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* Hide end date input if single day rental */}
            {!isSingleDayRental && (
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Day of Use
                </label>
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  variant={errors.endDate ? "error" : variant}
                  className="mt-1"
                  value={formatDateForInput(bookingData.endDate)}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  required
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Return trailer by 8:00 AM on{" "}
                  {bookingData.endDate
                    ? format(
                        addDays(new Date(bookingData.endDate), 1),
                        "MMM d, yyyy"
                      )
                    : "[select date]"}
                </p>
              </div>
            )}

            {/* Show single day return info if single day rental */}
            {isSingleDayRental && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Return Date (Same Day)
                </label>
                <div className="mt-1 text-sm text-gray-500 border border-gray-200 rounded-md p-2 bg-gray-50">
                  <p>
                    <strong>
                      Return by 8:00 PM on{" "}
                      {bookingData.startDate
                        ? format(new Date(bookingData.startDate), "MMM d, yyyy")
                        : "[select date]"}
                    </strong>
                  </p>
                  <p className="mt-1 text-xs">
                    For single day rentals, the trailer must be returned by 8:00
                    PM on the same day.
                  </p>
                </div>
              </div>
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
          <Select
            id="status"
            options={statusOptions}
            className="mt-1"
            value={bookingData.status as string}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                status: e.target.value as BookingStatus,
              }))
            }
            variant={variant}
          />
        </div>

        {/* Deposit Percentage */}
        <div>
          <label
            htmlFor="depositPercentage"
            className="block text-sm font-medium text-gray-700"
          >
            Deposit Percentage
          </label>
          <Select
            id="depositPercentage"
            options={depositOptions}
            className="mt-1"
            value={depositPercentage.toString()}
            onChange={(e) => setDepositPercentage(Number(e.target.value))}
            variant={variant}
          />
        </div>

        {/* Special Requests */}
        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700"
          >
            Special Requests
          </label>
          <Textarea
            id="specialRequests"
            rows={3}
            variant={variant}
            placeholder="Any special instructions or requests"
            value={bookingData.specialRequests || ""}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                specialRequests: e.target.value,
              }))
            }
          />
        </div>

        {/* Delivery Address - Show only if "full" service is selected */}
        {isDumpTrailer && bookingData.serviceType === "full" && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Delivery Address
            </h3>
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={fillDeliveryAddressFromCustomer}
            >
              Use Customer Address
            </Button>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="deliveryStreet"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street
                </label>
                <Input
                  type="text"
                  id="deliveryStreet"
                  variant={errors.deliveryAddress ? "error" : variant}
                  value={bookingData.deliveryAddress?.street || ""}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      deliveryAddress: {
                        ...(prev.deliveryAddress! || {}),
                        street: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryCity"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <Input
                  type="text"
                  id="deliveryCity"
                  variant={variant}
                  value={bookingData.deliveryAddress?.city || ""}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      deliveryAddress: {
                        ...(prev.deliveryAddress! || {}),
                        city: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryState"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <Input
                  type="text"
                  id="deliveryState"
                  variant={variant}
                  value={bookingData.deliveryAddress?.state || ""}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      deliveryAddress: {
                        ...(prev.deliveryAddress! || {}),
                        state: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryZipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <Input
                  type="text"
                  id="deliveryZipCode"
                  variant={variant}
                  value={bookingData.deliveryAddress?.zipCode || ""}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      deliveryAddress: {
                        ...(prev.deliveryAddress! || {}),
                        zipCode: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="deliveryCountry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <Input
                  type="text"
                  id="deliveryCountry"
                  variant={variant}
                  value={bookingData.deliveryAddress?.country || "Australia"}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      deliveryAddress: {
                        ...(prev.deliveryAddress! || {}),
                        country: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            {errors.deliveryAddress && (
              <p className="mt-2 text-sm text-red-600">
                {errors.deliveryAddress}
              </p>
            )}
          </div>
        )}

        {/* Insurance Purchase Option */}
        <div className="flex items-center">
          <input
            id="insurancePurchased"
            name="insurancePurchased"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={bookingData.hasTowingInsurance || false}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                insurancePurchased: e.target.checked,
              }))
            }
          />
          <label
            htmlFor="insurancePurchased"
            className="ml-2 block text-sm text-gray-700"
          >
            Purchase insurance coverage
          </label>
        </div>

        {/* Summary */}
        {selectedTrailerId && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Booking Summary
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">Start Date:</dt>
              <dd className="text-gray-900">
                {bookingData.startDate
                  ? format(bookingData.startDate, "MMM d, yyyy")
                  : "-"}{" "}
                at 8:00 AM
              </dd>

              <dt className="text-gray-500">End Date:</dt>
              <dd className="text-gray-900">
                {bookingData.endDate
                  ? format(bookingData.endDate, "MMM d, yyyy")
                  : "-"}
              </dd>

              <dt className="text-gray-500">Duration:</dt>
              <dd className="text-gray-900">{duration} day(s)</dd>

              <dt className="text-gray-500">Charged Days:</dt>
              <dd className="text-gray-900">
                {bookingData.startDate && bookingData.endDate ? (
                  <span>
                    {format(bookingData.startDate, "MMM d")} to{" "}
                    {format(
                      new Date(
                        new Date(bookingData.endDate).setDate(
                          bookingData.endDate.getDate() - 1
                        )
                      ),
                      "MMM d"
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </dd>

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

        {/* Submit and Cancel Buttons */}
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
    </div>
  );
};

export default BookingForm;
