import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Textarea } from "../../../../components/Textarea";
import { Checkbox } from "../../../../components/Checkbox";
import { TrailerUsageHistory } from "../../types/trailer.types";

interface TrailerUsageHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (usageHistory: TrailerUsageHistory) => void;
  initialData?: TrailerUsageHistory;
  isEditing?: boolean;
}

export const TrailerUsageHistoryModal: React.FC<
  TrailerUsageHistoryModalProps
> = ({ isOpen, onClose, onSave, initialData, isEditing = false }) => {
  const defaultUsageHistory: TrailerUsageHistory = {
    _id: "",
    customerId: "",
    rentalPeriod: { start: new Date(), end: new Date() },
    totalPaid: 0,
    serviceType: "full",
  };

  const [formData, setFormData] =
    useState<TrailerUsageHistory>(defaultUsageHistory);

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultUsageHistory);
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
            {isEditing ? "Edit Usage History" : "Add Usage Record"}
          </h3>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Input
                label="Customer ID"
                id="usage-customer-id"
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
                label="Rental Start"
                id="usage-rental-start"
                name="rentalStart"
                type="date"
                value={formatDateForInput(formData.rentalPeriod.start)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rentalPeriod: {
                      ...formData.rentalPeriod,
                      start: new Date(e.target.value),
                    },
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Rental End"
                id="usage-rental-end"
                name="rentalEnd"
                type="date"
                value={formatDateForInput(formData.rentalPeriod.end)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rentalPeriod: {
                      ...formData.rentalPeriod,
                      end: new Date(e.target.value),
                    },
                  })
                }
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Total Paid ($)"
                id="usage-total-paid"
                name="totalPaid"
                type="number"
                min="0"
                step="0.01"
                value={formData.totalPaid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPaid: parseFloat(e.target.value),
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

            <div className="sm:col-span-6 border-t pt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </h4>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Rating (1-5)"
                id="usage-rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                value={formData.feedback?.rating || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    feedback: {
                      ...formData.feedback,
                      rating: parseInt(e.target.value),
                    },
                  })
                }
                variant="primary"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <Textarea
                id="usage-comment"
                value={formData.feedback?.comment || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    feedback: {
                      ...formData.feedback,
                      rating: formData.feedback?.rating || 0,
                      comment: e.target.value,
                    },
                  })
                }
                placeholder="Customer feedback"
                rows={2}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-6 border-t pt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Incident Report (Optional)
              </h4>
              <div className="flex items-center mb-2">
                <Checkbox
                  id="incident-resolved"
                  checked={formData.incidentReport?.resolved || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incidentReport: {
                        ...formData.incidentReport,
                        description: formData.incidentReport?.description || "",
                        dateReported:
                          formData.incidentReport?.dateReported || new Date(),
                        resolved: e.target.checked,
                      },
                    })
                  }
                  variant="primary"
                />
                <label
                  htmlFor="incident-resolved"
                  className="ml-2 text-sm text-gray-700"
                >
                  Incident Resolved
                </label>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Incident Description
              </label>
              <Textarea
                id="incident-description"
                value={formData.incidentReport?.description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    incidentReport: {
                      ...formData.incidentReport,
                      description: e.target.value,
                      dateReported:
                        formData.incidentReport?.dateReported || new Date(),
                      resolved: formData.incidentReport?.resolved || false,
                    },
                  })
                }
                placeholder="Describe any incidents during this rental"
                rows={3}
                variant="primary"
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
