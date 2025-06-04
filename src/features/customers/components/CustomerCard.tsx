import React from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import {
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Customer } from "../types/customer.types";
import { format } from "date-fns";

interface CustomerCardProps {
  customer: Customer;
  onView: (customerId: string) => void;
  onEdit: (customerId: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onView,
  onEdit,
}) => {
  // Format phone number in a readable way
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) return phone;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  };

  // Status badge variant mapping
  const statusVariantMap: Record<string, string> = {
    active: "success",
    inactive: "gray",
    suspended: "error",
    pending: "warning",
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
      {/* Customer Header with Avatar */}
      <div className="bg-gradient-to-r from-base-50 to-primary-50 p-4 border-b border-gray-200">
        <div className="flex items-center">
          {/* Using the Avatar component */}
          <Avatar
            alt={`${customer.firstName} ${customer.lastName}`}
            variant="primary"
            size="sm"
          />

          {/* Name and Status */}
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg font-medium text-gray-900"
                title={`${customer.firstName} ${customer.lastName}`}
              >
                {customer.firstName} {customer.lastName}
              </h3>
              <Badge
                //@ts-ignore
                variant={
                  statusVariantMap[customer.accountStatus?.toLowerCase()] ||
                  "gray"
                }
              >
                {customer.accountStatus || "Unknown"}
              </Badge>
            </div>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-600">
                Customer since{" "}
                {customer.createdAt
                  ? format(new Date(customer.createdAt), "MMM yyyy")
                  : "Unknown"}
              </p>
              {customer.verificationStatus?.isEmailVerified && (
                <CheckBadgeIcon
                  className="h-5 w-5 ml-2 text-primary-600"
                  title="Verified Email"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span
              className="font-medium text-gray-800 truncate"
              title={customer.email}
            >
              {customer.email}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-800">
              {formatPhoneNumber(customer.phoneNumber)}
            </span>
          </div>

          {customer.address &&
            (customer.address.city || customer.address.state) && (
              <div className="flex items-center text-sm">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span
                  className="font-medium text-gray-800 truncate"
                  title={`${customer.address.city}, ${customer.address.state}`}
                >
                  {customer.address.city}, {customer.address.state}
                </span>
              </div>
            )}
        </div>

        {/* Additional Info - Rentals count or membership type could go here */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-500">Rentals:</span>{" "}
              <span className="font-medium">
                {customer.rentalHistory?.length || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Payment Method:</span>{" "}
              <span className="font-medium">
                {customer.paymentMethods?.length ? "Added" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            size="small"
            onClick={() => onView(customer._id || "")}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="gray"
            size="small"
            onClick={() => onEdit(customer._id || "")}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
