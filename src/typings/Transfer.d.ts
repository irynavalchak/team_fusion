interface Transfer {
  id?: number;
  transactionId: number;
  fromAccountId: number;
  toAccountId: number;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
}
