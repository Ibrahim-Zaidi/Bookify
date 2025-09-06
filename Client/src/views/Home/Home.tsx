import Style from "./Home.module.css";
import icon from "../../Assets/booking-reservation-icon.svg";
import { useAuth } from "../../Contexts/AuthContext";
import { useEffect, useState } from "react";

// import { useNavigate } from "react-router";

// import Room2 from "../../assets/room2.jpg";
import RoomCard from "../Room/RoomCard";
import api from "../../api/axios";

function Home() {
  const { isLoggedIn, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [rooms, setRooms] = useState([]);
  // const [showFilters, setShowFilters] = useState(true);
  // const [showBookings, setShowBookings] = useState(false);
  // const navigate = useNavigate();
  // const { username } = user;

  useEffect(function () {
    async function getRooms() {
      try {
        const data = await api.get("/getAllRooms");
        const { text, rooms: rooms_ } = data.data;
        console.log(text, " : ", rooms_);
        setRooms(rooms_);
        // console.log(rooms);
      } catch (err) {
        console.log(err);
      }
    }

    getRooms();
  }, []);

  return (
    <div className={Style.container}>
      <nav className={Style.header}>
        <h1 className={Style.logo}>Bookify</h1>
        <div className={Style.userActions}>
          {isLoggedIn ? (
            <>
              <img src={icon} alt="icon_booking" />
              <select className={Style.filterLogged}>
                <option value="profile" className={Style.welcomeBar}>
                  Weclome, ibrahim!
                </option>
                <option value="logout">Log Out</option>
              </select>
            </>
          ) : (
            <select className={Style.filterRegister}>
              <option value="Register">Register</option>
              <option value="Login">Login</option>
            </select>
          )}
        </div>
      </nav>

      {/* Search and Filter Section */}
      <section className={Style.searchSection}>
        <div className={Style.searchHeader}>
          <h2>Find Your Perfect Room</h2>
        </div>

        <div className={Style.searchBar}>
          <input
            type="text"
            placeholder="Search by room name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={Style.searchInput}
          />
          <button className={Style.filterToggle}>🔍 Filters</button>
        </div>

        <div className={Style.filtersContainer}>
          <div className={Style.filterGroup}>
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={Style.filterSelect}
            >
              <option value="all">All</option>
              <option value="deluxe">Deluxe</option>
              <option value="standard">Standard</option>
              <option value="double">Double</option>
            </select>
          </div>

          <div className={Style.filterGroup}>
            <label>Minimum Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className={Style.filterSelect}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>
      </section>

      {/* result section  */}

      <section className={Style.resultsSection}>
        <div className={Style.resultsHeader}>
          <h3>10 rooms available</h3>
        </div>
        <div className={Style.roomsGrid}>
          {rooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>
      </section>

      <footer> hi this is me</footer>
    </div>
  );
}

export default Home;
