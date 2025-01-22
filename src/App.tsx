import { RouterProvider } from 'react-router-dom';
import { QubicConnectProvider } from './components/connect/QubicConnectContext';
import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { WalletConnectProvider } from './components/connect/WalletConnectContext';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="bg-background text-foreground dark">
      <QueryClientProvider client={queryClient}>
        <WalletConnectProvider>
          <QubicConnectProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#202E3C',
                  color: '#fff',
                },
              }}
            />
          </QubicConnectProvider>
        </WalletConnectProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
