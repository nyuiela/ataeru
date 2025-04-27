import { Hospital } from "../services/fertility-ai";

export interface FilterOptions {
  sortBy: 'compensation' | 'paymentTime' | 'rating';
  sortDirection: 'asc' | 'desc';
  careType: string | null;
  searchTerm: string;
  statusFilter: 'all' | 'pending' | 'accepted' | 'declined';
}

export interface EnhancedHospital extends Hospital {
  status: 'pending' | 'accepted' | 'declined';
}