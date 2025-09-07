import { useReducer, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router";
import RoomCard from "../Room/RoomCard";
import Style from "./Home.module.css";
import icon from "../../Assets/booking-reservation-icon.svg";

// Define the initial state for the reducer
const initialState = {
  selectedCategory: "all",
  selectedRating: "all",
  searchName: "",
  rooms: [],
  isLoading: false,
  error: null,
};

// Define the reducer function to handle state updates
function reducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_RATING":
      return { ...state, selectedRating: action.payload };
    case "SET_SEARCH_NAME":
      return { ...state, searchName: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Home() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getRooms() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const data = await api.get("/getAllRooms");
        const { rooms } = data.data;
        dispatch({ type: "SET_ROOMS", payload: rooms });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load rooms" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    getRooms();
  }, []);

  const handleCategoryChange = (e: any) => {
    dispatch({ type: "SET_CATEGORY", payload: e.target.value });
  };

  const handleRatingChange = (e: any) => {
    dispatch({ type: "SET_RATING", payload: e.target.value });
  };

  const handleSearchChange = (e: any) => {
    dispatch({ type: "SET_SEARCH_NAME", payload: e.target.value });
  };
  const filteredRooms = state.rooms.filter((room: any) => {
    const matchesCategory =
      state.selectedCategory === "all" ||
      room.Category.toLowerCase() === state.selectedCategory.toLowerCase();
    const matchesRating =
      state.selectedRating === "all" ||
      room.rating >= parseInt(state.selectedRating);

    return matchesCategory && matchesRating;
  });

  return (
    <div className={Style.container}>
      <nav className={Style.header}>
        <h1 className={Style.logo}>Bookify</h1>
        <div className={Style.userActions}>
          {isLoggedIn ? (
            <>
              <img
                src={icon}
                alt="icon_booking"
                onClick={() => navigate("/Bookings")}
              />
              <select className={Style.filterLogged}>
                <option value="profile" className={Style.welcomeBar}>
                  Hi, {user.username}!
                </option>
                <option value="logout">Log Out</option>
              </select>
            </>
          ) : (
            <select className={Style.filterRegister}>
              <option value="Register" onChange={() => navigate("/Register")}>
                Register
              </option>
              <option value="Login" onChange={() => navigate("/Login")}>
                Login
              </option>
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
            value={state.searchName}
            onChange={handleSearchChange}
            className={Style.searchInput}
          />
          <button className={Style.filterToggle}>🔍 Filters</button>
        </div>

        <div className={Style.filtersContainer}>
          <div className={Style.filterGroup}>
            <label>Category</label>
            <select
              value={state.selectedCategory}
              onChange={handleCategoryChange}
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
              value={state.selectedRating}
              onChange={handleRatingChange}
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
          <h3>{filteredRooms.length} rooms available</h3>
        </div>
        <div className={Style.roomsGrid}>
          {filteredRooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>
      </section>

      <footer>hi this is me</footer>
    </div>
  );
}

export default Home;
