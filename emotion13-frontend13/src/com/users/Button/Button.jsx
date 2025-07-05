import React from 'react';
import styles from './Button.module.css';

const GradientButton = ({ text, onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      className={styles.gradientButton}
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      {text}
    </button>
  );
};

export default GradientButton;

