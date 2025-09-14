import React from "react";

const CustomerModal = ({
  currentCustomer,
  handleCustomerSubmit,
  closeCustomerModal,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 max-w-lg">
        <h3 className="text-2xl font-semibold mb-4 text-violet-700">
          {currentCustomer ? "Edit Customer" : "Add New Customer"}
        </h3>
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentCustomer?.name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentCustomer?.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentCustomer?.phone}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              type="text"
              name="company"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base mt-1"
              defaultValue={currentCustomer?.company}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={closeCustomerModal}
              className="p-3 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
