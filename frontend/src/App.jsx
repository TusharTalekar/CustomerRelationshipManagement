import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

// Components
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import CustomersPanel from "./components/Dashboard/CustomersPanel";
import LeadsPanel from "./components/Dashboard/LeadsPanel";
import Reports from "./components/Dashboard/Reports";
import CustomerModal from "./components/Modals/CustomerModal";
import LeadModal from "./components/Modals/LeadModal";

const App = () => {
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);

  // Data
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);

  // UI states
  const [activeTab, setActiveTab] = useState("customers");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentLead, setCurrentLead] = useState(null);

  // Axios interceptor for JWT
  useEffect(() => {
    const token = localStorage.getItem("crmToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/profile`);
      if (res.status === 200) {
        setIsLoggedIn(true);
        setUser(res.data);
        fetchData();
      } else {
        localStorage.removeItem("crmToken");
      }
    } catch (error) {
      localStorage.removeItem("crmToken");
    }
  };

  const fetchData = async () => {
    try {
      const [customersRes, leadsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers?query=${customerSearchQuery}`),
        axios.get(`${API_BASE_URL}/leads`),
      ]);
      setCustomers(customersRes.data);
      setLeads(leadsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Re-fetch data on search query change
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [customerSearchQuery, isLoggedIn]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const url = isRegistering ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
    const body = { email, password };
    if (isRegistering) {
      body.name = form.name.value;
    }

    try {
      const res = await axios.post(url, body);
      if (res.status === 201 || res.status === 200) {
        const data = res.data;
        localStorage.setItem("crmToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setIsLoggedIn(true);
        // Assuming the login/register response includes the user object
        setUser(data.user);
        fetchData();
      } else {
        window.alert(res.data.message);
      }
    } catch (error) {
      console.error("Auth error", error);
      window.alert(error.response?.data?.message || "Authentication failed. Try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("crmToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Customer actions
  const openCustomerModal = (customer = null) => {
    setCurrentCustomer(customer);
    setIsCustomerModalOpen(true);
  };
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const customer = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      company: form.company.value,
    };
    const isEditing = currentCustomer !== null;
    const url = isEditing
      ? `${API_BASE_URL}/customers/${currentCustomer._id}`
      : `${API_BASE_URL}/customers`;
    const method = isEditing ? "PUT" : "POST";

    try {
      await axios({ method, url, data: customer });
      closeCustomerModal();
      fetchData();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to save customer. Please try again.");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/customers/${id}`);
      fetchData();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to delete customer. Please try again.");
    }
  };

  // Lead actions
  const openLeadModal = (lead = null) => {
    setCurrentLead(lead);
    setIsLeadModalOpen(true);
  };
  const closeLeadModal = () => setIsLeadModalOpen(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const lead = {
      customerId: form.customer.value,
      title: form.title.value,
      description: form.description.value,
      status: form.status.value,
      value: parseFloat(form.value.value),
    };
    const isEditing = currentLead !== null;
    const url = isEditing
      ? `${API_BASE_URL}/leads/${currentLead._id}`
      : `${API_BASE_URL}/leads/${lead.customerId}`;
    const method = isEditing ? "PUT" : "POST";

    try {
      await axios({ method, url, data: lead });
      closeLeadModal();
      fetchData();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to save lead. Please try again.");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/leads/${id}`);
      fetchData();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to delete lead. Please try again.");
    }
  };
  
  const filteredLeads = leads.filter(lead => {
    if (filterStatus === 'All') {
      return true;
    }
    return lead.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} user={user} />

      <main className="container mx-auto py-8 px-4">
        {!isLoggedIn ? (
          <AuthForm
            isRegistering={isRegistering}
            setIsRegistering={setIsRegistering}
            handleAuthSubmit={handleAuthSubmit}
          />
        ) : (
          <>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("customers")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "customers" ? "bg-violet-700 text-white" : "bg-white text-gray-700 border"}`}
              >
                Customers
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "leads" ? "bg-violet-700 text-white" : "bg-white text-gray-700 border"}`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "reports" ? "bg-violet-700 text-white" : "bg-white text-gray-700 border"}`}
              >
                Reports
              </button>
            </div>

            {activeTab === "customers" && (
              <CustomersPanel
                customers={customers.filter((c) =>
                  [c.name, c.email, c.company].some((field) =>
                    field?.toLowerCase().includes(customerSearchQuery.toLowerCase())
                  )
                )}
                openCustomerModal={openCustomerModal}
                deleteCustomer={deleteCustomer}
                customerSearchQuery={customerSearchQuery}
                handleCustomerSearch={(e) => setCustomerSearchQuery(e.target.value)}
              />
            )}
            {activeTab === "leads" && (
              <LeadsPanel
                leads={filteredLeads}
                customers={customers}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                openLeadModal={openLeadModal}
                deleteLead={deleteLead}
              />
            )}
            {activeTab === "reports" && <Reports leads={leads} />}
          </>
        )}
      </main>

      {isCustomerModalOpen && (
        <CustomerModal
          currentCustomer={currentCustomer}
          handleCustomerSubmit={handleCustomerSubmit}
          closeCustomerModal={closeCustomerModal}
        />
      )}
      {isLeadModalOpen && (
        <LeadModal
          currentLead={currentLead}
          customers={customers}
          handleLeadSubmit={handleLeadSubmit}
          closeLeadModal={closeLeadModal}
        />
      )}
    </div>
  );
};

export default App;
