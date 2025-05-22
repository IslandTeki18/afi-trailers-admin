import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Stepper } from "@/components/Stepper";
import { Customer } from "@/features/customers/types/customer.types";
import { Booking, BookingStatus } from "../../types/booking.types";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { isTrailerAvailable } from "../../utils/isTrailerAvailable";
import { CustomerTrailerStep } from "./views/CustomerTrailerStep";
import { RentalPeriodStep } from "./views/RentalPeriodStep";
import { DetailsStep } from "./views/DetailsStep";
import { ReviewStep } from "./views/ReviewStep";
import { ConfirmationStep } from "./views/ConfirmationStep";

enum BookingFormStep {
  CustomerTrailer = 0,
  RentalPeriod = 1,
  Details = 2,
  Review = 3,
  Confirmation = 4,
}

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
  existingBookings?: Booking[];
  initialDate?: Date;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  customers = [],
  trailers = [],
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  variant = "base",
  existingBookings = [],
  initialDate,
}) => {
  const [currentStep, setCurrentStep] = useState<BookingFormStep>(
    BookingFormStep.CustomerTrailer
  );
  const [isSingleDayRental, setIsSingleDayRental] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialValues?.customer?._id || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingData, setBookingData] = useState<Booking>(() => {
    if (initialValues) {
      return initialValues;
    }

    const startDate = initialDate ? new Date(initialDate) : new Date();
    startDate.setHours(8, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(8, 0, 0, 0);

    return {
      status: "pending" as BookingStatus,
      startDate,
      endDate,
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
    };
  });
  const [isDumpTrailer, setIsDumpTrailer] = useState(false);
  const [duration, setDuration] = useState(1);
  const [depositPercentage, setDepositPercentage] = useState(25);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState(
    initialValues?.trailerId || ""
  );

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

  // Check trailer availability when selected trailer or dates change
  useEffect(() => {
    if (errors.availability) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.availability;
        return newErrors;
      });
    }

    if (selectedTrailerId && bookingData.startDate && bookingData.endDate) {
      const isAvailable = checkTrailerAvailability();

      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          availability: "This trailer is already booked for the selected dates",
        }));
      }
    }
  }, [selectedTrailerId, bookingData.startDate, bookingData.endDate]);

  // Check trailer availability when selected trailer or dates change
  useEffect(() => {
    if (errors.availability) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.availability;
        return newErrors;
      });
    }

    if (selectedTrailerId && bookingData.startDate && bookingData.endDate) {
      const isAvailable = checkTrailerAvailability();

      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          availability: "This trailer is already booked for the selected dates",
        }));
      }
    }
  }, [selectedTrailerId, bookingData.startDate, bookingData.endDate]);

  // Check trailer availability
  const checkTrailerAvailability = () => {
    if (!selectedTrailerId || !bookingData.startDate || !bookingData.endDate) {
      return true; // Can't check without all details
    }

    return isTrailerAvailable(
      selectedTrailerId,
      bookingData.startDate,
      bookingData.endDate,
      existingBookings,
      initialValues?._id
    );
  };

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
            country: customer.address?.country || "United States",
          },
        }));
      }
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

  // Step validation functions
  const validateCustomerTrailerStep = () => {
    const stepErrors: Record<string, string> = {};

    if (!selectedCustomerId) {
      stepErrors.customer = "Customer is required";
    }

    if (!selectedTrailerId) {
      stepErrors.trailer = "Trailer is required";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateRentalPeriodStep = () => {
    const stepErrors: Record<string, string> = {};

    if (!bookingData.startDate) {
      stepErrors.startDate = "Pick-up date is required";
    }

    if (!bookingData.endDate) {
      stepErrors.endDate = "Last day of use is required";
    } else if (
      bookingData.startDate &&
      bookingData.endDate &&
      new Date(bookingData.endDate) < new Date(bookingData.startDate)
    ) {
      stepErrors.endDate = "Last day of use must be after pick-up date";
    }

    // Add availability check
    if (selectedTrailerId && bookingData.startDate && bookingData.endDate) {
      if (!checkTrailerAvailability()) {
        stepErrors.availability =
          "This trailer is already booked for the selected dates";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Form validation
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

    // Add availability check
    if (selectedTrailerId && bookingData.startDate && bookingData.endDate) {
      if (!checkTrailerAvailability()) {
        newErrors.availability =
          "This trailer is already booked for the selected dates";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case BookingFormStep.CustomerTrailer:
        isValid = validateCustomerTrailerStep();
        break;
      case BookingFormStep.RentalPeriod:
        isValid = validateRentalPeriodStep();
        break;
      case BookingFormStep.Details:
        isValid = true; // No required fields in this step
        break;
      case BookingFormStep.Review:
        // Submit the form when moving from Review
        handleSubmitForm();
        isValid = true;
        break;
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Form submission
  const handleSubmitForm = () => {
    setFormSubmitted(true);
    if (validateForm()) {
      onSubmit(bookingData);
    }
  };

  // Data change handlers - these ensure data flows back to parent state
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleTrailerSelect = (trailerId: string) => {
    setSelectedTrailerId(trailerId);
  };

  const handleServiceTypeChange = (serviceType: "full" | "self") => {
    setBookingData((prev) => ({
      ...prev,
      serviceType,
    }));
  };

  const handleSingleDayRentalToggle = (checked: boolean) => {
    setIsSingleDayRental(checked);

    if (checked) {
      // When checked, set end date to match start date
      setBookingData((prev) => ({
        ...prev,
        endDate: prev.startDate,
      }));
    } else {
      // When unchecked, set end date to start date + 1 day
      setBookingData((prev) => ({
        ...prev,
        endDate: new Date(new Date(prev.startDate).getTime() + 86400000), // Add 1 day in milliseconds
      }));
    }
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    if (!value) return;
    const date = new Date(value);
    date.setHours(8, 0, 0, 0);

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

        // If start date is after end date, adjust end date
        if (bookingData.endDate && date > bookingData.endDate) {
          const newEndDate = new Date(date);
          newEndDate.setDate(newEndDate.getDate() + 1);
          setBookingData((prev) => ({
            ...prev,
            endDate: newEndDate,
          }));
        }
      }
    } else {
      setBookingData((prev) => ({
        ...prev,
        endDate: date,
      }));
    }
  };

  const handleBookingDataChange = (field: keyof Booking, value: any) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Set up steps for the stepper
  const steps = [
    {
      id: "1",
      name: "Customer & Trailer",
      href: "#",
      status:
        currentStep === BookingFormStep.CustomerTrailer
          ? "current"
          : currentStep > BookingFormStep.CustomerTrailer
          ? "complete"
          : ("upcoming" as "current" | "complete" | "upcoming"),
    },
    {
      id: "2",
      name: "Rental Period",
      href: "#",
      status:
        currentStep === BookingFormStep.RentalPeriod
          ? "current"
          : currentStep > BookingFormStep.RentalPeriod
          ? "complete"
          : ("upcoming" as "current" | "complete" | "upcoming"),
    },
    {
      id: "3",
      name: "Details",
      href: "#",
      status:
        currentStep === BookingFormStep.Details
          ? "current"
          : currentStep > BookingFormStep.Details
          ? "complete"
          : ("upcoming" as "current" | "complete" | "upcoming"),
    },
    {
      id: "4",
      name: "Review",
      href: "#",
      status:
        currentStep === BookingFormStep.Review
          ? "current"
          : currentStep > BookingFormStep.Review
          ? "complete"
          : ("upcoming" as "current" | "complete" | "upcoming"),
    },
    {
      id: "5",
      name: "Confirmation",
      href: "#",
      status:
        currentStep === BookingFormStep.Confirmation
          ? "current"
          : ("upcoming" as "current" | "complete" | "upcoming"),
    },
  ];

  return (
    <div className="overflow-y-auto max-h-[80vh] px-1 py-2">
      {/* Stepper component */}
      <div className="mb-8">
        <Stepper steps={steps} variant="primary" />
      </div>

      <div className="space-y-6">
        {/* Step Content - Show only the current step */}
        {currentStep === BookingFormStep.CustomerTrailer && (
          <CustomerTrailerStep
            initialValues={initialValues}
            bookingData={bookingData}
            customers={customers}
            filteredCustomers={filteredCustomers}
            trailers={trailers}
            errors={errors}
            selectedCustomerId={selectedCustomerId}
            selectedTrailerId={selectedTrailerId}
            isDumpTrailer={isDumpTrailer}
            variant={variant}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCustomerSelect={handleCustomerSelect}
            onTrailerSelect={handleTrailerSelect}
            onServiceTypeChange={handleServiceTypeChange}
          />
        )}

        {currentStep === BookingFormStep.RentalPeriod && (
          <RentalPeriodStep
            bookingData={bookingData}
            isSingleDayRental={isSingleDayRental}
            errors={errors}
            duration={duration}
            variant={variant}
            trailers={trailers}
            selectedTrailerId={selectedTrailerId}
            formatDateForInput={formatDateForInput}
            onSingleDayRentalToggle={handleSingleDayRentalToggle}
            onDateChange={handleDateChange}
          />
        )}

        {currentStep === BookingFormStep.Details && (
          <DetailsStep
            bookingData={bookingData}
            variant={variant}
            depositPercentage={depositPercentage}
            isDumpTrailer={isDumpTrailer}
            fillDeliveryAddressFromCustomer={fillDeliveryAddressFromCustomer}
            errors={errors}
            onBookingDataChange={handleBookingDataChange}
            onDepositPercentageChange={setDepositPercentage}
          />
        )}

        {currentStep === BookingFormStep.Review && (
          <ReviewStep
            bookingData={bookingData}
            selectedCustomerId={selectedCustomerId}
            selectedTrailerId={selectedTrailerId}
            customers={customers}
            trailers={trailers}
            isSingleDayRental={isSingleDayRental}
            isDumpTrailer={isDumpTrailer}
            duration={duration}
            depositPercentage={depositPercentage}
          />
        )}

        {currentStep === BookingFormStep.Confirmation && (
          <ConfirmationStep
            bookingData={bookingData}
            initialValues={initialValues}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <div>
            {currentStep > BookingFormStep.CustomerTrailer &&
              currentStep < BookingFormStep.Confirmation && (
                <Button type="button" variant="gray" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
          </div>

          <div className="flex space-x-3">
            {onCancel && currentStep < BookingFormStep.Confirmation && (
              <Button type="button" variant="gray" onClick={onCancel}>
                Cancel
              </Button>
            )}

            {currentStep < BookingFormStep.Review && (
              <Button type="button" variant={variant} onClick={handleNext}>
                Next
              </Button>
            )}

            {currentStep === BookingFormStep.Review && (
              <Button
                type="button"
                variant={variant}
                onClick={handleNext}
                disabled={isLoading || !!errors.availability}
                title={
                  errors.availability
                    ? "Cannot submit: Trailer is already booked for these dates"
                    : ""
                }
              >
                {isLoading
                  ? "Saving..."
                  : initialValues?._id
                  ? "Update Booking"
                  : "Create Booking"}
              </Button>
            )}

            {currentStep === BookingFormStep.Confirmation && (
              <Button
                type="button"
                variant={variant}
                onClick={onCancel || (() => {})}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
