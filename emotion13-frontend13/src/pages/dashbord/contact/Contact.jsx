import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Loader from '../../../com/loader/Loader';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const token = localStorage.getItem('userToken');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
          console.log('Messages from API:', res.data); // هنا

      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete the message?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/admin/messages/reply',
        {
          email: selectedMessage.email,
          replyText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowReplyModal(false);
      alert('Reply sent successfully');
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send the reply');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <h3 className="mb-4">User Messages</h3>
      {loading ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
             <th>Name</th>
<th>Email</th>
<th>Message</th>
<th>Date</th>
<th>Actions</th>

            </tr>
          </thead>
         <tbody>
  {messages.map((msg) => {
    console.log(msg.created_at); // هنا
    return (
      <tr key={msg.id}>
        <td>{msg.name || '—'}</td>
        <td>{msg.email}</td>
        <td>{msg.message}</td>
        <td>
          {msg.created_at && !isNaN(new Date(msg.created_at).getTime())
            ? new Date(msg.created_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'No Date'}
        </td>
        <td className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => openReplyModal(msg)}>
            Replay
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(msg.id)}>
            DELETE
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>

        </Table>
      )}

      {/* مودال الرد */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <p><strong>Name:</strong> {selectedMessage?.name}</p>
<p><strong>Email:</strong> {selectedMessage?.email}</p>
<p><strong>Original Message:</strong> {selectedMessage?.message}</p>

          <Form.Group className="mt-3">
            <Form.Label>Reply Text:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
           Close
          </Button>
          <Button variant="success" onClick={sendReply}>
          Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
