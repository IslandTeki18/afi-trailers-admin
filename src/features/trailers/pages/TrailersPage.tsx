import { TrailerList } from "../components/TrailerList";
import { Button } from "../../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { TrailerForm } from "../components/TrailerForm";
import { Trailer } from "../types/trailer.types";

export const TrailersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] =
    useState<Partial<Trailer> | null>(null);

  const handleAddTrailer = (trailerData: Partial<Trailer>) => {
    // Here you would typically call an API to create a new trailer
    console.log("Adding new trailer:", trailerData);

    // Close the modal and reset form
    setIsAddModalOpen(false);
  };

  const handleEditTrailer = (trailerData: Partial<Trailer>) => {
    // Here you would typically call an API to update the trailer
    console.log("Updating trailer:", trailerData);

    // Close the modal and reset form
    setIsEditModalOpen(false);
    setSelectedTrailer(null);
  };

  const handleEditClick = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setIsEditModalOpen(true);
  };

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
        <TrailerList onEditClick={handleEditClick} />
      </div>

      <TrailerForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTrailer}
        isEditing={false}
      />

      {selectedTrailer && (
        <TrailerForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTrailer(null);
          }}
          onSubmit={handleEditTrailer}
          initialData={selectedTrailer}
          isEditing={true}
        />
      )}
    </div>
  );
};
