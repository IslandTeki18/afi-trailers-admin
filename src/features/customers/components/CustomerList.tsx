import React, { useState } from "react";
import { Customer } from "../types/customer.types";
import { Input } from "@/components/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CustomerCard } from "./CustomerCard";

interface CustomerListProps {
  customers: Customer[];
  onViewDetails: (customerId: string) => void;
  onEditCustomer: (customerId: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onViewDetails,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterCustomers = (customers: Customer[]): Customer[] => {
    if (!searchTerm) return customers;

    const lowercasedSearch = searchTerm.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(lowercasedSearch) ||
        customer.lastName.toLowerCase().includes(lowercasedSearch) ||
        customer.email.toLowerCase().includes(lowercasedSearch) ||
        customer.phoneNumber.includes(searchTerm)
    );
  };

  const displayCustomers = filterCustomers(customers);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search customers..."
            variant="primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">
            {displayCustomers.length} customers
          </span>
        </div>
      </div>

      {displayCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No customers found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Add your first customer to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCustomers.map((customer) => (
            <CustomerCard
              key={customer._id}
              customer={customer}
              onView={onViewDetails}
              onEdit={onEditCustomer}
            />
          ))}
        </div>
      )}
    </div>
  );
};
