import React, { useState, useEffect } from "react";
import { CustomerList } from "../components/CustomerList";
import { CustomerDetailsDrawer } from "../components/CustomerDetailsDrawer";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { Customer } from "../types/customer.types";
import { Button } from "@/components/Button";
import { useToast } from "@/hooks/useToast";

// Mock data for customers to get started
const mockCustomers: Customer[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "5551234567",
    dateOfBirth: new Date("1985-05-15"),
    accountStatus: "active",
    createdAt: "2023-01-15T08:30:00Z",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    verificationStatus: {
      isEmailVerified: true,
      isPhoneVerified: false,
    },
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "5559876543",
    dateOfBirth: new Date("1990-08-22"),
    accountStatus: "active",
    createdAt: "2023-03-22T14:45:00Z",
    preferences: {
      notificationPreferences: {
        email: true,
        sms: true,
      },
    },
  },
  {
    _id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    phoneNumber: "5555551212",
    dateOfBirth: new Date("1978-11-30"),
    accountStatus: "inactive",
    createdAt: "2022-11-05T10:15:00Z",
    driverLicense: {
      number: "DL12345678",
      expirationDate: new Date("2025-10-15"),
      state: "NY",
    },
    notes: "Previous rental had late return",
  },
];

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | undefined>(
    undefined
  );
  const { addToast } = useToast();

  useEffect(() => {
    // Existing code for data fetching...
  }, []);

  const handleViewDetails = (customerId: string) => {
    const customer = customers.find((c) => c._id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsDrawerOpen(true);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsFormModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    // Delete customer from the list
    const updatedCustomers = customers.filter(
      (customer) => customer._id !== customerId
    );
    setCustomers(updatedCustomers);

    addToast({
      message: "Customer deleted successfully",
      variant: "success",
    });
  };

  const handleAddCustomer = () => {
    setCustomerToEdit(undefined);
    setIsFormModalOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCustomerToEdit(undefined);
  };

  const handleFormSubmit = (customerData: Customer) => {
    if (customerToEdit?._id) {
      // Update existing customer
      const updatedCustomers = customers.map((customer) =>
        customer._id === customerToEdit._id
          ? { ...customerData, _id: customerToEdit._id }
          : customer
      );
      setCustomers(updatedCustomers);
      addToast({
        message: "Customer updated successfully",
        variant: "success",
      });
    } else {
      // Add new customer with a temporary ID
      const newCustomer: Customer = {
        ...customerData,
        _id: `temp-${Date.now()}`,
      };
      setCustomers([...customers, newCustomer]);
      addToast({
        message: "Customer added successfully",
        variant: "success",
      });
    }
    setIsFormModalOpen(false);
    setCustomerToEdit(undefined);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
        <Button variant="base" onClick={handleAddCustomer}>
          Add Customer
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <CustomerList
          customers={customers}
          onViewDetails={handleViewDetails}
          onEditCustomer={(customerId) => {
            const customer = customers.find((c) => c._id === customerId);
            if (customer) {
              handleEditCustomer(customer);
            }
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {/* Customer Details Drawer */}
      {selectedCustomer && (
        <CustomerDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          customer={selectedCustomer}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
      )}

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={customerToEdit}
        isEditing={!!customerToEdit}
      />
    </div>
  );
};
