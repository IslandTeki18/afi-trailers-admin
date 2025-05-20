import React, { useState } from "react";
import { Customer } from "../types/customer.types";
import { format } from "date-fns";
import { Table } from "@/components/Table";
import { Input } from "@/components/Input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

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
  const [sortField, setSortField] = useState<keyof Customer>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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

  const sortCustomers = (customers: Customer[]): Customer[] => {
    return [...customers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) return phone;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  };

  const displayCustomers = sortCustomers(filterCustomers(customers));

  // Convert customers to the format expected by the Table component
  const tableData = displayCustomers.map((customer) => ({
    id: customer._id,
    name: `${customer.firstName} ${customer.lastName}${
      customer.address?.city ? ` (${customer.address.city})` : ""
    }`,
    email: `${customer.email}${
      customer.verificationStatus?.isEmailVerified ? " (Verified)" : ""
    }`,
    phone: formatPhoneNumber(customer.phoneNumber),
    status: customer.accountStatus,
    createdAt: customer.createdAt
      ? format(new Date(customer.createdAt), "MMM d, yyyy")
      : "-",
  }));

  // Define columns for the Table component
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Status", accessor: "status" },
    { header: "Created", accessor: "createdAt" },
    { header: "Actions", accessor: "actions", isAction: true },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
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

      <Table
        title="Customer Management"
        description="A list of all customers in your account"
        data={tableData}
        columns={columns}
        variant="primary"
        onView={(item) => onViewDetails(item.id)}
        onEdit={(item) => onEditCustomer(item.id)}
      />
    </div>
  );
};
