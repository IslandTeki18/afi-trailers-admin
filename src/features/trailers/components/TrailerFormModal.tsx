import React, { useState, useRef } from "react";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Checkbox } from "../../../components/Checkbox";
import { Textarea } from "../../../components/Textarea";
import { Trailer } from "../types/trailer.types";
import { Button } from "../../../components/Button";

interface TrailerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Trailer) => void;
  initialData?: Trailer;
  isEditing?: boolean;
}

export const TrailerFormModal: React.FC<TrailerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const isSubmitting = useRef(false);
  const defaultTrailer: Trailer = {
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
    lastMaintenanceDate: null,
    nextScheduledMaintenance: null,
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
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    photos: [],
    availability: {
      isAvailable: true,
      nextAvailableDate: undefined,
    },
    bookedDates: [],
    usageHistory: [],
    ratings: {
      averageRating: 0,
      totalReviews: 0,
    },
  };

  const [formData, setFormData] = useState<Trailer>(
    (initialData || defaultTrailer) as Trailer
  );

  // State for array inputs that need special handling
  const [feature, setFeature] = useState<string>("");
  const [towReq, setTowReq] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const trailerTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "Dump", label: "Dump Trailer" },
    { value: "Enclosed", label: "Enclosed Trailer" },
    { value: "Flatbed", label: "Flatbed Trailer" },
    { value: "Utility", label: "Utility Trailer" },
  ];

  const maintenanceStatusOptions = [
    { value: "Operational", label: "Operational" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Out of Service", label: "Out of Service" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(e.target);
    const { name, value, type } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const parentValue = formData[parent as keyof Trailer];

        setFormData({
          ...formData,
          [parent]: {
            ...(typeof parentValue === "object" && parentValue !== null
              ? parentValue
              : {}),
            [child]: type === "number" ? parseFloat(value) : value,
          },
        });
      } else if (parts.length === 3) {
        const [parent, middle, child] = parts;
        const parentValue = formData[parent as keyof Trailer] as any;

        setFormData({
          ...formData,
          [parent]: {
            ...(typeof parentValue === "object" && parentValue !== null
              ? parentValue
              : {}),
            [middle]: {
              ...(parentValue && typeof parentValue[middle] === "object"
                ? parentValue[middle]
                : {}),
              [child]: type === "number" ? parseFloat(value) : value,
            },
          },
        });
      }
    } else if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else if (type === "date") {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleOptionChange = (
    option: { value: string; label: string },
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: option.value,
    });

    if (name === "type") {
      const typeSpecificFeatures: Record<string, string[]> = {
        Dump: ["Heavy duty", "Hydraulic lift"],
        Enclosed: ["Weather protection", "Lockable"],
        Flatbed: ["Tie-down points", "Ramps"],
        Utility: ["Multi-purpose", "Light weight"],
      };

      if (typeSpecificFeatures[option.value]) {
        if (!formData.features || formData.features.length === 0) {
          setFormData((prev) => ({
            ...prev,
            features: typeSpecificFeatures[option.value],
          }));
        }
      }
    }

    if (name === "maintenanceStatus") {
      if (option.value === "Maintenance") {
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

        setFormData((prev) => ({
          ...prev,
          availability: {
            ...prev.availability,
            isAvailable: false,
            nextAvailableDate: twoWeeksFromNow,
          },
        }));
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  const handleArrayItemAdd = (
    arrayName: "features" | "towingRequirements" | "photos",
    item: string
  ) => {
    if (!item.trim()) return;

    setFormData({
      ...formData,
      [arrayName]: [...(formData[arrayName] || []), item],
    });

    if (arrayName === "features") {
      setFeature("");
    } else if (arrayName === "towingRequirements") {
      setTowReq("");
    } else if (arrayName === "photos") {
      setPhotoUrl("");
    }
  };

  const handleArrayItemRemove = (
    arrayName: "features" | "towingRequirements" | "photos",
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

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        isAvailable,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      onSubmit(formData);
    } finally {
      setTimeout(() => {
        isSubmitting.current = false;
      }, 100);
    }
  };

  const handleSubmitClick = () => {
    if (isSubmitting.current) return;
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
                onOptionChange={handleOptionChange}
                options={trailerTypeOptions}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <span className="">Description</span>
              <Textarea
                id="description"
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
                label="Length (feet)"
                id="dimensions-length"
                name="dimensions.length"
                type="number"
                value={formData.dimensions?.length || 0}
                onChange={handleChange}
                variant="primary"
                required
                step={1}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Width (feet)"
                id="dimensions-width"
                name="dimensions.width"
                type="number"
                value={formData.dimensions?.width || 0}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Height (feet)"
                id="dimensions-height"
                name="dimensions.height"
                type="number"
                value={formData.dimensions?.height || 0}
                onChange={handleChange}
                variant="primary"
                required
                step={1}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Capacity"
                id="capacity"
                name="capacity"
                value={formData.capacity || ""}
                onChange={handleChange}
                placeholder="e.g. 15000 lbs"
                variant="primary"
                required
                step={1}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Empty Weight (lbs)"
                id="weight-empty"
                name="weight.empty"
                type="number"
                value={formData.weight?.empty || 0}
                onChange={handleChange}
                variant="primary"
                required
                step={1}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Maximum Load (lbs)"
                id="weight-maxLoad"
                name="weight.maxLoad"
                type="number"
                value={formData.weight?.maxLoad || 0}
                onChange={handleChange}
                variant="primary"
                required
                step={1}
              />
            </div>

            {/* Location Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Location
              </h4>
            </div>

            <div className="sm:col-span-6">
              <Input
                label="Address"
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
                label="Latitude"
                id="location-coordinates-latitude"
                name="location.coordinates.latitude"
                type="number"
                step="0.000001"
                value={formData.location?.coordinates?.latitude || 0}
                onChange={handleChange}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Longitude"
                id="location-coordinates-longitude"
                name="location.coordinates.longitude"
                type="number"
                step="0.000001"
                value={formData.location?.coordinates?.longitude || 0}
                onChange={handleChange}
                variant="primary"
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

            <div className="sm:col-span-2">
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

            {/* Availability Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Availability
              </h4>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Checkbox
                  id="availability-available"
                  checked={formData.availability?.isAvailable || false}
                  onChange={() => handleAvailabilityToggle(true)}
                  variant="primary"
                />
                <label
                  htmlFor="availability-available"
                  className="ml-2 text-gray-700"
                >
                  Available for Rental
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Checkbox
                  id="availability-unavailable"
                  checked={formData.availability?.isAvailable === false}
                  onChange={() => handleAvailabilityToggle(false)}
                  variant="primary"
                />
                <label
                  htmlFor="availability-unavailable"
                  className="ml-2 text-gray-700"
                >
                  Unavailable
                </label>
              </div>
            </div>

            {formData.availability?.isAvailable === false && (
              <div className="sm:col-span-3">
                <Input
                  label="Next Available Date"
                  id="next-available-date"
                  name="availability.nextAvailableDate"
                  type="date"
                  value={
                    formData.availability.nextAvailableDate
                      ? new Date(formData.availability.nextAvailableDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  variant="primary"
                />
              </div>
            )}

            {/* Maintenance Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Maintenance
              </h4>
            </div>

            <div className="sm:col-span-6 flex flex-col space-y-4">
              <div>
                <Select
                  label="Maintenance Status"
                  id="maintenanceStatus"
                  name="maintenanceStatus"
                  value={formData.maintenanceStatus || "Operational"}
                  onChange={handleChange}
                  onOptionChange={handleOptionChange}
                  options={maintenanceStatusOptions}
                  variant="primary"
                  required
                />
              </div>

              <div>
                <Input
                  label="Last Maintenance Date"
                  id="lastMaintenanceDate"
                  name="lastMaintenanceDate"
                  type="date"
                  value={
                    formData.lastMaintenanceDate
                      ? new Date(formData.lastMaintenanceDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  variant="primary"
                />
              </div>

              <div>
                <Input
                  label="Next Scheduled Maintenance"
                  id="nextScheduledMaintenance"
                  name="nextScheduledMaintenance"
                  type="date"
                  value={
                    formData.nextScheduledMaintenance
                      ? new Date(formData.nextScheduledMaintenance)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  variant="primary"
                />
              </div>
            </div>

            {/* Photos Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Photos
              </h4>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Trailer Photos
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="photo-url-input"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter photo URL"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() => handleArrayItemAdd("photos", photoUrl)}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.photos && formData.photos.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {formData.photos.map((url, index) => (
                    <div key={`photo-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Trailer ${index + 1}`}
                        className="h-24 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove("photos", index)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Types Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Service Types
              </h4>
            </div>

            <div className="sm:col-span-6">
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
            type="button"
            variant="base"
            className="w-full sm:w-auto sm:ml-3"
            onClick={handleSubmitClick}
          >
            {isEditing ? "Update Trailer" : "Add Trailer"}
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
