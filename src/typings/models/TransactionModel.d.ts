interface TransactionModel {
  id?: number;
  organization_id: number;
  category_id: number;
  account_id: number;
  transaction_type: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  description: string;
  transaction_date: string;
  created_at?: Date;
  updated_at?: Date;
}
