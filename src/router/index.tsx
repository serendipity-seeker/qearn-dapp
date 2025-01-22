import Layout from '@/layouts';
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '@/pages/error404';
import Settings from '@/pages/settings';
import Helpers from '@/pages/helpers';
import Welcome from '@/pages/welcome';
import Faq from '@/pages/faq';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/helpers',
        element: <Helpers />,
      },
      {
        path: '/faq',
        element: <Faq />,
      },
    ],
  },
]);

export default router;
