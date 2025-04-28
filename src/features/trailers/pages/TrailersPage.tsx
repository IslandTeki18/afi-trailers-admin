import { TrailerList } from "../components/TrailerList";
import { Button } from "../../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const TrailersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trailer Fleet</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your trailers in one place
          </p>
        </div>
        <div>
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New Trailer
          </Button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg shadow">
        <TrailerList />
      </div>

      {/* Add Trailer Modal would be implemented here */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Trailer</h2>
            <p className="text-gray-500 mb-6">
              This would be where a form for adding a new trailer would appear.
            </p>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary">Add Trailer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
