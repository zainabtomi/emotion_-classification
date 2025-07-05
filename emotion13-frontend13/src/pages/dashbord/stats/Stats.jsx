import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Loader from '../../../com/loader/Loader';
import styles from './Stats.module.css';

// 10 ألوان متناسبة مع المشاعر المطلوبة
const baseColors = [
  '#0088FE', // Admiration
  '#FF4444', // Anger
  '#228B22', // Fear
  '#FFBB28', // Happiness
  '#00C49F', // Hope
  '#FF66CC', // Love
  '#9933FF', // Oppressed Sorrow
  '#C71585', // Sarcasm
  '#FF8C00', // Yearning
  '#00BFFF', // other
];

const getRandomColor = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const emotionsList = [
  'Admiration',
  'Anger',
  'Fear',
  'Happiness',
  'Hope',
  'Love',
  'Oppressed Sorrow',
  'Sarcasm',
  'Yearning',
  'other',
];

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (!user.is_admin) {
      navigate('/index');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get('http://localhost:8000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader />
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.errorWrapper}>
        <p>{error || 'Unable to load statistics.'}</p>
      </div>
    );
  }

  
  const chartData = emotionsList.map((emotion) => {
    return {
      name: emotion,
      value: stats.emotionDistribution?.[emotion] || 0,
    };
  }).filter(item => item.value > 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}> Statistics</h3>

      <Row className={styles.statsCard}>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>Users Count</h5>
              <div className={styles.statsNumber}>{stats.usersCount}</div>
            </Card.Body>
          </Card>
        </Col>

      

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>Sentences Count</h5>
              <div className={styles.statsNumber}>{stats.totalSentences}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={10} className="mx-auto">
          <Card className={styles.chartCard}>
            <Card.Body>
              <div className={styles.chartTitle}>Emotion Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                {chartData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, idx) => {
                        const emotionIndex = emotionsList.indexOf(entry.name);
                        return (
                          <Cell
                            key={`cell-${idx}`}
                            fill={baseColors[emotionIndex] || getRandomColor()}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className={styles.noData}>No data available for chart.</div>
                )}
              </ResponsiveContainer>

              {/* Legend مخصص خارج الـ ResponsiveContainer */}
              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {emotionsList.map((emotion, i) => (
                  <div
                    key={emotion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'default',
                      fontSize: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: baseColors[i],
                        borderRadius: 4,
                        border: '1px solid #ccc',
                        marginRight: 8,
                      }}
                    />
                    {emotion}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
