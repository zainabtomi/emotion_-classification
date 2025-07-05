import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pro-sidebar/dist/css/styles.css';
import './index.css';
import UserProvider from './context/UserContext';  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
