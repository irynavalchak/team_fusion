import React, {FC} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from 'components/ui/card';

import {useAppSelector} from 'redux_state/hooks';

const Accounts: FC = () => {
  const accounts = useAppSelector(state => state.financial.accounts);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Account
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => {
                return (
                  <tr key={account.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{account.name}</td>
                    <td className="px-6 py-4">{account.accountType}</td>
                    <td className="px-6 py-4 text-right">${account.currentBalance.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Accounts;
