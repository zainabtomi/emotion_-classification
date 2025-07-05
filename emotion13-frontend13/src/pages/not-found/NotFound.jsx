import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h4>Page Not Found!</h4>
      <p>We're sorry, but the page you were looking for doesn't exist.</p>
      <Button onClick={() => navigate('/home')} className={styles.customBtn}>
  Back Home
</Button>

    </div>
  );
}
