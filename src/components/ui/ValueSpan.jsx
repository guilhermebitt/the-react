// Dependencies
import React from "react";
import { useEffect, useState, useRef } from 'react';

// Stylesheets
import styles from './ValueSpan.module.css';

// Value span component
const ValueSpan = React.memo(function ValueSpan({ spanMessages, entityUpdater }) {
  const [updating, setUpdating] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // If there are no messages, do nothing
    if (!spanMessages || spanMessages.length === 0) return;

    // Clear any previous timer when a new message appears
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set the "updating" flag to true (messages are currently visible)
    setUpdating(true);

    // Start a new 2-second timer
    timerRef.current = setTimeout(() => {
      // After 2 seconds with no new messages, clear them
      entityUpdater({ spanMessages: [] });

      // Reset the updating state
      setUpdating(false);
    }, 2000);

    // Cleanup: if the component unmounts or spanMessages changes again,
    // clear the existing timer to avoid memory leaks or overlapping timers.
    return () => clearTimeout(timerRef.current);
  }, [spanMessages]); // 👈 Effect runs every time the spanMessages array changes

  return (
    <div className={styles.valueContainer}>
      {/* Render each message as a span */}
      {spanMessages.map((msg, index) => (
        <span key={index}>{msg?.value}</span>
      ))}
    </div>
  );
});

export default ValueSpan;
