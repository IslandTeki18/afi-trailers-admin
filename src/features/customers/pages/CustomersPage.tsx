import { useState, useEffect } from "react";
import { CustomerList } from "../components/CustomerList";
import { CustomerDetailsDrawer } from "../components/CustomerDetailsDrawer";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { createCustomer } from "../api/createCustomer";
import { fetchCustomers } from "../api/fetchCustomers";
import { Customer } from "../types/customer.types";
import { Button } from "@/components/Button";
import { useToast } from "@/hooks/useToast";

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomers();
        //@ts-ignore
        setCustomers(data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        addToast({
          message: "Failed to load customers. Please try again.",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
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

  const handleAddCustomerModal = () => {
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

  const handleFormSubmit = async (customerData: Customer) => {
    try {
      setIsLoading(true);

      if (customerToEdit?._id) {

        // You would add updateCustomer API call here
        // const updatedCustomer = await updateCustomer(customerToEdit._id, customerData);

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
        const newCustomer = await createCustomer(customerData);

        setCustomers([...customers, newCustomer]);

        addToast({
          message: "Customer added successfully",
          variant: "success",
        });
      }
    } catch (error) {
      console.log("Error submitting customer:", error);
      addToast({
        message: "Failed to save customer. Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setIsFormModalOpen(false);
      setCustomerToEdit(undefined);
    }
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
        <Button variant="base" onClick={handleAddCustomerModal}>
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
            } else {
              console.error("Customer not found:", customerId);
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
