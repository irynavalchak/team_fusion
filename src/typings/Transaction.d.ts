interface Transaction {
  id?: number;
  organizationId: number;
  categoryId: number;
  accountId: number;
  transactionType: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  description: string;
  transactionDate: string;
}
