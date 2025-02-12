interface AccountModel {
  id: number;
  organization_id: number;
  name: string;
  account_type: string;
  currency: string;
  initial_balance: number;
  current_balance: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
}
