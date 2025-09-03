import Style from "./Welcoming.module.css";
import logo from "../../assets/B.svg";

function Welcoming() {
  return (
    <div className={Style.container}>
      <div className={Style.navbar}>
        <div>
          <img src={logo} className={Style.logo} />
          <span className={Style.logoTitle}>ookify</span>
        </div>
        <div>
          <button className={Style.loginBtn}>Login</button>
          <button className={Style.registerBtn}>Register</button>
        </div>
      </div>
      <div className={Style.welcomingContent}>
        <div className={Style.textContent}>
          <h1 className={Style.title}>
            Welcome to <span>Bookify</span>
          </h1>
          <p>
            your best bet for quality bookings. Dive into our extensive
            collection right here
          </p>
          <button className={Style.exploreBtn}>Explore Now</button>
        </div>
        <div className={Style.imageContent}></div>
      </div>
    </div>
  );
}

export default Welcoming;
