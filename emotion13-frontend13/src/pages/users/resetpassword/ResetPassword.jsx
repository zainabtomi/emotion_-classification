import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import GradientButton from "../../../com/users/Button/Button";


import styles from '../login/Login.module.css'; 

export default function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get('email');
  const code = searchParams.get('code');

useEffect(() => {
  if (!email) {
    navigate('/forgot-password');
  } else {
    console.log('Email passed to VerifyCode:', email);  
  }
}, [email, navigate]);


 const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    await axios.post('http://localhost:8000/auth/reset-password', {
      email,
      token: code,
      newPassword: data.new_password,
    });
    toast.success('Password has been reset successfully!');
    navigate('/login');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to reset password.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
        <h2 className={styles.signInTitle}>Reset Password</h2>

        <div className={styles.formGroup}>
          <input
            {...register('new_password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            type="password"
            placeholder="New Password"
            className={`${styles.input} ${errors.new_password ? styles.inputError : ''}`}
          />
          <p className={styles.fieldError}>
            {errors.new_password?.message || ''}
          </p>
        </div>

        <div className={styles.formGroup}>
          <input
            {...register('confirm_password', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('new_password') || 'Passwords do not match',
            })}
            type="password"
            placeholder="Confirm Password"
            className={`${styles.input} ${errors.confirm_password ? styles.inputError : ''}`}
          />
          <p className={styles.fieldError}>
            {errors.confirm_password?.message || ''}
          </p>
        </div>

        <GradientButton
          text={isLoading ? 'Processing...' : 'Reset'}
          type="submit"
          disabled={isLoading}
          onClick={null}
        />
      </form>
    </div>
  );
}


