import React, { useState } from "react";
import axios from "axios";
import styles from "../login/Login.module.css";
import GradientButton from "../../../com/users/Button/Button"; 

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
          'http://localhost:8000/api/contact',

        { name, email, message },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
    setAlert({ type: "success", text: "Your message was sent successfully!" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setAlert({ type: "danger", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.signInTitle}>📩 Contact Us</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Enter your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className={styles.input}
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          {alert.text && (
            <div
              className={
                alert.type === "success"
                  ? styles.successAlert
                  : styles.errorAlert
              }
            >
              {alert.text}
            </div>
          )}

          <GradientButton
            type="submit"
            text={loading ? "جاري الإرسال..." : "Send Message"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default ContactUs;




