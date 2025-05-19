import { useState } from "react";
import { format } from "date-fns";
import { Drawer } from "@/components/Drawer";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Customer } from "../types/customer.types";
import { Badge } from "@/components/Badge";

interface CustomerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}

export const CustomerDetailsDrawer = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onDelete,
}: CustomerDetailsDrawerProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Format date helper function
  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "Not available";
    try {
      if (typeof date === "string") {
        return format(new Date(date), "MMM dd, yyyy");
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Phone number formatter
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) return phone;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "suspended":
        return <Badge variant="warning">Suspended</Badge>;
      case "inactive":
        return <Badge variant="error">Inactive</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  // Get avatar variant based on customer status
  const getAvatarVariant = (
    status: string
  ): "success" | "warning" | "error" | "gray" => {
    switch (status) {
      case "active":
        return "success";
      case "suspended":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "gray";
    }
  };

  // Handler for delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handler for confirming deletion
  const confirmDelete = () => {
    if (onDelete && customer._id) {
      onDelete(customer._id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  // Handler for canceling deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Customer ID: ${customer._id}`}
      position="right"
      maxWidth="lg"
    >
      <div className="space-y-8 pb-6">
        {/* Customer Avatar and Basic Info Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
          <div className="mb-4 sm:mb-0 flex-shrink-0">
            <Avatar
              alt={`${customer.firstName} ${customer.lastName}`}
              variant={getAvatarVariant(customer.accountStatus)}
              size="md"
            />
          </div>
          <div className="w-full">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between">
              <div className="md:pr-4 max-w-full">
                <h2 className="text-xl font-semibold text-gray-900 break-words">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-md text-gray-500 mt-1 break-words">
                  {customer.email}
                </p>
                <div className="mt-2">
                  {getStatusBadge(customer.accountStatus)}
                </div>
              </div>
            </div>
            <div className="md:text-left mt-4 md:min-w-[200px] flex-shrink-0">
              {customer.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Member since: {formatDate(customer.createdAt)}
                </p>
              )}
              {customer.lastLogin && (
                <p className="text-sm text-gray-500 mt-1">
                  Last login: {formatDate(customer.lastLogin)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 break-words">
                  {customer.firstName} {customer.lastName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 flex flex-wrap items-center gap-1">
                  <span className="break-all">
                    {formatPhoneNumber(customer.phoneNumber)}
                  </span>
                  {customer.verificationStatus?.isPhoneVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 flex flex-wrap items-center gap-1">
                  <span className="break-all">{customer.email}</span>
                  {customer.verificationStatus?.isEmailVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Address Section */}
        {customer.address && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Address Information
            </h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Street</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.address.street}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.address.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.address.state}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Zip Code
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.address.zipCode}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.address.country}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Driver's License Section */}
        {customer.driverLicense && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Driver's License
            </h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    License Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.driverLicense.number}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.driverLicense.state}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Expiration Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(customer.driverLicense.expirationDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {customer.preferences && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Notification Preferences
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="list-disc pl-4">
                      {customer.preferences.notificationPreferences.email && (
                        <li>Email notifications</li>
                      )}
                      {customer.preferences.notificationPreferences.sms && (
                        <li>SMS notifications</li>
                      )}
                    </ul>
                  </dd>
                </div>
                {customer.preferences.favoriteTrailers &&
                  customer.preferences.favoriteTrailers.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Favorite Trailers
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <ul className="list-disc pl-4">
                          {customer.preferences.favoriteTrailers.map(
                            (trailer, index) => (
                              <li key={index}>{trailer}</li>
                            )
                          )}
                        </ul>
                      </dd>
                    </div>
                  )}
              </dl>
            </div>
          </div>
        )}

        {/* Rental History Section */}
        {customer.rentalHistory && customer.rentalHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Rental History
            </h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl>
                <dt className="text-sm font-medium text-gray-500">
                  Previous Rentals
                </dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-4 text-sm text-gray-900">
                    {customer.rentalHistory.map((rental, index) => (
                      <li key={index} className="mb-1">
                        {rental}
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        {customer.paymentMethods && customer.paymentMethods.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Methods
            </h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl>
                <dt className="text-sm font-medium text-gray-500">
                  Saved Payment Methods
                </dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-4 text-sm text-gray-900">
                    {customer.paymentMethods.map((method, index) => (
                      <li key={index} className="mb-1">
                        {method}
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
        )}

        {/* Notes Section */}
        {customer.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {customer.notes}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <Button variant="error" size="medium" onClick={handleDeleteClick}>
            Delete Customer
          </Button>
          <Button variant="gray" size="medium" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="base"
            size="medium"
            onClick={() => onEdit && onEdit(customer)}
          >
            Edit Customer
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {customer.firstName}{" "}
              {customer.lastName}'s account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="gray" size="medium" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="error" size="medium" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
