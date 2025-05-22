import { Input } from "@/components/Input";
import { Booking } from "@/features/bookings/types/booking.types";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { format, addDays } from "date-fns";

type RentalPeriodStepProps = {
  isSingleDayRental: boolean;
  bookingData: Booking;
  errors: Record<string, string>;
  variant:
    | "base"
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "gray"
    | "info";
  trailers: Trailer[];
  selectedTrailerId: string;
  formatDateForInput: (date: Date | undefined) => string;
  duration: number;
  onSingleDayRentalToggle: (checked: boolean) => void;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
};

export const RentalPeriodStep = ({
  isSingleDayRental,
  bookingData,
  errors,
  variant,
  trailers,
  selectedTrailerId,
  formatDateForInput,
  duration,
  onSingleDayRentalToggle,
  onDateChange,
}: RentalPeriodStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h2 className="font-medium text-lg text-blue-800 mb-2">
          Step 2: Rental Period
        </h2>
        <p className="text-blue-700 text-sm">
          Select the rental period for this booking.
        </p>
      </div>

      {/* Rental Period Info */}
      <div className="p-3 bg-amber-50 text-sm rounded-md border border-amber-200">
        <p className="font-medium text-amber-800">Rental Period Info:</p>
        <p className="text-amber-700">
          Rentals run from 8:00 AM on the start date until 8:00 AM on the day{" "}
          <strong>after</strong> the end date. The end date is the last full day
          of possession.
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
            onChange={(e) => onSingleDayRentalToggle(e.target.checked)}
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
              onChange={(e) => onDateChange("startDate", e.target.value)}
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
                onChange={(e) => onDateChange("endDate", e.target.value)}
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

      {/* Availability warning */}
      {errors.availability && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-medium">Availability Conflict</p>
          <p>{errors.availability}</p>
        </div>
      )}

      {/* Rental summary */}
      {selectedTrailerId && (
        <div className="bg-gray-50 p-4 rounded-md mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Rental Summary
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Start Date:</dt>
            <dd className="text-gray-900">
              {bookingData.startDate
                ? format(new Date(bookingData.startDate), "MMM d, yyyy")
                : "-"}{" "}
              at 8:00 AM
            </dd>

            <dt className="text-gray-500">End Date:</dt>
            <dd className="text-gray-900">
              {bookingData.endDate
                ? format(new Date(bookingData.endDate), "MMM d, yyyy")
                : "-"}
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

            <dt className="text-gray-500">Estimated Total:</dt>
            <dd className="text-gray-900">
              ${bookingData.totalAmount?.toFixed(2)}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
};
