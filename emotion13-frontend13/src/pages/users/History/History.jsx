import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import styles from './History.module.css';
import { UserContext } from '../../../context/UserContext';
import { Spinner, Alert, Table } from 'react-bootstrap';

const History = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
      const token = localStorage.getItem('userToken');

        const res = await axios.get('http://localhost:8000/api/user/history'
, {
          headers: { Authorization: `Bearer ${token}` },
    
        });
console.log('Token:', token);

        const data = res.data;

        // Ensure the data is an array
        if (Array.isArray(data)) {
          setHistory(data);
        } else if (Array.isArray(data.data)) {
          setHistory(data.data);
        } else {
          throw new Error('Invalid data received');
        }

      } catch (err) {
        console.error('Fetch history error:', err);
        setError('Failed to load analysis history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.historyPage}>
      <h2 className={styles.title}>Analysis History</h2>

      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : history.length === 0 ? (
        <Alert variant="info" className="text-center">No records found yet</Alert>
      ) : (
        <div className={styles.tableWrapper}>
          <Table striped bordered hover responsive className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Text</th>
                <th>Sentiment</th>
                <th>Analysis Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                <td>{item.sentence}</td> 
      <td>{item.label}</td>     
                <td>{new Date(item.created_at).toLocaleString()}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default History;


