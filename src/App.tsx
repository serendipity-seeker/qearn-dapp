import { RouterProvider } from 'react-router-dom';
import { QubicConnectProvider } from './components/connect/QubicConnectContext';
import router from './router';

function App() {
  return (
    <QubicConnectProvider>
      <RouterProvider router={router} />
    </QubicConnectProvider>
  );
}

export default App;
