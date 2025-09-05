// Dependencies
import { useEffect, useRef, useState } from 'react';

// Stylesheet
import styles from './ComponentBorder.module.css';



function ComponentBorder({ title='title', boxStyles={}, titleStyles={}, borderStyles={}, children}) {
  const boxRef = useRef(null); // This will be used to link this component with the HTML element
  const [titleWidth, setTitleWidth] = useState(null);

  useEffect(() => {
    if (!boxRef.current) return;

    // Getting the width of the title in this component
    setTitleWidth(boxRef.current.children[0].clientWidth); // plus +10px of padding

    // Updates the CSS Variable
    boxRef.current.style.setProperty('--title-wdt', titleWidth + 'px');

  }, [titleWidth]);

  return (
    // Here I am using boxRef, where each one will be different within the components
    <div ref={boxRef} className={styles.boxContainer} style={boxStyles}>
      <h2 className={styles.boxTitle} style={titleStyles}>{title}</h2>
      <div className={styles.boxBorder} style={borderStyles}>{children}</div>
    </div>
  );
}

export default ComponentBorder;
