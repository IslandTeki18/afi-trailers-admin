import React, { use, useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Booking } from "../types/booking.types";
import BookingForm from "./BookingForm";
import { fetchTrailers } from "@/features/trailers/api/fetchTrailers";
import { Trailer } from "@/features/trailers/types/trailer.types";

// Mock data for customers - in a real application, you would fetch these from your API
const mockCustomers = [
  {
    _id: "c001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "(555) 123-4567",
    dateOfBirth: new Date("1990-01-01"),
    accountStatus: "active" as const,
  },
  {
    _id: "c002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "(555) 987-6543",
    dateOfBirth: new Date("1992-03-15"),
    accountStatus: "active" as const,
  },
  {
    _id: "c003",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@example.com",
    phoneNumber: "(555) 456-7890",
    dateOfBirth: new Date("1985-07-22"),
    accountStatus: "active" as const,
  },
  {
    _id: "c004",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.b@example.com",
    phoneNumber: "(555) 567-8901",
    dateOfBirth: new Date("1988-11-30"),
    accountStatus: "active" as const,
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
  },
];

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Partial<Booking>) => void;
  isLoading?: boolean;
  trailers?: Trailer[];
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  trailers: initialTrailers = [],
}) => {
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailers);
  const [trailersLoading, setTrailersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrailers(initialTrailers);
  }, [initialTrailers])

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Create New Booking
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
              customers={mockCustomers}
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
