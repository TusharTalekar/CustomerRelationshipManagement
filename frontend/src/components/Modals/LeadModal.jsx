import React from "react";

const LeadModal = ({
  currentLead,
  customers,
  handleLeadSubmit,
  closeLeadModal,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 max-w-lg">
        <h3 className="text-2xl font-semibold mb-4 text-violet-700">
          {currentLead ? "Edit Lead" : "Add New Lead"}
        </h3>
        <form onSubmit={handleLeadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              name="customer"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              required
              defaultValue={currentLead?.customerId}
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentLead?.title}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentLead?.description}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentLead?.status}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="number"
              name="value"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentLead?.value}
              step="0.01"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={closeLeadModal}
              className="p-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
