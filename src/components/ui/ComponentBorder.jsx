import styles from './ComponentBorder.module.css'

function ComponentBorder({ title="title", children }) {
  return (
    <div className={styles.boxContainer}>
      <h2 className={styles.boxTitle}>{ title }</h2>
      <div className={styles.boxBorder}>
        { children }
      </div>
    </div>
  )
}

export default ComponentBorder;