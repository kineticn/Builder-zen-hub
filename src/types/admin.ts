export interface ComplianceStatus {
  category: string;
  completed: number;
  total: number;
  percentage: number;
  lastUpdated: string;
  critical: boolean;
}

export interface ComplianceMetrics {
  overall: ComplianceStatus;
  categories: ComplianceStatus[];
  trends: {
    week: number;
    month: number;
    quarter: number;
  };
}

export interface RiskFlag {
  id: string;
  userId: string;
  userName: string;
  type: "high" | "medium" | "low";
  category: "financial" | "security" | "compliance" | "operational";
  title: string;
  description: string;
  severity: number; // 1-10 scale
  status: "active" | "investigating" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  tags: string[];
}

export interface WebhookHealth {
  id: string;
  name: string;
  endpoint: string;
  provider: string;
  status: "healthy" | "degraded" | "down" | "maintenance";
  lastPing: string;
  responseTime: number; // in milliseconds
  successRate: number; // percentage
  totalRequests: number;
  failedRequests: number;
  uptime: number; // percentage
  errorMessages: string[];
}

export interface BillSyncMetrics {
  webhooks: WebhookHealth[];
  totalSynced: number;
  syncErrors: number;
  lastSyncTime: string;
  syncFrequency: "realtime" | "hourly" | "daily";
  queueLength: number;
}

export interface AdminWidget {
  id: string;
  type: "compliance" | "risk" | "sync";
  title: string;
  description: string;
  refreshInterval: number; // in seconds
  autoRefresh: boolean;
  permissions: string[];
  configurable: boolean;
  settings: Record<string, any>;
}

export interface AdminConfiguration {
  widgets: AdminWidget[];
  layout: {
    grid: "2x2" | "3x1" | "1x3" | "custom";
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  notifications: {
    email: boolean;
    browser: boolean;
    slack: boolean;
  };
  thresholds: {
    compliance: {
      critical: number;
      warning: number;
    };
    risk: {
      high: number;
      escalation: number;
    };
    sync: {
      downtime: number;
      errorRate: number;
    };
  };
}
