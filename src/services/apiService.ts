import axios from 'axios';

export const createTransaction = async (transaction: Transaction) => {
  try {
    const transactionModel: TransactionModel = {
      organization_id: transaction.organizationId,
      category_id: transaction.categoryId,
      account_id: transaction.accountId,
      transaction_type: transaction.transactionType,
      amount: transaction.amount,
      currency: transaction.currency,
      exchange_rate: transaction.exchangeRate,
      description: transaction.description,
      transaction_date: transaction.transactionDate
    };

    const response = await axios.post('/api/transaction/create', transactionModel);

    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};

export const createTransfer = async (transfer: Transfer) => {
  try {
    const transferModel: TransferModel = {
      transaction_id: transfer.transactionId,
      from_account_id: transfer.fromAccountId,
      to_account_id: transfer.toAccountId,
      from_amount: transfer.fromAmount,
      to_amount: transfer.toAmount,
      exchange_rate: transfer.exchangeRate
    };

    const response = await axios.post('/api/transfer/create', transferModel);

    return response;
  } catch (error) {
    console.error('Error creating transfer:', error);
  }
};

export const getAccounts = async () => {
  try {
    const response = await axios.get('/api/account');

    const accounts: Account[] = response?.data?.accounts?.map((account: AccountModel) => ({
      id: account.id,
      organizationId: account.organization_id,
      name: account.name,
      accountType: account.account_type,
      currency: account.currency,
      initialBalance: account.initial_balance,
      currentBalance: account.current_balance,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
      closedAt: account.closed_at
    }));

    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

export const getOrganizations = async () => {
  try {
    const response = await axios.get('/api/organization');

    const organizations: Organization[] = response?.data?.organizations?.map((organization: OrganizationModel) => ({
      id: organization.id,
      name: organization.name,
      country: organization.country,
      currency: organization.currency,
      taxId: organization.tax_id,
      createdAt: organization.created_at,
      updatedAt: organization.updated_at
    }));

    return organizations;
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

export const getTransactionCategories = async () => {
  try {
    const response = await axios.get('/api/transaction_category');

    const organizations: TransactionCategory[] = response?.data?.transaction_categories?.map(
      (category: TransactionCategoryModel) => ({
        id: category.id,
        name: category.name,
        type: category.type,
        createdAt: category.created_at
      })
    );

    return organizations;
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

export const getMonthlyTransactions = async (organizationId: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get('/api/transaction', {
      params: {
        organization_id: organizationId,
        start_date: startDate,
        end_date: endDate
      }
    });

    const transactions: Transaction[] = response?.data?.transactions?.map((transaction: TransactionModel) => ({
      id: transaction.id,
      organizationId: transaction.organization_id,
      categoryId: transaction.category_id,
      accountId: transaction.account_id,
      transactionType: transaction.transaction_type,
      amount: transaction.amount,
      currency: transaction.currency,
      exchangeRate: transaction.exchange_rate,
      description: transaction.description,
      transactionDate: transaction.transaction_date
    }));

    return transactions;
  } catch (error) {
    console.error('Error getting monthly transactions:', error);
    return [];
  }
};
