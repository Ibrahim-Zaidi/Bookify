import Style from "./Welcoming.module.css";
import logo from "../../Assets/B.svg";
import Room1 from "../../Assets/Room_welcome.jpg";
import Room2 from "../../Assets/Room2.jpg";

import { useNavigate } from "react-router";
import { useAuth } from "../../Contexts/AuthContext";
import Footer from "../Footer/Footer";

function Welcoming() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  return (
    <div className={Style.container}>
      <nav className={Style.navbar}>
        <div>
          <img src={logo} className={Style.logo} />
          <span className={Style.logoTitle}>ookify</span>
        </div>
        <div>
          {isLoggedIn ? (
            <h1>{user?.username}</h1>
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
            <span>Your best bet for quality bookings😉</span>
            <span className={Style.highlight}>
              Dive into our extensive collection ...
            </span>
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
      <Footer />
    </div>
  );
}

export default Welcoming;
