import React from "react";

const CustomersPanel = ({
  customers,
  openCustomerModal,
  deleteCustomer,
  customerSearchQuery,
  handleCustomerSearch,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Customers</h3>
        <button
          onClick={() => openCustomerModal()}
          className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
        >
          Add Customer
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers by name, email, or company..."
          value={customerSearchQuery}
          onChange={handleCustomerSearch}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        />
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
                  <button
                    onClick={() => openCustomerModal(customer)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
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
