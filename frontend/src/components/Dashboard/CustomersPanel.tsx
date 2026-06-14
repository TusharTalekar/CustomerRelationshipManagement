import React from "react";
import { Customer, User } from "../../types";

interface CustomersPanelProps {
  customers: Customer[];
  openCustomerModal: (customer?: Customer) => void;
  deleteCustomer: (id: string) => void;
  customerSearchQuery: string;
  handleCustomerSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerFilterType: string;
  setCustomerFilterType: (type: string) => void;
  customerSortBy: string;
  setCustomerSortBy: (sort: string) => void;
  user: User | null;
}

const CustomersPanel: React.FC<CustomersPanelProps> = ({
  customers,
  openCustomerModal,
  deleteCustomer,
  customerSearchQuery,
  handleCustomerSearch,
  customerFilterType,
  setCustomerFilterType,
  customerSortBy,
  setCustomerSortBy,
  user,
}) => {
  const canModify = user && ['admin', 'manager', 'user'].includes(user.role);
  const canDelete = user && user.role === 'admin';

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Customers</h3>
        {canModify && (
          <button
            onClick={() => openCustomerModal()}
            className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
          >
            Add Customer
          </button>
        )}
      </div>

      {/* Search, Filter, and Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search customers by name, email, or company..."
          value={customerSearchQuery}
          onChange={handleCustomerSearch}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        />

        <select
          value={customerFilterType}
          onChange={(e) => setCustomerFilterType(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        >
          <option value="All">All Types</option>
          <option value="Company">Companies Only</option>
          <option value="Individual">Individuals Only</option>
        </select>

        <select
          value={customerSortBy}
          onChange={(e) => setCustomerSortBy(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        >
          <option value="none">Default Order</option>
          <option value="asc">Name (A - Z)</option>
          <option value="desc">Name (Z - A)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.company || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {canModify && (
                    <button
                      onClick={() => openCustomerModal(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => deleteCustomer(customer._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                  {!canModify && !canDelete && (
                    <span className="text-gray-400 text-xs italic">View Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPanel;