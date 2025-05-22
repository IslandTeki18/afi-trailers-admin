import { Booking } from "../../../types/booking.types";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { Customer } from "@/features/customers/types/customer.types";
import { format, addDays } from "date-fns";

type ReviewStepProps = {
  bookingData: Booking;
  selectedCustomerId: string | null;
  selectedTrailerId: string | null;
  customers: Customer[];
  trailers: Trailer[];
  isSingleDayRental: boolean;
  isDumpTrailer: boolean;
  duration: number;
  depositPercentage: number;
};

export const ReviewStep = (props: ReviewStepProps) => {
  const customer = props.customers.find(
    (c) => c._id === props.selectedCustomerId
  );
  const trailer = props.trailers.find((t) => t._id === props.selectedTrailerId);
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h2 className="font-medium text-lg text-blue-800 mb-2">
          Step 4: Review Booking
        </h2>
        <p className="text-blue-700 text-sm">
          Please review all details before submitting your booking.
        </p>
      </div>

      {/* Customer details */}
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Customer Information
        </h3>
        {customer && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Name:</dt>
            <dd className="text-gray-900">
              {customer.firstName} {customer.lastName}
            </dd>
            <dt className="text-gray-500">Email:</dt>
            <dd className="text-gray-900">{customer.email}</dd>
            <dt className="text-gray-500">Phone:</dt>
            <dd className="text-gray-900">{customer.phoneNumber}</dd>
          </dl>
        )}
      </div>

      {/* Trailer details */}
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Trailer Information
        </h3>
        {trailer && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">Name:</dt>
            <dd className="text-gray-900">{trailer.name}</dd>
            <dt className="text-gray-500">Type:</dt>
            <dd className="text-gray-900">{trailer.type}</dd>
            <dt className="text-gray-500">Daily Rate:</dt>
            <dd className="text-gray-900">
              ${trailer.rentalPrices.fullDay}/day
            </dd>
            {props.isDumpTrailer && (
              <>
                <dt className="text-gray-500">Service Type:</dt>
                <dd className="text-gray-900">
                  {props.bookingData.serviceType === "full"
                    ? "Full Service (Delivery)"
                    : "Self Service (Customer Pickup)"}
                </dd>
              </>
            )}
          </dl>
        )}
      </div>

      {/* Rental details */}
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Rental Information
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Pick-up Date:</dt>
          <dd className="text-gray-900">
            {props.bookingData.startDate
              ? format(new Date(props.bookingData.startDate), "MMMM d, yyyy")
              : "-"}{" "}
            at 8:00 AM
          </dd>

          <dt className="text-gray-500">Return By:</dt>
          <dd className="text-gray-900">
            {props.isSingleDayRental
              ? `${
                  props.bookingData.startDate
                    ? format(
                        new Date(props.bookingData.startDate),
                        "MMMM d, yyyy"
                      )
                    : "-"
                } at 8:00 PM`
              : `${
                  props.bookingData.endDate
                    ? format(
                        addDays(new Date(props.bookingData.endDate), 1),
                        "MMMM d, yyyy"
                      )
                    : "-"
                } at 8:00 AM`}
          </dd>

          <dt className="text-gray-500">Duration:</dt>
          <dd className="text-gray-900">{props.duration} day(s)</dd>

          <dt className="text-gray-500">Status:</dt>
          <dd className="text-gray-900">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                props.bookingData.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : props.bookingData.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {props.bookingData.status.charAt(0).toUpperCase() +
                props.bookingData.status.slice(1)}
            </span>
          </dd>
        </dl>
      </div>

      {/* Financial details */}
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Financial Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Daily Rate:</dt>
          <dd className="text-gray-900">
            ${trailer?.rentalPrices.fullDay.toFixed(2)}/day
          </dd>

          <dt className="text-gray-500">Total Amount:</dt>
          <dd className="text-gray-900 font-medium">
            ${props.bookingData.totalAmount?.toFixed(2)}
          </dd>

          <dt className="text-gray-500">
            Deposit ({props.depositPercentage}%):
          </dt>
          <dd className="text-gray-900">
            ${props.bookingData.depositAmount?.toFixed(2)}
          </dd>

          <dt className="text-gray-500">Balance Due:</dt>
          <dd className="text-gray-900 font-medium">
            $
            {(
              (props.bookingData.totalAmount || 0) -
              (props.bookingData.depositAmount || 0)
            ).toFixed(2)}
          </dd>
        </dl>
      </div>

      {/* Additional details */}
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Additional Details
        </h3>
        <dl className="grid grid-cols-1 gap-y-2 text-sm">
          <dt className="text-gray-500">Special Requests:</dt>
          <dd className="text-gray-900">
            {props.bookingData.specialRequests || (
              <span className="text-gray-400 italic">No special requests</span>
            )}
          </dd>

          <dt className="text-gray-500">Towing Insurance:</dt>
          <dd className="text-gray-900">
            {props.bookingData.hasTowingInsurance ? "Yes" : "No"}
          </dd>

          {props.isDumpTrailer && props.bookingData.serviceType === "full" && (
            <>
              <dt className="text-gray-500">Delivery Address:</dt>
              <dd className="text-gray-900">
                {props.bookingData.deliveryAddress?.street},{" "}
                {props.bookingData.deliveryAddress?.city},{" "}
                {props.bookingData.deliveryAddress?.state}{" "}
                {props.bookingData.deliveryAddress?.zipCode}
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};
