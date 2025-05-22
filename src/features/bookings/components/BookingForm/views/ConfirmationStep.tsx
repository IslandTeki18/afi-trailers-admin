import { Booking } from "@/features/bookings/types/booking.types";

type ConfirmationStepProps = {
    bookingData: Booking;
    initialValues?: Booking;
};

export const ConfirmationStep = (props: ConfirmationStepProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-medium text-gray-900">
        Booking Confirmed!
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        The booking has been successfully{" "}
        {props.initialValues ? "updated" : "created"}.
      </p>
      <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 text-left">
        <h3 className="text-sm font-medium text-gray-800 mb-2">
          Booking Summary
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {props.bookingData._id && (
            <>
              <dt className="text-gray-500">Booking ID:</dt>
              <dd className="text-gray-900">{props.bookingData._id}</dd>
            </>
          )}

          <dt className="text-gray-500">Customer:</dt>
          <dd className="text-gray-900">
            {props.bookingData.customer?.firstName} {props.bookingData.customer?.lastName}
          </dd>

          <dt className="text-gray-500">Trailer:</dt>
          <dd className="text-gray-900">{props.bookingData.trailerName}</dd>

          <dt className="text-gray-500">Total Amount:</dt>
          <dd className="text-gray-900 font-medium">
            ${props.bookingData.totalAmount?.toFixed(2)}
          </dd>
        </dl>
      </div>
    </div>
  );
};