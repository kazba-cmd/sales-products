import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';
//
import DashboardApp from 'pages/DashboardApp';
import Login from 'pages/Login';
import MealMenu from 'pages/MealMenu';
import CookingTracking from 'pages/CookingTracking';
import Blog from 'pages/Blog';
import User from 'pages/User';
import NotFound from 'pages/Page404';
import IssueTracking from 'pages/IssueTracking';
import CashBox from 'pages/CashBox';
import CashCheckout from 'pages/CashCheckout';
import IssueScreenLayout from './layouts/IssueScreenLayout';
import Test from './pages/Test';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/cash-box" replace /> },
        { path: 'cash-box', element: <CashBox /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'meal-menu', element: <MealMenu /> },
        { path: 'cooking-tracking', element: <CookingTracking /> },
        { path: 'issue-tracking', element: <IssueTracking /> },
        { path: 'blog', element: <Blog /> },
        { path: 'cash-checkout', element: <CashCheckout /> },
        { path: 'ws-test', element: <Test /> },
        //
        { path: '404', element: <NotFound /> }
      ]
    },
    { path: 'issue-screen', element: <IssueScreenLayout /> },
    {
      path: '/auth',
      element: <LogoOnlyLayout />,
      children: [{ path: 'login', element: <Login /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
