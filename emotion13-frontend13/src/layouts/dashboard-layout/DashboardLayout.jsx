import React from 'react';
import AdminSidebar from '../../com/dashbord/sidebar/AdminSidebar';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import { Container } from 'react-bootstrap';

export default function DashboardLayout() {
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>
      <main className={styles.content}>
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}



