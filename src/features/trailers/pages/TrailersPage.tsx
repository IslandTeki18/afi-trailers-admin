import { TrailerList } from "../components/TrailerList";
import { Button } from "../../../components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { TrailerFormModal } from "../components/TrailerFormModal";
import {
  Trailer,
  TrailerBookedDates,
  TrailerUsageHistory,
} from "../types/trailer.types";
import { createTrailer } from "../api/createTrailer";
import { updateTrailer } from "../api/updateTrailer";
import { TrailerBookedDateModal } from "../components/modals/TrailerBookedDateModal";
import { TrailerUsageHistoryModal } from "../components/modals/TrailerUsageHistoryModal";

export const TrailersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>();

  // Booked Date Modal states
  const [isBookedDateModalOpen, setIsBookedDateModalOpen] = useState(false);
  const [selectedBookedDate, setSelectedBookedDate] =
    useState<TrailerBookedDates | null>(null);
  const [currentTrailerId, setCurrentTrailerId] = useState<string | null>(null);

  // Usage History Modal states
  const [isUsageHistoryModalOpen, setIsUsageHistoryModalOpen] = useState(false);
  const [selectedUsageHistory, setSelectedUsageHistory] =
    useState<TrailerUsageHistory | null>(null);

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

  // Handler for adding or updating booked dates
  const handleBookedDateSave = async (bookedDate: TrailerBookedDates) => {
    if (!selectedTrailer || !currentTrailerId) return;

    try {
      // Deep clone the selected trailer to avoid modifying the original state
      const updatedTrailer = JSON.parse(
        JSON.stringify(selectedTrailer)
      ) as Trailer;

      if (selectedBookedDate) {
        // Edit existing booking
        const index = updatedTrailer.bookedDates.findIndex(
          (bd) => bd.bookingId === selectedBookedDate.bookingId
        );

        if (index !== -1) {
          updatedTrailer.bookedDates[index] = bookedDate;
        }
      } else {
        // Add new booking
        if (!updatedTrailer.bookedDates) {
          updatedTrailer.bookedDates = [];
        }
        updatedTrailer.bookedDates.push(bookedDate);
      }

      // Update trailer with new bookings
      await updateTrailer(currentTrailerId, updatedTrailer);

      // Update local state
      setSelectedTrailer(updatedTrailer);
      setIsBookedDateModalOpen(false);
      setSelectedBookedDate(null);

      // Refetch trailers to update the UI
      window.dispatchEvent(new CustomEvent("refetch-trailers"));
    } catch (error) {
      console.error("Error updating booked dates:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  // Handler for adding or updating usage history
  const handleUsageHistorySave = async (usageHistory: TrailerUsageHistory) => {
    if (!selectedTrailer || !currentTrailerId) return;

    try {
      // Deep clone the selected trailer to avoid modifying the original state
      const updatedTrailer = JSON.parse(
        JSON.stringify(selectedTrailer)
      ) as Trailer;

      if (selectedUsageHistory) {
        // Edit existing usage history
        const index = updatedTrailer.usageHistory.findIndex(
          (uh) => uh._id === selectedUsageHistory._id
        );

        if (index !== -1) {
          updatedTrailer.usageHistory[index] = usageHistory;
        }
      } else {
        // Add new usage history
        if (!updatedTrailer.usageHistory) {
          updatedTrailer.usageHistory = [];
        }

        // Generate a temporary ID if needed
        if (!usageHistory._id) {
          usageHistory._id = Date.now().toString();
        }

        updatedTrailer.usageHistory.push(usageHistory);
      }

      // Update trailer with new usage history
      await updateTrailer(currentTrailerId, updatedTrailer);

      // Update local state
      setSelectedTrailer(updatedTrailer);
      setIsUsageHistoryModalOpen(false);
      setSelectedUsageHistory(null);

      // Refetch trailers to update the UI
      window.dispatchEvent(new CustomEvent("refetch-trailers"));
    } catch (error) {
      console.error("Error updating usage history:", error);
      alert("Failed to update usage history. Please try again.");
    }
  };

  const openBookedDateModal = (
    trailer: Trailer,
    bookedDate?: TrailerBookedDates
  ) => {
    setCurrentTrailerId(trailer._id!);
    setSelectedTrailer(trailer);
    setSelectedBookedDate(bookedDate || null);
    setIsBookedDateModalOpen(true);
  };

  const openUsageHistoryModal = (
    trailer: Trailer,
    usageHistory?: TrailerUsageHistory
  ) => {
    setCurrentTrailerId(trailer._id!);
    setSelectedTrailer(trailer);
    setSelectedUsageHistory(usageHistory || null);
    setIsUsageHistoryModalOpen(true);
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
            variant="base"
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
          onBookingClick={(trailer, booking) =>
            openBookedDateModal(trailer, booking)
          }
          onAddBookingClick={(trailer) => openBookedDateModal(trailer)}
          onUsageHistoryClick={(trailer, usage) =>
            openUsageHistoryModal(trailer, usage)
          }
          onAddUsageHistoryClick={(trailer) => openUsageHistoryModal(trailer)}
        />
      </div>

      {/* Trailer Form Modal */}
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

      {/* Booked Date Modal */}
      <TrailerBookedDateModal
        isOpen={isBookedDateModalOpen}
        onClose={() => {
          setIsBookedDateModalOpen(false);
          setSelectedBookedDate(null);
        }}
        onSave={handleBookedDateSave}
        initialData={selectedBookedDate || undefined}
        isEditing={!!selectedBookedDate}
      />

      {/* Usage History Modal */}
      <TrailerUsageHistoryModal
        isOpen={isUsageHistoryModalOpen}
        onClose={() => {
          setIsUsageHistoryModalOpen(false);
          setSelectedUsageHistory(null);
        }}
        onSave={handleUsageHistorySave}
        initialData={selectedUsageHistory || undefined}
        isEditing={!!selectedUsageHistory}
      />
    </div>
  );
};
