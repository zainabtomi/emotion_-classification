import React from 'react';
import CustomNavbar from '../../com/users/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import styles from './UserLayout.module.css'; 
import Footer from '../../com/users/Footer/Footer';
import { Container } from 'react-bootstrap';

export default function UserLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.overlay}>
        <CustomNavbar />
        <Container fluid className="py-4">
          <Outlet />
        </Container>
        <Footer />
      </div>
    </div>
  );
}