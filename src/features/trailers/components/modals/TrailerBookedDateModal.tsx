import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Select, SelectOption } from "../../../../components/Select";
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

  const [formData, setFormData] = useState<TrailerBookedDates>(
    initialData || defaultBookedDate
  );

  // Define options for select inputs
  const serviceTypeOptions: SelectOption[] = [
    { value: "full", label: "Full Service" },
    { value: "self", label: "Self Service" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultBookedDate);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const formatDateTimeForInput = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
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
                    startDate: e.target.value
                      ? new Date(e.target.value)
                      : new Date(),
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
                    endDate: e.target.value
                      ? new Date(e.target.value)
                      : new Date(),
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
                value={formData.customerId || ""}
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
                value={formData.bookingId || ""}
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
              <Select
                id="booking-service-type"
                label="Service Type"
                options={serviceTypeOptions}
                value={formData.serviceType || "full"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceType: e.target.value as "full" | "self",
                  })
                }
                onOptionChange={(option) =>
                  setFormData({
                    ...formData,
                    serviceType: option.value as "full" | "self",
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                id="booking-status"
                label="Status"
                options={statusOptions}
                value={formData.status || "pending"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "confirmed"
                      | "pending"
                      | "cancelled",
                  })
                }
                onOptionChange={(option) =>
                  setFormData({
                    ...formData,
                    status: option.value as
                      | "confirmed"
                      | "pending"
                      | "cancelled",
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <Input
                label="Timestamp"
                id="booking-timestamp"
                name="timeStamp"
                type="datetime-local"
                value={formatDateTimeForInput(formData.timeStamp)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeStamp: e.target.value
                      ? new Date(e.target.value)
                      : new Date(),
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
