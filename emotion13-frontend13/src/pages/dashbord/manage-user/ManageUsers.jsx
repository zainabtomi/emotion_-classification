import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import styles from './ManageUsers.module.css';
import Loader from '../../../com/loader/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response:', response.data);

      setUsers(response.data);

    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>User Management</h3>

      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tableWrapper}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Active?</th>
                <th>Number of Analyses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.is_verified ? 'Yes' : 'No'}</td>
                    <td>{user.analysis_count || 0}</td>

                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className={styles.actionBtn}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    No users currently available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
