'use client';

import React from 'react';
import styles from './profile.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <p>This is the profile page.</p>
    </div>
  );
};

export default ProfilePage;
