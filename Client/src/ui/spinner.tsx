import styles from "./spinner.module.css";

function Spinner({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.spinnerFullpage}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}>{children}</div>
      </div>
    </div>
  );
}

export default Spinner;
