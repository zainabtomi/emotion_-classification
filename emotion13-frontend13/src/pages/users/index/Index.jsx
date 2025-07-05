import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './Index.module.css';
import { FiUploadCloud } from 'react-icons/fi';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Index() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [totalSentences, setTotalSentences] = useState(0);
  const fileInputRef = useRef(null);

  const handleAnalyzeText = async () => {
    if (!text.trim()) return alert('Please enter a sentence first');

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        'http://localhost:8000/api/analysis/analyze',
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults([response.data.analysis]);
      setChartData(null);
      setTotalSentences(1);
    } catch (error) {
      console.error(error);
      alert('An error occurred while analyzing the sentence');
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        'http://localhost:8000/api/analysis/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { percentages = {}, total = 0, detailed = [] } = response.data || {};

      const emotionColors = {
        Admiration: '#FFD700',
        Anger: '#FF6347',
        Fear: '#8A2BE2',
        Happiness: '#00FA9A',
        Hope: '#1E90FF',
        Love: '#FF69B4',
        'Oppressed Sorrow': '#708090',
        Sarcasm: '#FFA500',
        Yearning: '#20B2AA',
        other: '#D3D3D3',
      };

      const labels = Object.keys(percentages);
      const values = Object.values(percentages);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Percentage of Each Sentence Category (%)',
            data: values,
            backgroundColor: labels.map((label) => emotionColors[label] || '#cccccc'),
            borderRadius: 6,
          },
        ],
      });

      setResults(detailed);
      setTotalSentences(total);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('An error occurred while uploading the file or analyzing');
    }
  };

  const handleDownloadCSV = () => {
    if (!results.length) return;

    const headers = ['Sentence', 'Label', 'Confidence'];
    const csvContent = [
      headers.join(','),
      ...results.map((item) =>
        [
          `"${item.sentence || item.text}"`,
          item.label,
          (item.confidence * 100).toFixed(2) + '%',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analysis_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.centeredContent}>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="Write a sentence to analyze..."
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className={styles.iconButton}
            onClick={() => fileInputRef.current.click()}
            title="Upload CSV or TXT file"
          >
            <FiUploadCloud size={20} />
          </button>
          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        <button className={styles.button} onClick={handleAnalyzeText}>
          Analyze Sentence
        </button>
      </div>

      {chartData?.labels?.length > 0 && (
        <div className={styles.chartContainer}>
          <h3 className={styles.whiteTitle}>Category Chart ({totalSentences} sentences)</h3>
          <Pie data={chartData} />
          <button className={styles.button} onClick={handleDownloadCSV}>
            Download Results as CSV
          </button>
        </div>
      )}

      {Array.isArray(results) && results.length > 0 && totalSentences === 1 && (
        <div className={styles.resultCard}>
          <h3>Results Details:</h3>
          <table className={styles.resultTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Sentence</th>
                <th>Category</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.sentence || item.text}</td>
                  <td>{item.label}</td>
                  <td>{(item.confidence * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

