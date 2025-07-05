import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SidebarFooter } from 'react-pro-sidebar';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import { FiLogOut } from 'react-icons/fi';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
toast.success('Logged out successfully');
    navigate('/login');
  };

  const links = [
    { path: '/dashboard/users', label: 'User Management' },
    { path: '/dashboard/sentences', label: 'Sentence Management' },
    { path: '/dashboard/stats', label: 'Statistics' },
    { path: '/dashboard/contact', label: 'Contact' },
    
  ];

  return (
    <ProSidebar breakPoint="md" className={styles.sidebar}>
      <Menu iconShape="circle" className={styles.menuContent}>
        {links.map(link => (
          <MenuItem
            key={link.path}
            className={`${styles.menuItem} ${
              location.pathname === link.path ? styles.active : ''
            }`}
          >
            <Link className={styles.link} to={link.path}>
              {link.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>

      <SidebarFooter className={styles.footer}>
        <Menu iconShape="circle">
          <MenuItem
            className={styles.logoutButton}
            icon={<FiLogOut />}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
}

