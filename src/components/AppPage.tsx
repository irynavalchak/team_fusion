'use client';

import React, {FC} from 'react';
import {SessionProvider} from 'next-auth/react';

interface Props {
  children?: React.ReactNode;
}

const AppPage: FC<Props> = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AppPage;
