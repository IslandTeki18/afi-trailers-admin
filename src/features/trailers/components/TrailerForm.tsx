import React, { useState } from "react";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Checkbox } from "../../../components/Checkbox";
import { Textarea } from "../../../components/Textarea";
import { Trailer } from "../types/trailer.types";
import { Button } from "../../../components/Button";

interface TrailerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Trailer>) => void;
  initialData?: Partial<Trailer>;
  isEditing?: boolean;
}

export const TrailerForm: React.FC<TrailerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const defaultTrailer: Partial<Trailer> = {
    name: "",
    capacity: "",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    description: "",
    type: "",
    rentalPrices: {
      fullDay: 0,
      halfDay: 0,
    },
    deliveryFee: 0,
    weekendSurcharge: 0,
    maintenanceStatus: "Operational",
    features: [],
    insuranceRequired: false,
    towingRequirements: [],
    serviceTypes: [],
    weight: {
      empty: 0,
      maxLoad: 0,
    },
    location: {
      address: "",
    },
  };

  const [formData, setFormData] = useState<Partial<Trailer>>(
    initialData || defaultTrailer
  );

  // State for array inputs that need special handling
  const [feature, setFeature] = useState<string>("");
  const [towReq, setTowReq] = useState<string>("");

  const trailerTypeOptions = [
    { value: "Box", label: "Box Trailer" },
    { value: "Flatbed", label: "Flatbed" },
    { value: "Car", label: "Car Trailer" },
    { value: "Utility", label: "Utility Trailer" },
    { value: "Horse", label: "Horse Float" },
    { value: "Refrigerated", label: "Refrigerated Trailer" },
    { value: "Tanker", label: "Tanker" },
  ];

  const maintenanceStatusOptions = [
    { value: "Operational", label: "Operational" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Out of Service", label: "Out of Service" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof Partial<Trailer>],
          [child]: type === "number" ? parseFloat(value) : value,
        },
      });
    } else if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  const handleArrayItemAdd = (
    arrayName: "features" | "towingRequirements",
    item: string
  ) => {
    if (!item.trim()) return;

    setFormData({
      ...formData,
      [arrayName]: [...(formData[arrayName] || []), item],
    });

    if (arrayName === "features") {
      setFeature("");
    } else {
      setTowReq("");
    }
  };

  const handleArrayItemRemove = (
    arrayName: "features" | "towingRequirements",
    index: number
  ) => {
    setFormData({
      ...formData,
      [arrayName]: formData[arrayName]?.filter((_, i) => i !== index),
    });
  };

  const handleServiceTypeToggle = (type: "full" | "self") => {
    const currentTypes = formData.serviceTypes || [];

    if (currentTypes.includes(type)) {
      setFormData({
        ...formData,
        serviceTypes: currentTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        serviceTypes: [...currentTypes, type],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Trailer" : "Add New Trailer"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update the details for this trailer"
                : "Fill in the details to add a new trailer to your fleet"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Basic Information Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Basic Information
              </h4>
            </div>

            <div className="sm:col-span-4">
              <Input
                label="Trailer Name"
                id="trailer-name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Enter trailer name"
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Select
                label="Trailer Type"
                id="trailer-type"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                options={trailerTypeOptions}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <Textarea
                value={formData.description || ""}
                onChange={handleTextareaChange}
                placeholder="Enter a detailed description of the trailer"
                rows={3}
                variant="primary"
              />
            </div>

            {/* Dimensions Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Dimensions & Capacity
              </h4>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Length (meters)"
                id="dimensions-length"
                name="dimensions.length"
                type="number"
                step="0.01"
                value={formData.dimensions?.length || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Width (meters)"
                id="dimensions-width"
                name="dimensions.width"
                type="number"
                step="0.01"
                value={formData.dimensions?.width || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Height (meters)"
                id="dimensions-height"
                name="dimensions.height"
                type="number"
                step="0.01"
                value={formData.dimensions?.height || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Capacity"
                id="capacity"
                name="capacity"
                value={formData.capacity || ""}
                onChange={handleChange}
                placeholder="e.g. 500kg"
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Location Address"
                id="location-address"
                name="location.address"
                value={formData.location?.address || ""}
                onChange={handleChange}
                placeholder="Enter trailer location"
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Empty Weight (kg)"
                id="weight-empty"
                name="weight.empty"
                type="number"
                value={formData.weight?.empty || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Maximum Load (kg)"
                id="weight-maxLoad"
                name="weight.maxLoad"
                type="number"
                value={formData.weight?.maxLoad || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            {/* Rental Information Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Rental Information
              </h4>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Full Day Rate ($)"
                id="rentalPrices-fullDay"
                name="rentalPrices.fullDay"
                type="number"
                step="0.01"
                min="0"
                value={formData.rentalPrices?.fullDay || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Half Day Rate ($)"
                id="rentalPrices-halfDay"
                name="rentalPrices.halfDay"
                type="number"
                step="0.01"
                min="0"
                value={formData.rentalPrices?.halfDay || 0}
                onChange={handleChange}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Delivery Fee ($)"
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryFee || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Weekend Surcharge ($)"
                id="weekendSurcharge"
                name="weekendSurcharge"
                type="number"
                step="0.01"
                min="0"
                value={formData.weekendSurcharge || 0}
                onChange={handleChange}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                label="Maintenance Status"
                id="maintenanceStatus"
                name="maintenanceStatus"
                value={formData.maintenanceStatus || "Operational"}
                onChange={handleChange}
                options={maintenanceStatusOptions}
                variant="primary"
                required
              />
            </div>

            {/* Service Types Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Service Types
              </h4>
              <div className="mt-2 space-y-2 flex flex-col">
                <div className="flex items-center">
                  <Checkbox
                    id="service-type-full"
                    checked={formData.serviceTypes?.includes("full") || false}
                    onChange={() => handleServiceTypeToggle("full")}
                    variant="primary"
                  />
                  <label
                    htmlFor="service-type-full"
                    className="ml-2 text-gray-700"
                  >
                    Full Service (with delivery)
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="service-type-self"
                    checked={formData.serviceTypes?.includes("self") || false}
                    onChange={() => handleServiceTypeToggle("self")}
                    variant="primary"
                  />
                  <label
                    htmlFor="service-type-self"
                    className="ml-2 text-gray-700"
                  >
                    Self Service (pickup)
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-center">
                <Checkbox
                  id="insuranceRequired"
                  name="insuranceRequired"
                  checked={formData.insuranceRequired || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insuranceRequired: e.target.checked,
                    })
                  }
                  variant="primary"
                />
                <label
                  htmlFor="insuranceRequired"
                  className="ml-2 text-gray-700"
                >
                  Insurance Required
                </label>
              </div>
            </div>

            {/* Features Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Features & Requirements
              </h4>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="feature-input"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() => handleArrayItemAdd("features", feature)}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.features && formData.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.features.map((item, index) => (
                    <div
                      key={`feature-${index}`}
                      className="flex items-center rounded-full bg-indigo-100 py-1 px-3"
                    >
                      <span className="text-sm text-indigo-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove("features", index)}
                        className="ml-2 text-indigo-600 hover:text-indigo-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Towing Requirements
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="towing-requirement-input"
                  value={towReq}
                  onChange={(e) => setTowReq(e.target.value)}
                  placeholder="Add a towing requirement"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayItemAdd("towingRequirements", towReq)
                  }
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.towingRequirements &&
                formData.towingRequirements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.towingRequirements.map((item, index) => (
                      <div
                        key={`tow-req-${index}`}
                        className="flex items-center rounded-full bg-indigo-100 py-1 px-3"
                      >
                        <span className="text-sm text-indigo-800">{item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleArrayItemRemove("towingRequirements", index)
                          }
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto sm:ml-3"
          >
            {isEditing ? "Update Trailer" : "Add Trailer"}
          </Button>
          <Button
            type="button"
            variant="secondary"
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
