import { useState } from "react";
import { format } from "date-fns";
import { Drawer } from "../../../components/Drawer";
import { Button } from "../../../components/Button";
import { Trailer } from "../types/trailer.types";
import { TrailerPhotosCarousel } from "./TrailerPhotosCarousel";

// Define props for the drawer component
interface TrailerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer;
  onEdit?: (trailer: Trailer) => void;
  onDelete?: (trailerId: string) => void;
}

export const TrailerDetailsDrawer = ({
  isOpen,
  onClose,
  trailer,
  onEdit,
  onDelete
}: TrailerDetailsDrawerProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not scheduled";
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, "MMM dd, yyyy");
    }
    if (typeof date === "string") {
      return format(new Date(date), "MMM dd, yyyy");
    }
    return "Invalid date";
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Add handler for delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Add handler for confirming deletion
  const confirmDelete = () => {
    if (onDelete) {
      onDelete(trailer._id!);
      onClose(); // Close the drawer after deletion
    }
    setShowDeleteConfirm(false);
  };

  // Add handler for canceling deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${trailer.name}`}
      position="right"
      maxWidth="lg"
    >
      <div className="space-y-8 pb-6">
        {/* Trailer ID */}
        <div className="flex items-center justify-between">
          <h2 className="text-md font-semibold text-gray-900">
            Trailer ID: {trailer._id}
          </h2>
        </div>
        {/* Basic information section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <p className="mt-2 text-sm text-gray-500">{trailer.description}</p>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{trailer.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.capacity}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trailer.maintenanceStatus === "Operational"
                        ? "bg-green-100 text-green-800"
                        : trailer.maintenanceStatus === "Maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trailer.maintenanceStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Availability
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trailer.availability.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trailer.availability.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                  {!trailer.availability.isAvailable &&
                    trailer.availability.nextAvailableDate && (
                      <span className="ml-2 text-xs text-gray-500">
                        Available from:{" "}
                        {formatDate(trailer.availability.nextAvailableDate)}
                      </span>
                    )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.location.address}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Physical specs section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Physical Specifications
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Dimensions (L×W×H)
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {`${trailer.dimensions.length}m × ${trailer.dimensions.width}m × ${trailer.dimensions.height}m`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Empty Weight
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.weight.empty}kg
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Maximum Load
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.weight.maxLoad}kg
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Features</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc pl-4">
                    {trailer.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Towing Requirements
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc pl-4">
                    {trailer.towingRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Photos section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <TrailerPhotosCarousel
              photos={trailer.photos || []}
              variant="accent"
              className="rounded-md overflow-hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              {trailer.photos?.length || 0} photos available
            </p>
          </div>
        </div>

        {/* Rental information section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Rental Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Full Day Rate
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(trailer.rentalPrices.fullDay)}
                </dd>
              </div>
              {trailer.rentalPrices.halfDay && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Half Day Rate
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(trailer.rentalPrices.halfDay)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Delivery Fee
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(trailer.deliveryFee)}
                </dd>
              </div>
              {trailer.weekendSurcharge && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Weekend Surcharge
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(trailer.weekendSurcharge)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Service Types
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.serviceTypes.includes("full") && (
                    <span className="mr-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Full Service
                    </span>
                  )}
                  {trailer.serviceTypes.includes("self") && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Self Service
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.insuranceRequired ? "Required" : "Optional"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Maintenance section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Maintenance Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Maintenance
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(trailer.lastMaintenanceDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Next Scheduled Maintenance
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(trailer.nextScheduledMaintenance)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Customer feedback section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Feedback
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Average Rating
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>{trailer.ratings.averageRating.toFixed(1)}/5</span>
                    <span className="text-gray-400 ml-1">
                      ({trailer.ratings.totalReviews} reviews)
                    </span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Photos section */}
        {trailer.photos && trailer.photos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                {trailer.photos.length} photos available
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                {trailer.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center"
                  >
                    <span className="text-xs text-gray-500">{photo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-end space-x-3 p-4">
          <Button variant="error" size="medium" onClick={handleDeleteClick}>
            Delete Trailer
          </Button>
          <Button variant="gray" size="medium" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="base"
            size="medium"
            onClick={() => {
              if (onEdit) {
                onEdit(trailer);
              }
            }}
          >
            Edit Trailer
          </Button>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete trailer "{trailer.name}"? This
              action cannot be undone.
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
