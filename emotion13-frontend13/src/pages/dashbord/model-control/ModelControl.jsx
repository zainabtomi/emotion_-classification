import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Card, Button, Form } from "react-bootstrap";
import styles from "./ModelControl.module.css";

const ModelControl = () => {
  const [modelInfo, setModelInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchModelSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:8000/api/model/settings");
      setModelInfo(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load model settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelSettings();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!file) {
      setError("Please select a file first");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit example
      setError("File size should be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:8000/api/model/upload-data", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("File uploaded successfully");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRetrain = async () => {
    setError("");
    setSuccessMsg("");
    if (!window.confirm("Are you sure you want to retrain the model?")) return;
    try {
      setTraining(true);
      await axios.post("http://localhost:8000/api/model/retrain");
      setSuccessMsg("Model retrained successfully");
      fetchModelSettings();
    } catch (err) {
      console.error(err);
      setError("Training failed");
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Model Settings & Control</h2>

      {loading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card className={styles.card}>
          <Card.Body>
            <Card.Title>Model Information</Card.Title>
            <ul>
              <li>
                <strong>Accuracy:</strong>{" "}
                {modelInfo.accuracy ?? "N/A"}
              </li>
              <li>
                <strong>F1 Score:</strong>{" "}
                {modelInfo.f1_score ?? "N/A"}
              </li>
              <li>
                <strong>Recall:</strong>{" "}
                {modelInfo.recall ?? "N/A"}
              </li>
              <li>
                <strong>Last Trained:</strong>{" "}
                {modelInfo.last_trained
                  ? new Date(modelInfo.last_trained).toLocaleString()
                  : "N/A"}
              </li>
            </ul>
          </Card.Body>
        </Card>
      )}

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {error && !loading && <Alert variant="danger">{error}</Alert>}

      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>Upload New Dataset</Card.Title>
          <Form onSubmit={handleUpload}>
            <Form.Group>
              <Form.Label>Select CSV File</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Dataset"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>Retrain Model</Card.Title>
          <Button variant="danger" onClick={handleRetrain} disabled={training}>
            {training ? "Training..." : "Retrain Model"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ModelControl;
