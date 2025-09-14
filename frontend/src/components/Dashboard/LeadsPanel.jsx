import React from "react";

const LeadsPanel = ({
  leads,
  customers,
  filterStatus,
  setFilterStatus,
  openLeadModal,
  deleteLead,
}) => {
  const filteredLeads =
    filterStatus === "All"
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Leads</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
          <button
            onClick={() => openLeadModal()}
            className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
          >
            Add Lead
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => {
              const customer = customers.find((c) => c._id === lead.customerId);
              return (
                <tr key={lead._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{lead.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lead.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : lead.status === "Contacted"
                          ? "bg-yellow-100 text-yellow-800"
                          : lead.status === "Converted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openLeadModal(lead)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPanel;
