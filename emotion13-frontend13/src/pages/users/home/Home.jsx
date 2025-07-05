
import React from 'react';
import styles from './Home.module.css';
import GradientButton from '../../../com/users/Button/Button';
import { Link } from 'react-router-dom';


import computerImage from '../../../assets/images/Frame.svg';


const WelcomePage = () => {
  return (
    <div className={styles.container}>
      {/* القسم الأيسر: عنوان، وصف، ومجموعة الأزرار */}
      <div className={styles.content}>
        <h1 className={styles.title}>WELCOME TO EMOTION CLASSIFICATION</h1>
        <p className={styles.description}>
               Every word
        carries a feeling...
        Have you discovered it?
        </p>

        <div className={styles.buttonGroup}>
          
          <Link to="/login" className={styles.linkWrapper}>
            <GradientButton text="Login" variant="filled" />
          </Link>

           
          <Link to="/register" className={styles.linkWrapper}>
            <GradientButton text="Sign Up" variant="filled" />
          </Link>
        </div>
      </div>

      {/* القسم الأيمن: صورة الكمبيوتر */}
      <div className={styles.imageWrapper}>
        <img
          src={computerImage}
          alt="Computer Illustration"
          className={styles.computerImage}
        />
      </div>
    </div>
  );
};

export default WelcomePage;










