import { useReducer, useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router";
import RoomCard from "../Room/RoomCard";
import Style from "./Home.module.css";
import icon from "../../Assets/booking-reservation-icon.svg";
import Spinner from "../../ui/spinner";

type initialStateType = {
  selectedCategory: string;
  selectedRating: string;
  searchName: string;
  rooms: any[];
  error: string | null;
};

const initialState: initialStateType = {
  selectedCategory: "all",
  selectedRating: "all",
  searchName: "",
  rooms: [],
  error: null,
};

function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_RATING":
      return { ...state, selectedRating: action.payload };
    case "SET_SEARCH_NAME":
      return { ...state, searchName: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoggedIn, user, logout, setIsLoading, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  console.log(isLoggedIn);

  const username =
    user?.data?.username.split(" ")[0] || user?.username?.split(" ")[0];

  const { selectedCategory, selectedRating, rooms, searchName } = state;

  useEffect(() => {
    async function getRooms() {
      setIsLoading(true);
      try {
        const data = await api.get("/public/getAllRooms");
        const { rooms } = data.data;
        dispatch({ type: "SET_ROOMS", payload: rooms });
      } catch (err: any) {
        dispatch({ type: "SET_ERROR", payload: err.message });
      } finally {
        setIsLoading(false);
      }
    }
    getRooms();
  }, []);

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: "SET_CATEGORY", payload: e.target.value });
  }

  function handleRatingChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: "SET_RATING", payload: e.target.value });
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "SET_SEARCH_NAME", payload: e.target.value });
  }

  console.log(rooms);

  const filteredRooms = rooms?.filter((room: any) => {
    if (!room.isAvailable) return false;

    const matchesCategory =
      selectedCategory === "all" ||
      room.Category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesRating =
      selectedRating === "all" ||
      (room.rating && room.rating >= parseInt(selectedRating));
    const matchesSearch =
      searchName === "" ||
      room.name.toLowerCase().includes(searchName.toLowerCase());

    return matchesCategory && matchesRating && matchesSearch;
  });

  function handleLogOut() {
    try {
      logout();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Logout failed. try again" });
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={Style.container}>
      <nav className={Style.header}>
        <h1 className={Style.logo} onClick={() => navigate("/")}>
          Bookify
        </h1>
        <div className={Style.userActions}>
          {isLoggedIn ? (
            <>
              <img
                src={icon}
                alt="My Bookings"
                onClick={() => navigate("/Bookings")}
                className={Style.bookingsIcon}
                title="View My Bookings"
              />

              <div className={Style.userMenuContainer}>
                <button
                  className={Style.userMenuButton}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Hi, {username}!<span className={Style.dropdownArrow}>▼</span>
                </button>

                {isMenuOpen && (
                  <div className={Style.dropdownMenu}>
                    <button
                      onClick={() => {
                        handleLogOut();
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={Style.authButtons}>
              <button
                className={Style.loginButton}
                onClick={() => navigate("/Login")}
              >
                Login
              </button>
              <button
                className={Style.registerButton}
                onClick={() => navigate("/Register")}
              >
                Register
              </button>
            </div>
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
            onChange={handleSearchChange}
            className={Style.searchInput}
          />
          <button className={Style.filterToggle}>🔍 Filters</button>
        </div>

        <div className={Style.filtersContainer}>
          <div className={Style.filterGroup}>
            <label>Category</label>
            <select
              value={selectedCategory}
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
              value={selectedRating}
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
