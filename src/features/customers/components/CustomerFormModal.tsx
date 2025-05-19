import React, { useState, useRef } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/Textarea";
import { Customer } from "../types/customer.types";
import { Button } from "@/components/Button";
import { stateOptions } from "../utils/defaultConstants";
import { accountStatusOptions } from "../utils/defaultConstants";

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
    accountStatus: "active",
    verificationStatus: {
      isEmailVerified: false,
      isPhoneVerified: false,
    },
  };

  const [formData, setFormData] = useState<Customer>(
    initialData || defaultCustomer
  );
  const [paymentMethodItem, setPaymentMethodItem] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

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
    fieldName: string
  ) => {

    if (fieldName.includes(".")) {
      const parts = fieldName.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        const parentValue = formData[parent as keyof Customer];

        setFormData((prevData) => ({
          ...prevData,
          [parent]: {
            ...(typeof parentValue === "object" && parentValue !== null
              ? parentValue
              : {}),
            [child]: option.value,
          },
        }));
      } else if (parts.length === 3) {
        const [parent, middle, child] = parts;
        const parentValue = formData[parent as keyof Customer] as any;

        setFormData((prevData) => ({
          ...prevData,
          [parent]: {
            ...(typeof parentValue === "object" && parentValue !== null
              ? parentValue
              : {}),
            [middle]: {
              ...(parentValue && typeof parentValue[middle] === "object"
                ? parentValue[middle]
                : {}),
              [child]: option.value,
            },
          },
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: option.value,
      }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      notes: e.target.value,
    });
  };

  const handleArrayItemAdd = (arrayName: "paymentMethods", item: string) => {
    if (!item.trim()) return;

    setFormData({
      ...formData,
      [arrayName]: [...(formData[arrayName] || []), item],
    });

    if (arrayName === "paymentMethods") {
      setPaymentMethodItem("");
    }
  };

  const handleArrayItemRemove = (
    arrayName: "paymentMethods",
    index: number
  ) => {
    setFormData({
      ...formData,
      [arrayName]: formData[arrayName]?.filter((_, i) => i !== index),
    });
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

    // Check required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "accountStatus",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof Customer]
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

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
              <Select
                label="Account Status"
                id="account-status"
                name="accountStatus"
                value={formData.accountStatus || "active"}
                onChange={handleChange}
                onOptionChange={(option) =>
                  handleSelectChange(option, "accountStatus")
                }
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
                onOptionChange={(option) =>
                  handleSelectChange(option, "address.state")
                }
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
                onOptionChange={(option) =>
                  handleSelectChange(option, "driverLicense.state")
                }
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
            type="submit"
            variant="base"
            className="w-full sm:w-auto sm:ml-3"
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
