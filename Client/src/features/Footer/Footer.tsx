import Styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={Styles.footer}>
      <p className={Styles.title}>Bookify. Crafted By Me, Ibrahim Zaidi</p>
      <p className={Styles.subTitle}>
        with pure devotion <span className={Styles.heart}>♥</span>
      </p>
    </div>
  );
}

export default Footer;
