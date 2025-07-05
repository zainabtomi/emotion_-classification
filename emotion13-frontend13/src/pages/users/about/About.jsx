import React from 'react';
import Circle from '../../../com/users/circle/Circle';
import styles from './About.module.css';

import developerGrey from "../../../assets/images/developerGrey.svg";
import developerPurple from "../../../assets/images/developerPurple.svg";

const teamMembers = [
  {
    name: "shahed safi",
    role: "Computer System enginer",
    image: developerGrey,
  },
  {
    name: "zainab tomeh",
    role: "Computer System enginer",
    image: developerPurple,
  },
];

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.circleTopLeft}>
        <Circle />
      </div>

      <div className={styles.headerWrapper}>
        <div className={styles.content}>

          {/* About Section */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionDot} />
              <p>About our website</p>
            </div>
            <div className={styles.aboutText}>
              <p>
               We are an intelligent platform specialized in analyzing and classifying emotions in Arabic sentences, aiming to empower individuals and organizations to better understand the emotional content of texts.
              </p>
              <p>
               Our goal is to facilitate Arabic language processing through AI technologies, enabling users to analyze comments, detect sentiments, and interpret emotional 
               expressions across various contexts—whether in education, customer service, media, marketing, or social platforms.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className={styles.teamSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionDot} />
              <h3>Our team</h3>
            </div>

            <div className={styles.teamGrid}>
              {teamMembers.map((member, idx) => (
                <div key={idx} className={styles.memberCard}>
                  <img src={member.image} alt={member.name} className={styles.memberImage} />
                  <div>
                    <h5>{member.name}</h5>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <div className={styles.circleBottomRight}>
        <Circle />
      </div>
    </div>
  );
}

export default About;





