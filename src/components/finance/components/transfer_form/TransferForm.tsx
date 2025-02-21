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

import {createTransaction, createTransfer} from 'services/apiService';

interface TransferFormProps {
  onCancel: () => void;
}

interface TransferFormData {
  organizationId: number;
  fromAccountId: number;
  toAccountId: number;
  categoryId: number;
  amount: number;
  currency: string;
  exchangeRate: number;
  transferDate: Date;
  description: string;
}

const TransferForm: FC<TransferFormProps> = ({onCancel}) => {
  const {toast} = useToast();

  const organizations = useAppSelector(state => state.financial.organizations);
  const accounts = useAppSelector(state => state.financial.accounts);
  const transactionCategories = useAppSelector(state => state.financial.transactionCategories);

  const [formData, setFormData] = useState<TransferFormData>({
    organizationId: 0,
    fromAccountId: 0,
    toAccountId: 0,
    categoryId: 0,
    amount: 0,
    currency: CURRENCY.USD,
    exchangeRate: 1,
    transferDate: new Date(),
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => account.organizationId === formData.organizationId);
  }, [formData.organizationId, accounts]);

  const transferCategories = useMemo(() => {
    return transactionCategories.filter(category => category.type === TRANSACTION_TYPE.TRANSFER);
  }, [transactionCategories]);

  const handleInputChange = (field: keyof TransferFormData, value: number | string | Date) => {
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
        organizationId: formData.organizationId,
        categoryId: formData.categoryId,
        accountId: formData.fromAccountId,
        amount: Number(formData.amount),
        currency: formData.currency,
        exchangeRate: Number(formData.exchangeRate),
        transactionDate: formatDate(formData.transferDate),
        transactionType: TRANSACTION_TYPE.TRANSFER,
        description: formData.description
      };

      const response = await createTransaction(transactionData);

      const transactionId = response?.insert_finance_transactions_one?.id;

      const transferData: Transfer = {
        transactionId,
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        fromAmount: Number(formData.amount),
        toAmount: Number(formData.amount) * Number(formData.exchangeRate),
        exchangeRate: Number(formData.exchangeRate)
      };

      await createTransfer(transferData);

      toast({
        title: 'Transfer created successfully',
        description: 'The transfer has been successfully created.'
      });

      onCancel();
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast({
        title: 'Error',
        description: 'Failed to create transfer. Please try again.',
        variant: 'destructive'
      });
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
          <Label htmlFor="fromAccount">From Account</Label>
          <Select
            value={formData.fromAccountId.toString()}
            onValueChange={value => handleInputChange('fromAccountId', Number(value))}>
            <SelectTrigger id="fromAccount">
              <SelectValue placeholder="Select source account" />
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
          <Label htmlFor="toAccount">To Account</Label>
          <Select
            value={formData.toAccountId.toString()}
            onValueChange={value => handleInputChange('toAccountId', Number(value))}>
            <SelectTrigger id="toAccount">
              <SelectValue placeholder="Select destination account" />
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
          <Label htmlFor="category">Transfer Category</Label>
          <Select
            value={formData.categoryId.toString()}
            onValueChange={value => handleInputChange('categoryId', Number(value))}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select transfer category" />
            </SelectTrigger>
            <SelectContent>
              {transferCategories.map(category => (
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
          <Label htmlFor="exchangeRate">Exchange Rate</Label>
          <Input
            id="exchangeRate"
            type="number"
            step="0.0001"
            placeholder="1.0000"
            className="flex-1"
            value={formData.exchangeRate}
            onChange={e => handleInputChange('exchangeRate', e.target.value)}
          />
          <p className="text-xs text-gray-500">Leave as 1.0 if same currency</p>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {formatLongDate(formData.transferDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formData.transferDate}
                onSelect={newDate => {
                  if (newDate) {
                    handleInputChange('transferDate', newDate);
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
            placeholder="Enter transfer description"
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
            !formData.fromAccountId ||
            !formData.toAccountId ||
            !formData.amount
          }>
          {isLoading ? 'Processing...' : 'Create Transfer'}
        </Button>
      </div>
    </form>
  );
};

export default TransferForm;
