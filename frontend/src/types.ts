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

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Lost';

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
