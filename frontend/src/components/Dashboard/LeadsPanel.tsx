import React from "react";
import { Lead, Customer, LeadStatus, User, LEAD_STATUS_COLORS } from "../../types";

interface LeadsPanelProps {
  leads: Lead[];
  customers: Customer[];
  filterStatus: LeadStatus | 'All';
  setFilterStatus: (status: LeadStatus | 'All') => void;
  openLeadModal: (lead?: Lead) => void;
  deleteLead: (id: string) => void;
  leadSearchQuery: string;
  setLeadSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  user: User | null;
}

const LeadsPanel: React.FC<LeadsPanelProps> = ({
  leads,
  customers,
  filterStatus,
  setFilterStatus,
  openLeadModal,
  deleteLead,
  leadSearchQuery,
  setLeadSearchQuery,
  sortBy,
  setSortBy,
  user,
}) => {
  // Only admin, manager, and user roles can mutate lead records
  const canModify = user && ['admin', 'manager', 'user'].includes(user.role);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Leads</h3>
        {canModify && (
          <button
            onClick={() => openLeadModal()}
            className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
          >
            Add Lead
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search leads by title or customer..."
          value={leadSearchQuery}
          onChange={(e) => setLeadSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'All')}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
        >
          <option value="latest">Latest Leads</option>
          <option value="oldest">Oldest Leads</option>
        </select>
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
            {leads.map((lead) => {
              const targetId = typeof lead.customerId === 'object' && lead.customerId
                ? lead.customerId._id
                : lead.customerId;
              const customer = customers.find((c) => c._id === targetId);
              return (
                <tr key={lead._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{lead.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${LEAD_STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-800"}`
                      }
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canModify ? (
                      <>
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
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs italic">View Only</span>
                    )}
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