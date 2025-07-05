import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import Loader from '../../../com/loader/Loader';

export default function AdminLogsPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLabel, setFilterLabel] = useState('');

  const token = localStorage.getItem('userToken');

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/admin/analyses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, label: filterLabel },
      });
      setAnalyses(res.data);
    } catch (err) {
      console.error('Error fetching analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnalyses();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return (
    <div className="p-4">
      <h3 className="mb-4">Analysis Logs</h3>

      <div className="d-flex gap-2 mt-3 mb-2">
        <Form.Control
          type="text"
          placeholder="Search for sentence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Select
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value)}
        >
          <option value="">All Emotions</option>
          <option value="Admiration">Admiration</option>
          <option value="Anger">Anger</option>
          <option value="Fear">Fear</option>
          <option value="Happiness">Happiness</option>
          <option value="Hope">Hope</option>
          <option value="Love">Love</option>
          <option value="Oppressed Sorrow">Oppressed Sorrow</option>
          <option value="Sarcasm">Sarcasm</option>
          <option value="Yearning">Yearning</option>
          <option value="other">other</option>
        </Form.Select>

        <Button onClick={fetchAnalyses}>Refresh</Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Sentence</th>
              <th>Emotion</th>
              <th>Confidence</th> {/* عمود الدقة */}
              <th>User</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((item) => (
              <tr key={item.id}>
                <td>{item.sentence}</td>
                <td>{item.label}</td>
                <td>{(item.confidence * 100).toFixed(2)}%</td> {/* عرض الدقة */}
                <td>{item.userName}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
