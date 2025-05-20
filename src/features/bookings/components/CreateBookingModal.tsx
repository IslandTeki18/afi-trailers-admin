import React, { use, useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Booking } from "../types/booking.types";
import BookingForm from "./BookingForm";
import { fetchTrailers } from "@/features/trailers/api/fetchTrailers";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { Customer } from "@/features/customers/types/customer.types";


interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Booking) => void;
  isLoading?: boolean;
  trailers?: Trailer[];
  customers?: Customer[];
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  trailers: initialTrailers = [],
  customers
}) => {
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailers);
  const [trailersLoading, setTrailersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrailers(initialTrailers);
  }, [initialTrailers]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Schedule Trailer Rental
            </DialogTitle>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {error ? (
            <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
              {error}
              <button
                className="ml-2 text-blue-600 underline"
                onClick={() => {
                  setError(null);
                  fetchTrailers()
                    .then((data) => setTrailers(data))
                    .catch((err) => setError("Failed to load trailers."));
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <BookingForm
              customers={customers || []}
              trailers={trailers}
              onSubmit={onSubmit}
              onCancel={onClose}
              isLoading={isLoading || trailersLoading}
              variant="base"
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
