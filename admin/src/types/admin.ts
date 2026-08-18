export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  verifiedProfiles: number;
  premiumUsers: number;
  totalRevenue: number;
  pendingVerifications: number;
  pendingReports: number;
  openTickets: number;
  totalMatches: number;
  totalInterests: number;
  totalMessages: number;
  conversionRate: string;
}

export interface RegistrationTrendItem {
  date: string;
  registrations: number;
  revenue: number;
}
