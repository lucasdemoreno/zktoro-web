"use client";

import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};
