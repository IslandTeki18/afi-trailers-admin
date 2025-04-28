import { format } from "date-fns";
import { Drawer } from "../../../components/Drawer";
import { Trailer } from "../types/trailer.types";

// Define props for the drawer component
interface TrailerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer;
}

export const TrailerDetailsDrawer = ({
  isOpen,
  onClose,
  trailer,
}: TrailerDetailsDrawerProps) => {
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${trailer.name} (ID: ${trailer._id})`}
      position="right"
      maxWidth="lg"
    >
      <div className="space-y-8 pb-6">
        {/* Basic information section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{trailer.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {trailer.description || "No description available"}
                </dd>
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
        <div className="mt-8 flex justify-end space-x-3 bg-gray-50 p-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Edit Trailer
          </button>
        </div>
      </div>
    </Drawer>
  );
};
