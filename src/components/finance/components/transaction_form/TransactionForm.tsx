import React, {FC, useState, useMemo} from 'react';
import {Calendar} from 'lucide-react';
import {Calendar as CalendarComponent} from 'components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from 'components/ui/popover';
import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';
import {Label} from 'components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'components/ui/select';
import {Textarea} from 'components/ui/textarea';
import {useToast} from 'hooks/use-toast';

import {useAppSelector} from 'redux_state/hooks';

import TRANSACTION_TYPE from 'constants/transactionType';
import CURRENCY from 'constants/currency';

import {formatDate, formatLongDate} from 'helpers/dateHelper';

import {createTransaction} from 'services/apiService';

interface TransactionFormProps {
  onCancel: () => void;
}

interface TransactionFormData {
  organizationId: number;
  transactionType: 'expense' | 'income';
  amount: number;
  currency: string;
  accountId: number;
  categoryId: number;
  transactionDate: Date;
  exchangeRate: number;
  description: string;
}

const TransactionForm: FC<TransactionFormProps> = ({onCancel}) => {
  const {toast} = useToast();

  const organizations = useAppSelector(state => state.financial.organizations);
  const accounts = useAppSelector(state => state.financial.accounts);
  const transactionCategories = useAppSelector(state => state.financial.transactionCategories);

  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<TransactionFormData>({
    organizationId: 0,
    transactionType: 'expense',
    amount: 0,
    currency: CURRENCY.USD,
    accountId: 0,
    categoryId: 0,
    transactionDate: new Date(),
    exchangeRate: 1,
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => account.organizationId === formData.organizationId);
  }, [formData.organizationId, accounts]);

  // Filter categories based on selected transaction type
  const filteredCategories = useMemo(() => {
    return transactionCategories.filter(category => category.type === formData.transactionType);
  }, [formData.transactionType]);

  // Reset categoryId when transaction type changes
  const handleTransactionTypeChange = (value: 'expense' | 'income') => {
    setFormData(prev => ({
      ...prev,
      transactionType: value,
      categoryId: 0 // Reset category when type changes
    }));
  };

  const handleInputChange = (field: keyof TransactionFormData, value: number | string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      // Prepare the transaction data
      const transactionData: Transaction = {
        ...formData,
        transactionDate: formatDate(formData.transactionDate),
        amount: Number(formData.amount)
      };

      await createTransaction(transactionData);

      toast({
        title: 'Transaction created successfully',
        description: 'The transaction has been successfully created.'
      });

      onCancel();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Select
            value={formData.organizationId.toString()}
            onValueChange={value => handleInputChange('organizationId', Number(value))}>
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(organization => (
                <SelectItem key={organization.id} value={organization.id.toString()}>
                  {organization.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select value={formData.transactionType} onValueChange={handleTransactionTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TRANSACTION_TYPE.EXPENSE}>Expense</SelectItem>
              <SelectItem value={TRANSACTION_TYPE.INCOME}>Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId.toString()}
            onValueChange={value => handleInputChange('categoryId', Number(value))}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex space-x-2">
            <Select
              value={formData.currency}
              onValueChange={value => handleInputChange('currency', value)}
              defaultValue={CURRENCY.USD}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CURRENCY.USD}>{CURRENCY.USD}</SelectItem>
                <SelectItem value={CURRENCY.THB}>{CURRENCY.THB}</SelectItem>
                <SelectItem value={CURRENCY.USDT}>{CURRENCY.USDT}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="flex-1"
              value={formData.amount || ''}
              onChange={e => handleInputChange('amount', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select
            value={formData.accountId.toString()}
            onValueChange={value => handleInputChange('accountId', Number(value))}>
            <SelectTrigger id="account">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {filteredAccounts.map(account => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {formatLongDate(transactionDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={transactionDate}
                onSelect={newDate => {
                  if (newDate) {
                    setTransactionDate(newDate);
                    handleInputChange('transactionDate', newDate);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter transaction description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.organizationId ||
            !formData.transactionType ||
            !formData.amount ||
            !formData.accountId ||
            !formData.categoryId
          }>
          {isLoading ? 'Creating...' : 'Create Transaction'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
