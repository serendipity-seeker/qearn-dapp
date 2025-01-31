import { RouterProvider } from 'react-router-dom';
import { QubicConnectProvider } from './components/connect/QubicConnectContext';
import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { WalletConnectProvider } from './components/connect/WalletConnectContext';
import { useAtom } from 'jotai';
import { settingsAtom } from './store/settings';

const queryClient = new QueryClient();

function App() {
  const [settings] = useAtom(settingsAtom);
  return (
    <div className={`bg-background text-foreground font-space ${settings.darkMode ? 'dark' : ''}`}>
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
