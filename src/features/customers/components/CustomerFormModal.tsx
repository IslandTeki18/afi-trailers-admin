import React, { useState, useRef } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/Textarea";
import { Customer } from "../types/customer.types";
import { Button } from "@/components/Button";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => void;
  initialData?: Customer;
  isEditing?: boolean;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const isSubmitting = useRef(false);
  const defaultCustomer: Customer = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: new Date(),
    accountStatus: "active",
    verificationStatus: {
      isEmailVerified: false,
      isPhoneVerified: false,
    },
  };

  const [formData, setFormData] = useState<Customer>(
    initialData || defaultCustomer
  );
  const [rentalHistoryItem, setRentalHistoryItem] = useState<string>("");
  const [paymentMethodItem, setPaymentMethodItem] = useState<string>("");
  const [favoriteTrailerItem, setFavoriteTrailerItem] = useState<string>("");

  const accountStatusOptions = [
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
    { value: "inactive", label: "Inactive" },
  ];

  const stateOptions = [
    { value: "", label: "Select State" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "District of Columbia" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const parentValue = formData[parent as keyof Customer];

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
        const parentValue = formData[parent as keyof Customer] as any;

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
        [name]: value ? new Date(value) : new Date(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleSelectChange = (
    option: { value: string; label: string },
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: option.value,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      notes: e.target.value,
    });
  };

  const handleArrayItemAdd = (
    arrayName: "rentalHistory" | "paymentMethods" | "favoriteTrailers",
    item: string
  ) => {
    if (!item.trim()) return;

    if (arrayName === "favoriteTrailers") {
      // We need to handle the nested structure for favorite trailers
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          favoriteTrailers: [
            ...(formData.preferences?.favoriteTrailers || []),
            item,
          ],
        },
      });
      setFavoriteTrailerItem("");
    } else {
      // For rentalHistory and paymentMethods which are direct arrays
      setFormData({
        ...formData,
        [arrayName]: [...(formData[arrayName] || []), item],
      });

      if (arrayName === "rentalHistory") {
        setRentalHistoryItem("");
      } else if (arrayName === "paymentMethods") {
        setPaymentMethodItem("");
      }
    }
  };

  const handleArrayItemRemove = (
    arrayName: "rentalHistory" | "paymentMethods" | "favoriteTrailers",
    index: number
  ) => {
    if (arrayName === "favoriteTrailers") {
      // Handle nested structure removal
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          favoriteTrailers: formData.preferences?.favoriteTrailers?.filter(
            (_, i) => i !== index
          ),
        },
      });
    } else {
      // Handle direct array removal
      setFormData({
        ...formData,
        [arrayName]: formData[arrayName]?.filter((_, i) => i !== index),
      });
    }
  };

  const handleNotificationPreference = (
    type: "email" | "sms",
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        notificationPreferences: {
          ...(formData.preferences?.notificationPreferences || {
            email: false,
            sms: false,
          }),
          [type]: checked,
        },
      },
    });
  };

  const handleVerificationStatus = (
    type: "isEmailVerified" | "isPhoneVerified",
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      verificationStatus: {
        ...(formData.verificationStatus || {
          isEmailVerified: false,
          isPhoneVerified: false,
        }),
        [type]: checked,
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

  // Format date for date inputs
  const formatDateForInput = (date: Date | string | undefined | null) => {
    if (!date) return "";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Customer" : "Add New Customer"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update customer information"
                : "Fill in the details to add a new customer"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Basic Information Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Basic Information
              </h4>
            </div>

            <div className="sm:col-span-3">
              <Input
                label="First Name"
                id="first-name"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                placeholder="Enter first name"
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Last Name"
                id="last-name"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                placeholder="Enter last name"
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter email address"
                variant="primary"
                required
              />
              <div className="mt-2 flex items-center">
                <Checkbox
                  id="email-verified"
                  checked={
                    formData.verificationStatus?.isEmailVerified || false
                  }
                  onChange={(e) =>
                    handleVerificationStatus(
                      "isEmailVerified",
                      e.target.checked
                    )
                  }
                  variant="primary"
                />
                <label
                  htmlFor="email-verified"
                  className="ml-2 text-sm text-gray-700"
                >
                  Email verified
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Phone Number"
                id="phone-number"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                variant="primary"
                required
              />
              <div className="mt-2 flex items-center">
                <Checkbox
                  id="phone-verified"
                  checked={
                    formData.verificationStatus?.isPhoneVerified || false
                  }
                  onChange={(e) =>
                    handleVerificationStatus(
                      "isPhoneVerified",
                      e.target.checked
                    )
                  }
                  variant="primary"
                />
                <label
                  htmlFor="phone-verified"
                  className="ml-2 text-sm text-gray-700"
                >
                  Phone verified
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Date of Birth"
                id="date-of-birth"
                name="dateOfBirth"
                type="date"
                value={formatDateForInput(formData.dateOfBirth)}
                onChange={handleChange}
                variant="primary"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                label="Account Status"
                id="account-status"
                name="accountStatus"
                value={formData.accountStatus || "active"}
                onChange={handleChange}
                onOptionChange={handleSelectChange}
                options={accountStatusOptions}
                variant="primary"
                required
              />
            </div>

            {/* Address Information Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Address Information
              </h4>
            </div>

            <div className="sm:col-span-6">
              <Input
                label="Street Address"
                id="street-address"
                name="address.street"
                value={formData.address?.street || ""}
                onChange={handleChange}
                placeholder="Enter street address"
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="City"
                id="city"
                name="address.city"
                value={formData.address?.city || ""}
                onChange={handleChange}
                placeholder="Enter city"
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                label="State"
                id="state"
                name="address.state"
                value={formData.address?.state || ""}
                onChange={handleChange}
                onOptionChange={handleSelectChange}
                options={stateOptions}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Zip Code"
                id="zip-code"
                name="address.zipCode"
                value={formData.address?.zipCode || ""}
                onChange={handleChange}
                placeholder="Enter zip code"
                variant="primary"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                label="Country"
                id="country"
                name="address.country"
                value={formData.address?.country || "USA"}
                onChange={handleChange}
                placeholder="Enter country"
                variant="primary"
              />
            </div>

            {/* Driver's License Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Driver's License
              </h4>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="License Number"
                id="license-number"
                name="driverLicense.number"
                value={formData.driverLicense?.number || ""}
                onChange={handleChange}
                placeholder="Enter license number"
                variant="primary"
              />
            </div>

            <div className="sm:col-span-2">
              <Select
                label="License State"
                id="license-state"
                name="driverLicense.state"
                value={formData.driverLicense?.state || ""}
                onChange={handleChange}
                onOptionChange={handleSelectChange}
                options={stateOptions}
                variant="primary"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="License Expiration"
                id="license-expiration"
                name="driverLicense.expirationDate"
                type="date"
                value={formatDateForInput(
                  formData.driverLicense?.expirationDate
                )}
                onChange={handleChange}
                variant="primary"
              />
            </div>

            {/* Preferences Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Notification Preferences
              </h4>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Checkbox
                  id="email-notifications"
                  checked={
                    formData.preferences?.notificationPreferences?.email ||
                    false
                  }
                  onChange={(e) =>
                    handleNotificationPreference("email", e.target.checked)
                  }
                  variant="primary"
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-2 text-gray-700"
                >
                  Email Notifications
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Checkbox
                  id="sms-notifications"
                  checked={
                    formData.preferences?.notificationPreferences?.sms || false
                  }
                  onChange={(e) =>
                    handleNotificationPreference("sms", e.target.checked)
                  }
                  variant="primary"
                />
                <label
                  htmlFor="sms-notifications"
                  className="ml-2 text-gray-700"
                >
                  SMS Notifications
                </label>
              </div>
            </div>

            {/* Favorite Trailers Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Favorite Trailers
              </h4>
            </div>

            <div className="sm:col-span-6">
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="favorite-trailer-input"
                  value={favoriteTrailerItem}
                  onChange={(e) => setFavoriteTrailerItem(e.target.value)}
                  placeholder="Add a favorite trailer"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayItemAdd("favoriteTrailers", favoriteTrailerItem)
                  }
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.preferences?.favoriteTrailers &&
                formData.preferences?.favoriteTrailers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.preferences.favoriteTrailers.map(
                      (item, index) => (
                        <div
                          key={`favorite-trailer-${index}`}
                          className="flex items-center rounded-full bg-indigo-100 py-1 px-3"
                        >
                          <span className="text-sm text-indigo-800">
                            {item}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayItemRemove("favoriteTrailers", index)
                            }
                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>

            {/* Rental History Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Rental History
              </h4>
            </div>

            <div className="sm:col-span-6">
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="rental-history-input"
                  value={rentalHistoryItem}
                  onChange={(e) => setRentalHistoryItem(e.target.value)}
                  placeholder="Add rental history item"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayItemAdd("rentalHistory", rentalHistoryItem)
                  }
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.rentalHistory && formData.rentalHistory.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.rentalHistory.map((item, index) => (
                    <div
                      key={`rental-history-${index}`}
                      className="flex items-center rounded-full bg-indigo-100 py-1 px-3"
                    >
                      <span className="text-sm text-indigo-800">{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleArrayItemRemove("rentalHistory", index)
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

            {/* Payment Methods Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Payment Methods
              </h4>
            </div>

            <div className="sm:col-span-6">
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="payment-method-input"
                  value={paymentMethodItem}
                  onChange={(e) => setPaymentMethodItem(e.target.value)}
                  placeholder="Add payment method"
                  className="flex-1"
                  variant="primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayItemAdd("paymentMethods", paymentMethodItem)
                  }
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              {formData.paymentMethods &&
                formData.paymentMethods.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.paymentMethods.map((item, index) => (
                      <div
                        key={`payment-method-${index}`}
                        className="flex items-center rounded-full bg-indigo-100 py-1 px-3"
                      >
                        <span className="text-sm text-indigo-800">{item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleArrayItemRemove("paymentMethods", index)
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

            {/* Notes Section */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-700 mb-2 pb-2 border-b">
                Notes
              </h4>
            </div>

            <div className="sm:col-span-6">
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={handleTextareaChange}
                placeholder="Enter any additional notes about this customer"
                rows={3}
                variant="primary"
              />
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <Button
            type="button"
            variant="base"
            className="w-full sm:w-auto sm:ml-3"
            onClick={handleSubmitClick}
          >
            {isEditing ? "Update Customer" : "Add Customer"}
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
