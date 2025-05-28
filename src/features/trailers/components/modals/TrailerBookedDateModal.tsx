import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { TrailerBookedDates } from "../../types/trailer.types";

interface TrailerBookedDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookedDate: TrailerBookedDates) => void;
  initialData?: TrailerBookedDates;
  isEditing?: boolean;
}

export const TrailerBookedDateModal: React.FC<TrailerBookedDateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false,
}) => {
  const defaultBookedDate: TrailerBookedDates = {
    startDate: new Date(),
    endDate: new Date(),
    customerId: "",
    bookingId: "",
    timeStamp: new Date(),
    serviceType: "full",
    status: "pending",
  };

  const [formData, setFormData] =
    useState<TrailerBookedDates>(defaultBookedDate);

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultBookedDate);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDateForInput = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? "Edit Booking" : "Add New Booking"}
          </h3>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input
                label="Start Date"
                id="booking-start-date"
                name="startDate"
                type="date"
                value={formatDateForInput(formData.startDate)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: new Date(e.target.value),
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="End Date"
                id="booking-end-date"
                name="endDate"
                type="date"
                value={formatDateForInput(formData.endDate)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: new Date(e.target.value),
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Customer ID"
                id="booking-customer-id"
                name="customerId"
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Booking ID"
                id="booking-id"
                name="bookingId"
                value={formData.bookingId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingId: e.target.value,
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceType: e.target.value as "full" | "self",
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="full">Full Service</option>
                <option value="self">Self Service</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "confirmed"
                      | "pending"
                      | "cancelled",
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <Input
                label="Timestamp"
                id="booking-timestamp"
                name="timeStamp"
                type="datetime-local"
                value={
                  formData.timeStamp instanceof Date
                    ? formData.timeStamp.toISOString().slice(0, 16)
                    : new Date(formData.timeStamp).toISOString().slice(0, 16)
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeStamp: new Date(e.target.value),
                  })
                }
                variant="primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <Button
            type="submit"
            variant="base"
            className="w-full sm:w-auto sm:ml-3"
          >
            {isEditing ? "Update" : "Add"}
          </Button>
          <Button
            type="button"
            variant="gray"
            onClick={onClose}
            className="mt-3 w-full sm:mt-0 sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
