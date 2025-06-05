import React, { useState, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select, SelectOption } from "@/components/Select";
import { Trailer } from "@/features/trailers/types/trailer.types";
import { TimeBlock } from "../../types/booking.types";
import { Textarea } from "@/components/Textarea";

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (timeBlock: TimeBlock) => void;
  initialData?: TimeBlock;
  trailers: Trailer[];
  isEditing?: boolean;
}

export const TimeBlockModal: React.FC<TimeBlockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  trailers,
  isEditing = false,
}) => {
  const [timeBlock, setTimeBlock] = useState<TimeBlock>(
    initialData || {
      title: "",
      reason: "",
      startDate: new Date(),
      endDate: new Date(),
      affectsAllTrailers: true,
      createdBy: "Admin", // Ideally from auth context
      createdAt: new Date(),
      isActive: true,
      color: "#FF5733", // Default color
    }
  );

  // Convert trailers to the required format for the Select component
  const trailerOptions: SelectOption[] = useMemo(
    () =>
      trailers.map((trailer) => ({
        value: trailer._id || "",
        label: trailer.name || "Unnamed Trailer",
      })),
    [trailers]
  );

  // Predefined colors in the correct format
  const colorOptions: SelectOption[] = [
    { label: "Red", value: "#FF5733" },
    { label: "Blue", value: "#3384FF" },
    { label: "Green", value: "#33FF57" },
    { label: "Purple", value: "#8333FF" },
    { label: "Orange", value: "#FFA033" },
  ];

  const handleInputChange = (field: keyof TimeBlock, value: any) => {
    setTimeBlock((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(timeBlock);
  };

  // Handler for trailer selection
  const handleTrailerSelect = (option: SelectOption) => {
    const trailer = trailers.find((t) => t._id === option.value);

    handleInputChange("trailerId", option.value);
    handleInputChange("trailerName", trailer ? trailer.name : "");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Time Block" : "Create Time Block"}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                value={timeBlock.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Maintenance, Holiday, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <Textarea
                rows={2}
                value={timeBlock.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Provide details about this time block"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(timeBlock.startDate)}
                  onChange={(e) =>
                    handleInputChange("startDate", new Date(e.target.value))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(timeBlock.endDate)}
                  onChange={(e) =>
                    handleInputChange("endDate", new Date(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={timeBlock.affectsAllTrailers}
                  onChange={(e) =>
                    handleInputChange("affectsAllTrailers", e.target.checked)
                  }
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Block all trailers
                </span>
              </label>
            </div>

            {!timeBlock.affectsAllTrailers && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trailer
                </label>
                <Select
                  id="trailer-select"
                  options={trailerOptions}
                  value={timeBlock.trailerId || ""}
                  onOptionChange={handleTrailerSelect}
                  required={!timeBlock.affectsAllTrailers}
                  variant="base"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <Select
                id="color-select"
                options={colorOptions}
                value={timeBlock.color || "#FF5733"}
                onChange={(e) => handleInputChange("color", e.target.value)}
                variant="base"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
