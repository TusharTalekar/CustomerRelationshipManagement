export type UserRole = 'user' | 'admin' | 'manager' | 'support';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Proposal Sent' | 'Won' | 'Lost';

export interface Lead {
  _id: string;
  customerId: string | { _id: string; name: string };
  title: string;
  description?: string;
  status: LeadStatus;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Interested': 'bg-purple-100 text-purple-800',
  'Proposal Sent': 'bg-indigo-100 text-indigo-800',
  'Won': 'bg-green-100 text-green-800',
  'Lost': 'bg-red-100 text-red-800',
};

// For Recharts graphs
export const LEAD_STATUS_HEX_COLORS: Record<LeadStatus, string> = {
  'New': '#1d4ed8',          // blue-700
  'Contacted': '#a16207',    // yellow-700
  'Interested': '#7e22ce',   // purple-700
  'Proposal Sent': '#4338ca',// indigo-700
  'Won': '#15803d',          // green-700
  'Lost': '#b91c1c',         // red-700
};