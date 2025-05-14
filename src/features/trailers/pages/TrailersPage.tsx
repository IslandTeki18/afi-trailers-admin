import { TrailerList } from "../components/TrailerList";
import { Button } from "../../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { TrailerFormModal } from "../components/TrailerFormModal";
import { Trailer } from "../types/trailer.types";
import { createTrailer } from "../api/createTrailer";
import { updateTrailer } from "../api/updateTrailer";

export const TrailersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>();

  const handleAddTrailer = async (trailerData: Trailer) => {
    try {
      await createTrailer(trailerData);
      setIsAddModalOpen(false);
      window.dispatchEvent(new CustomEvent("refetch-trailers"));
    } catch (error) {
      console.log("Error adding trailer:", error);
      alert("Failed to add trailer. Please try again.");
    }
  };

  const handleEditTrailer = async (trailerData: Trailer) => {
    try {
      await updateTrailer(selectedTrailer?._id!, trailerData);
      setIsEditModalOpen(false);
      window.dispatchEvent(new CustomEvent("refetch-trailers"));
    } catch (error) {
      console.log("Error updating trailer:", error);
      alert("Failed to update trailer. Please try again.");
    }
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
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New Trailer
          </Button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg shadow">
        <TrailerList
          onEditClick={handleEditClick}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </div>

      <TrailerFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTrailer(null);
        }}
        onSubmit={handleAddTrailer}
        isEditing={false}
      />

      {selectedTrailer && (
        <TrailerFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTrailer(null);
          }}
          onSubmit={handleEditTrailer}
          initialData={selectedTrailer}
          isEditing
        />
      )}
    </div>
  );
};
