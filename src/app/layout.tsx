import type {Metadata} from 'next';
import {Toaster} from 'components/ui/toaster';
import {ToastContainer} from 'react-toastify';

import {Providers} from 'redux_state/provider';

import AppPage from 'components/AppPage';
import NavBar from 'components/common/NavBar';
import ProtectedLayout from './protected-layout';

import 'bootstrap/dist/css/bootstrap.min.css';

import './globals.css';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Team Fusion'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppPage>
            <ProtectedLayout>
              <NavBar />
              <main style={{marginTop: '56px'}}>{children}</main>
            </ProtectedLayout>
            <Toaster />
            <ToastContainer position="bottom-left" />
          </AppPage>
        </Providers>
      </body>
    </html>
  );
}
