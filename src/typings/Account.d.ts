interface TransactionCategory {
  id: number;
  organizationId: number;
  name: string;
  accountType: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
}
