'use client';

import React from 'react';

import styles from './Confirmation.module.css';

interface ConfirmationProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({isOpen, message, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.confirmationPopup}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonsContainer}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
