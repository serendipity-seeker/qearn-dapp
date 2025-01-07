import { RouterProvider } from 'react-router-dom';
import { QubicConnectProvider } from './components/connect/QubicConnectContext';
import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
