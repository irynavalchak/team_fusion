import {createSlice, createSelector} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import TRANSACTION_TYPE from 'constants/transactionType';

export interface FinancialState {
  activeOrganization: string;
  activeMonth: Date;
  organizations: Organization[];
  accounts: Account[];
  transactionCategories: TransactionCategory[];
  transactions: Transaction[];
}

const initialState: FinancialState = {
  activeOrganization: '',
  activeMonth: new Date(),
  organizations: [],
  accounts: [],
  transactionCategories: [],
  transactions: []
};

export const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    setTransactionCategories: (state, action: PayloadAction<TransactionCategory[]>) => {
      state.transactionCategories = action.payload;
    },
    setActiveOrganization: (state, action: PayloadAction<string>) => {
      state.activeOrganization = action.payload;
    },
    setActiveMonth: (state, action: PayloadAction<Date>) => {
      state.activeMonth = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    }
  }
});

export const totalBalanceSelector = createSelector(
  (state: FinancialState) => state.accounts,
  accounts => {
    return accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);
  }
);

export const monthlyIncomeSelector = createSelector(
  (state: FinancialState) => state.transactions,
  transactions => {
    return transactions.reduce((total, transaction) => {
      if (transaction.transactionType === TRANSACTION_TYPE.INCOME) {
        return total + transaction.amount;
      }
      return total;
    }, 0);
  }
);

export const monthlyExpensesSelector = createSelector(
  (state: FinancialState) => state.transactions,
  transactions => {
    return transactions.reduce((total, transaction) => {
      if (transaction.transactionType === TRANSACTION_TYPE.EXPENSE) {
        return total + transaction.amount;
      }
      return total;
    }, 0);
  }
);

export const monthlyTransfersSelector = createSelector(
  (state: FinancialState) => state.transactions,
  transactions => {
    return transactions.reduce((total, transaction) => {
      if (transaction.transactionType === TRANSACTION_TYPE.TRANSFER) {
        return total + transaction.amount;
      }
      return total;
    }, 0);
  }
);

export const {
  setOrganizations,
  setAccounts,
  setTransactionCategories,
  setActiveOrganization,
  setActiveMonth,
  setTransactions
} = financialSlice.actions;

export default financialSlice.reducer;
