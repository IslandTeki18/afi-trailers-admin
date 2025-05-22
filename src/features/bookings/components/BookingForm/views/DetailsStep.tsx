import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import {
  statusOptions,
  depositOptions,
} from "../../../utils/bookingFormDefaults";
import {
  Booking,
  BookingStatus,
} from "@/features/bookings/types/booking.types";

type DetailsStepProps = {
  bookingData: Booking;
  variant:
    | "base"
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "gray"
    | "info";
  depositPercentage: number;
  isDumpTrailer: boolean;
  fillDeliveryAddressFromCustomer: () => void;
  errors: Record<string, string>;
  onBookingDataChange: (field: keyof Booking, value: any) => void;
  onDepositPercentageChange: (value: number) => void;
};

export const DetailsStep = ({
  bookingData,
  variant,
  depositPercentage,
  isDumpTrailer,
  fillDeliveryAddressFromCustomer,
  errors,
  onBookingDataChange,
  onDepositPercentageChange,
}: DetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h2 className="font-medium text-lg text-blue-800 mb-2">
          Step 3: Additional Details
        </h2>
        <p className="text-blue-700 text-sm">
          Set booking status, deposit information, and special requests.
        </p>
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
            onBookingDataChange("status", e.target.value as BookingStatus)
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
          onChange={(e) => onDepositPercentageChange(Number(e.target.value))}
          variant={variant}
        />
        <p className="text-xs text-gray-500 mt-1">
          This will be {depositPercentage}% of the total rental amount ($
          {bookingData.depositAmount?.toFixed(2)})
        </p>
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
            onBookingDataChange("specialRequests", e.target.value)
          }
        />
      </div>

      {/* Insurance Purchase Option */}
      <div className="flex items-center p-4 bg-gray-50 rounded-md">
        <input
          id="hasTowingInsurance"
          name="hasTowingInsurance"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={bookingData.hasTowingInsurance || false}
          onChange={(e) =>
            onBookingDataChange("hasTowingInsurance", e.target.checked)
          }
        />
        <label
          htmlFor="hasTowingInsurance"
          className="ml-2 block text-sm text-gray-700"
        >
          Customer has towing insurance coverage
        </label>
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
            className="mb-4"
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
                  onBookingDataChange("deliveryAddress", {
                    ...(bookingData.deliveryAddress || {}),
                    street: e.target.value,
                  })
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
                  onBookingDataChange("deliveryAddress", {
                    ...(bookingData.deliveryAddress || {}),
                    city: e.target.value,
                  })
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
                  onBookingDataChange("deliveryAddress", {
                    ...(bookingData.deliveryAddress || {}),
                    state: e.target.value,
                  })
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
                  onBookingDataChange("deliveryAddress", {
                    ...(bookingData.deliveryAddress || {}),
                    zipCode: e.target.value,
                  })
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
    </div>
  );
};
