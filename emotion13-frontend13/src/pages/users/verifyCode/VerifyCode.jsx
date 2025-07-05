import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

import GradientButton from "../../../com/users/Button/Button";
import styles from '../login/Login.module.css';

export default function VerifyCode() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  console.log('Email in VerifyCode:', email);
  if (!email) {
    navigate('/forgot-password');
  }
}, [email, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8000/auth/verify-reset-code', {
        email,
        token: data.code.trim(),
      });
      toast.success('Code verified successfully.');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.code.trim())}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
        <h2 className={styles.signInTitle}>Verify Code</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Enter the verification code</label>
          <input
            {...register('code', { required: 'Verification code is required' })}
            type="text"
            placeholder="Enter the code sent to your email"
            className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
          />
          <p className={styles.fieldError}>{errors.code?.message || ''}</p>
        </div>

        <GradientButton
          text={isLoading ? 'Verifying...' : 'Verify'}
          type="submit"
          disabled={isLoading}
          onClick={null}
        />
      </form>
    </div>
  );
}
