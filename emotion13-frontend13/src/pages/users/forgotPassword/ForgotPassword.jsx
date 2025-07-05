import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import GradientButton from "../../../com/users/Button/Button";
import styles from '../login/Login.module.css';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/auth/forgot-password', {
        email: data.email,
      });
      toast.success('Check your email for the verification code.');
      navigate('/verify-code', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
        <div className={styles.iconAbove}></div>

        <h2 className={styles.signInTitle}>Forgot Password</h2>

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="Enter your email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            <p className={styles.fieldError}>
              {errors.email?.message || ''}
            </p>
          </div>

          {/* Submit button using GradientButton */}
          <GradientButton
            text={isLoading ? 'Sending...' : 'Send Code'}
            type="submit"
            disabled={isLoading}
            onClick={null}
          />
        </div>
      </form>
    </div>
  );
}

