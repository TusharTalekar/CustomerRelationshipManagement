import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Lead, Customer, LEAD_STATUS_HEX_COLORS } from "../../types";

interface ReportsProps {
  leads: Lead[];
  customers: Customer[];
  reportCustomerFilter: string;
  setReportCustomerFilter: (customerId: string) => void;
}

const Reports: React.FC<ReportsProps> = ({
  leads,
  customers,
  reportCustomerFilter,
  setReportCustomerFilter,
}) => {
  // 1. Filter leads based on the selected customer
  const filteredLeads = leads.filter((lead) => {
    if (reportCustomerFilter === "All") return true;

    const targetId = typeof lead.customerId === "object" && lead.customerId
      ? lead.customerId._id
      : lead.customerId;

    return targetId === reportCustomerFilter;
  });

  // 2. Calculate status counts from filtered leads
  const statusCounts = filteredLeads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const STATUS_COLORS = LEAD_STATUS_HEX_COLORS;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-2xl font-semibold text-violet-700">
          Leads by Status
        </h3>

        {/* Customer Filter Dropdown */}
        <div className="w-full md:w-64">
          <select
            value={reportCustomerFilter}
            onChange={(e) => setReportCustomerFilter(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
          >
            <option value="All">All Customers</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pieChartData.length > 0 ? (
        <div className="w-full flex justify-center h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center h-80 text-gray-500 font-medium">
          No leads found for this customer.
        </div>
      )}
    </div>
  );
};

export default Reports;