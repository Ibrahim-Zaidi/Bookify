import Style from "./Welcoming.module.css";
import logo from "../../assets/B.svg";
import Room1 from "../../assets/Room_welcome.jpg";
import Room2 from "../../assets/Room2.jpg";

import { useNavigate } from "react-router";
import { useAuth } from "../../Contexts/AuthContext";

function Welcoming() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={Style.container}>
      <nav className={Style.navbar}>
        <div>
          <img src={logo} className={Style.logo} />
          <span className={Style.logoTitle}>ookify</span>
        </div>
        <div>
          {isLoggedIn ? (
            // <h1>{user.username}</h1>
            <h1>LOGGED IN! </h1>
          ) : (
            <>
              <button
                className={Style.loginBtn}
                onClick={() => navigate("/Login")}
              >
                Login
              </button>
              <button
                className={Style.registerBtn}
                onClick={() => navigate("/Register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
      <div className={Style.welcomingContent}>
        <div className={Style.textContent}>
          <h1 className={Style.title}>
            Welcome to <span>Bookify</span>
          </h1>
          <p>
            your best bet for quality bookings😉. Dive into our extensive
            collection
          </p>
          <button
            className={Style.exploreBtn}
            onClick={() => navigate("/Home")}
          >
            Explore Now
          </button>
        </div>
        <div className={Style.imageContent}>
          <img src={Room1} alt="Room_one" className={Style.img1} />
          <img src={Room2} alt="Room_two" className={Style.img2} />
        </div>
      </div>
      <footer className={Style.footer}>
        <p>© 2024 Bookify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Welcoming;
