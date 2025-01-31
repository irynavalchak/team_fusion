import React, {FC} from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from 'components/ui/card';

import TRANSACTION_TYPE from 'constants/transactionType';

interface Props {
  transactions: Transaction[];
  activeMonth: Date;
}

const MonthlyFinanceChart: FC<Props> = ({transactions, activeMonth}) => {
  const chartData = transactions
    .filter(transaction => {
      try {
        const date = new Date(transaction.transactionDate);
        return date.getMonth() === activeMonth.getMonth() && date.getFullYear() === activeMonth.getFullYear();
      } catch (e) {
        console.error('Error filtering transaction:', e);
        return false;
      }
    })
    .map(transaction => ({
      day: new Date(transaction.transactionDate).getDate(),
      income: transaction.transactionType === TRANSACTION_TYPE.INCOME ? transaction.amount : 0,
      expenses: transaction.transactionType === TRANSACTION_TYPE.EXPENSE ? transaction.amount : 0
    }))
    .sort((a, b) => a.day - b.day);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" type="number" domain={[0, 31]} />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} labelFormatter={day => `Day ${day}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" dot={{r: 4}} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" dot={{r: 4}} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyFinanceChart;
