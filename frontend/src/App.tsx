import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";
import { User, Customer, Lead, LeadStatus } from "./types";

// Components
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import CustomersPanel from "./components/Dashboard/CustomersPanel";
import LeadsPanel from "./components/Dashboard/LeadsPanel";
import Reports from "./components/Dashboard/Reports";
import CustomerModal from "./components/Modals/CustomerModal";
import LeadModal from "./components/Modals/LeadModal";

const App: React.FC = () => {

  const [reportCustomerFilter, setReportCustomerFilter] = useState<string>("All");

  const [leadSearchQuery, setLeadSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest"); // "latest" | "oldest"

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState<string>("customers");
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  // Axios interceptor for JWT
  useEffect(() => {
    const token = localStorage.getItem("crmToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
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

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const url = isRegistering ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
    const body: Record<string, string> = { email, password };
    if (isRegistering) {
      body.name = (form.elements.namedItem("name") as HTMLInputElement).value;
    }

    try {
      const res = await axios.post(url, body);
      if (res.status === 201 || res.status === 200) {
        const data = res.data;
        localStorage.setItem("crmToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setIsLoggedIn(true);
        setUser(data.user);
        fetchData();
      } else {
        window.alert(res.data.message);
      }
    } catch (error: any) {
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
  const openCustomerModal = (customer: Customer | null = null) => {
    setCurrentCustomer(customer);
    setIsCustomerModalOpen(true);
  };
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const customer = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
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
    } catch (err: any) {
      window.alert(err.response?.data?.message || "Failed to save customer. Please try again.");
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/customers/${id}`);
      fetchData();
    } catch (err: any) {
      window.alert(err.response?.data?.message || "Failed to delete customer. Please try again.");
    }
  };

  // Lead actions
  const openLeadModal = (lead: Lead | null = null) => {
    setCurrentLead(lead);
    setIsLeadModalOpen(true);
  };
  const closeLeadModal = () => setIsLeadModalOpen(false);

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const lead = {
      customerId: (form.elements.namedItem("customer") as HTMLSelectElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      status: (form.elements.namedItem("status") as HTMLSelectElement).value,
      value: parseFloat((form.elements.namedItem("value") as HTMLInputElement).value),
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
    } catch (err: any) {
      window.alert(err.response?.data?.message || "Failed to save lead. Please try again.");
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/leads/${id}`);
      fetchData();
    } catch (err: any) {
      window.alert(err.response?.data?.message || "Failed to delete lead. Please try again.");
    }
  };

  const filteredLeads = leads
    .filter((lead) => {
      // 1. Filter by status
      const matchesStatus = filterStatus === "All" || lead.status === filterStatus;

      // 2. Search by lead title or customer name
      const targetId = typeof lead.customerId === "object" && lead.customerId ? lead.customerId._id : lead.customerId;
      const customer = customers.find((c) => c._id === targetId);

      const matchesSearch =
        lead.title.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
        (customer?.name || "").toLowerCase().includes(leadSearchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // 3. Sort by latest or oldest leads
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
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
                leadSearchQuery={leadSearchQuery}
                setLeadSearchQuery={setLeadSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            )}
            {activeTab === "reports" &&
              <Reports
                leads={leads}
                customers={customers}
                reportCustomerFilter={reportCustomerFilter}
                setReportCustomerFilter={setReportCustomerFilter}
              />
            }

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
