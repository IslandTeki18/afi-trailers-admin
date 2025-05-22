import { Input } from "@/components/Input";
import { Select, SelectOption } from "@/components/Select";
import { Customer } from "@/features/customers/types/customer.types";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { Booking } from "@/features/bookings/types/booking.types";
import { serviceTypeOptions } from "@/features/bookings/utils/bookingFormDefaults";

type CustomerTrailerStepProps = {
  initialValues?: Booking;
  variant:
    | "base"
    | "error"
    | "primary"
    | "secondary"
    | "accent"
    | "gray"
    | "info";
  customers: Customer[];
  filteredCustomers: Customer[];
  trailers: Trailer[];
  errors: Record<string, string>;
  bookingData: Booking;
  isDumpTrailer: boolean;
  selectedCustomerId: string;
  selectedTrailerId: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCustomerSelect: (customerId: string) => void;
  onTrailerSelect: (trailerId: string) => void;
  onServiceTypeChange: (serviceType: "full" | "self") => void;
};

export const CustomerTrailerStep = ({
  variant,
  customers,
  filteredCustomers,
  trailers,
  errors,
  bookingData,
  isDumpTrailer,
  selectedCustomerId,
  selectedTrailerId,
  searchTerm,
  onSearchChange,
  onCustomerSelect,
  onTrailerSelect,
  onServiceTypeChange,
}: CustomerTrailerStepProps) => {
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

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h2 className="font-medium text-lg text-blue-800 mb-2">
          Step 1: Select Customer and Trailer
        </h2>
        <p className="text-blue-700 text-sm">
          Choose the customer and trailer for this booking.
        </p>
      </div>

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
          onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onCustomerSelect(e.target.value)}
            variant={errors.customer ? "error" : variant}
          />
          {errors.customer && (
            <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
          )}
        </div>

        {/* Customer info display */}
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
          onChange={(e) => onTrailerSelect(e.target.value)}
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
              onServiceTypeChange(e.target.value as "full" | "self")
            }
            variant={errors.serviceType ? "error" : variant}
          />
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
          )}
        </div>
      )}

      {/* Selected trailer info */}
      {selectedTrailerId && (
        <div className="bg-gray-50 p-3 rounded mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected Trailer
          </h3>
          {(() => {
            const trailer = trailers.find((t) => t._id === selectedTrailerId);
            if (trailer) {
              return (
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {trailer.name}
                  </p>
                  <p>
                    <span className="font-medium">Daily Rate:</span> $
                    {trailer.rentalPrices.fullDay}/day
                  </p>
                  {trailer.dimensions && (
                    <p>
                      <span className="font-medium">Dimensions:</span>{" "}
                      {trailer.dimensions.length}' x {trailer.dimensions.width}'
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
  );
};
