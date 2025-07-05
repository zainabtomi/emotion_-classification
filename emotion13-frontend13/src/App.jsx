import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout'; // بدون Navbar
import UserLayout from './layouts/UserLayout/UserLayout'; // مع Navbar
import DashboardLayout from './layouts/dashboard-layout/DashboardLayout';
import Register from './pages/users/register/Register';
import Login from './pages/users/login/Login';
import Home from './pages/users/home/Home';
import About from './pages/users/about/About';
import Help from './pages/users/help/Help';
import ForgotPassword from './pages/users/forgotPassword/ForgotPassword';
import VerifyCode from './pages/users/verifyCode/VerifyCode';
import ResetPassword from './pages/users/resetpassword/ResetPassword';
import Index from './pages/users/index/Index';
import ManageUsers from './pages/dashbord/manage-user/ManageUsers';
import ManageSentences from './pages/dashbord/manage-sentence/ManageSentence';
import Stats from './pages/dashbord/stats/Stats';
import Contact from './pages/dashbord/contact/Contact';
import NotFound from './pages/not-found/NotFound';
import History from './pages/users/History/History';
import AdminRoute from './utils/AdminRoute'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModelControl from './pages/dashbord/model-control/ModelControl';

export default function App() {
  const router = createBrowserRouter([
    
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'verify-code', element: <VerifyCode /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'history', element: <History /> },
      ],
    },

  
    {
      path: '/',
      element: <UserLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'home', element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'help', element: <Help /> },
        { path: 'index', element: <Index /> },
      ],
    },

    
    {
      path: '/dashboard',
      element: (
       
          <DashboardLayout />
       
      ),
      children: [
        { path: 'users', element: <ManageUsers /> },
        { path: 'sentences', element: <ManageSentences /> },
        { path: 'stats', element: <Stats /> },
          { path: 'model', element: <ModelControl /> },
               { path: 'contact', element: <Contact /> },
      ],
    },

   
    { path: '*', element: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}
