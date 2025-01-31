interface TransferModel {
  id?: number;
  transaction_id: number;
  from_account_id: number;
  to_account_id: number;
  from_amount: number;
  to_amount: number;
  exchange_rate: number;
  created_at?: Date;
}
