import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './UserLayout/UserLayout.module.css'; 

export default function UserLayout() {
  return (
    <div className={styles.background}>
      <div className={styles.overlay}>
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}