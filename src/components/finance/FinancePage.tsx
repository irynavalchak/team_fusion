'use client';

import React, {FC, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from 'components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from 'components/ui/tabs';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'components/ui/select';
import {Button} from 'components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from 'components/ui/dialog';
import {Skeleton} from 'components/ui/skeleton';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {
  totalBalanceSelector,
  setActiveOrganization,
  monthlyIncomeSelector,
  monthlyExpensesSelector,
  monthlyTransfersSelector
} from 'redux_state/reducers/financialSlice';

import useLoadInitialData from './hooks/useLoadInitialData';
import useMonthlyTransactions from './hooks/useMonthlyTransactions';

import TRANSACTION_TYPE from 'constants/transactionType';

import TransactionForm from './components/transaction_form/TransactionForm';
import TransferForm from './components/transfer_form/TransferForm';
import Accounts from './components/accounts/Accounts';
import MonthPicker from './components/month_picker/MonthPicker';
import MonthlyFinanceChart from './components/monthly_chart/MonthlyFinanceChart';

import styles from './finance.module.css';

const HIDE_FEATURES = false;

const FinancePage: FC = () => {
  const dispatch = useAppDispatch();

  const organizations = useAppSelector(state => state.financial.organizations);
  const activeOrganization = useAppSelector(state => state.financial.activeOrganization);
  const activeMonth = useAppSelector(state => state.financial.activeMonth);
  const transactions = useAppSelector(state => state.financial.transactions);
  const transactionCategories = useAppSelector(state => state.financial.transactionCategories);

  const totalBalance = useAppSelector(state => totalBalanceSelector(state.financial));
  const monthlyIncome = useAppSelector(state => monthlyIncomeSelector(state.financial));
  const monthlyExpenses = useAppSelector(state => monthlyExpensesSelector(state.financial));
  const monthlyTransfers = useAppSelector(state => monthlyTransfersSelector(state.financial));

  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const {isLoading} = useLoadInitialData();
  useMonthlyTransactions();

  const changeOrganization = (organizationId: string) => {
    dispatch(setActiveOrganization(organizationId));
  };

  function render() {
    const isDashboardDetailsVisible = activeOrganization && activeMonth;

    return (
      <div className={styles.container}>
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold">Financial Dashboard</h1>

              <div className="flex flex-wrap gap-3 items-center">
                <Select defaultValue={activeOrganization} onValueChange={changeOrganization}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(organization => (
                      <SelectItem key={organization.id} value={organization.id.toString()}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <MonthPicker />

                <div className="flex gap-2">
                  <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <span className="mr-2">➕</span>
                        Add Transaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Transaction</DialogTitle>
                      </DialogHeader>
                      <TransactionForm onCancel={() => setIsTransactionOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <span className="mr-2">↔️</span>
                        Add Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Transfer</DialogTitle>
                      </DialogHeader>

                      <TransferForm onCancel={() => setIsTransferOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {isDashboardDetailsVisible && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                      <span className="text-gray-500">💰</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">Across all accounts</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                      <span className="text-green-500">📈</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
                      {HIDE_FEATURES && <p className="text-xs text-green-500">+12% from last month</p>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                      <span className="text-red-500">📉</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${monthlyExpenses.toLocaleString()}</div>
                      {HIDE_FEATURES && <p className="text-xs text-red-500">-5% from last month</p>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Transfers</CardTitle>
                      <span className="text-blue-500">🔄</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${monthlyTransfers.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <MonthlyFinanceChart transactions={transactions} activeMonth={activeMonth} />
                  </TabsContent>

                  <TabsContent value="transactions">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Transactions</CardTitle>
                        {HIDE_FEATURES && (
                          <Button variant="outline" size="sm">
                            <span className="mr-2">🔍</span>
                            Filter
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="relative overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th scope="col" className="px-6 py-3">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-right">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map(transaction => {
                                const category = transactionCategories.find(
                                  category => category.id === transaction.categoryId
                                );
                                const isIncome = transaction.transactionType === TRANSACTION_TYPE.INCOME;
                                const isTransfer = transaction.transactionType === TRANSACTION_TYPE.TRANSFER;
                                const displayAmount = Math.abs(transaction.amount).toLocaleString();

                                let displayColor = isIncome ? 'text-green-500' : 'text-red-500';
                                if (isTransfer) displayColor = 'text-blue-500';

                                let displaySign = isIncome ? '+' : '-';
                                if (isTransfer) displaySign = '';

                                return (
                                  <tr
                                    key={transaction.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{transaction.transactionDate}</td>
                                    <td className="px-6 py-4">{transaction.description}</td>
                                    <td className="px-6 py-4">{category?.name}</td>
                                    <td className={`px-6 py-4 text-right ${displayColor}`}>
                                      {displaySign}${displayAmount}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="accounts">
                    <Accounts />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return render();
};

export default FinancePage;
