"use client";
import React, { useEffect, useState } from 'react';
import styles from './team.module.css';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const TeamPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/testProjectsData/userData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Team</h1>
      <div className={styles.userGrid}>
        {users.map((user) => (
          <Link href={`/team/${user.id}`} key={user.id} className={styles.userCard}>
            <img src={user.avatar} alt={user.name} className={styles.avatar} />
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userRole}>{user.role}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;