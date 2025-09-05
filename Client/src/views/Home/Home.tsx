import Style from "./Home.module.css";
import icon from "../../Assets/booking-reservation-icon.svg";
import { useAuth } from "../../Contexts/AuthContext";
import { useState } from "react";
// import { useNavigate } from "react-router";

// import Room2 from "../../assets/room2.jpg";
import RoomCard from "../Room/RoomCard";

function Home() {
  const { isLoggedIn, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [searchName, setSearchName] = useState("");
  // const [rooms, setRooms] = useState([]);
  // const [showFilters, setShowFilters] = useState(true);
  // const [showBookings, setShowBookings] = useState(false);
  // const navigate = useNavigate();

  // const { username } = user;

  const rooms = [
    {
      id: 1,
      name: "Double Garden View",
      category: "standard",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    },
    {
      id: 2,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 3,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 4,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 5,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 5,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 7,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
    {
      id: 8,
      name: "Double Garden View",
      category: "double",
      description:
        "Comfortable room with a double bed and desk for business travelers.",
      price: 229,
      isAvailaible: true,
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    },
  ];

  return (
    <div className={Style.container}>
      <nav className={Style.header}>
        <h1 className={Style.logo}>Bookify</h1>
        <div className={Style.userActions}>
          {isLoggedIn ? (
            <>
              <img src={icon} alt="icon " />
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
          <button
            className={Style.filterToggle}
            // onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filters
          </button>
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
