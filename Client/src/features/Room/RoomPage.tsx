import { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import styles from "./RoomPage.module.css";
import Spinner from "../../ui/spinner";

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  Category: string;
  imageUrl: string;
}

interface RoomPageState {
  checkInDate: string;
  checkOutDate: string;
  numberOfDays: number;
  totalPrice: number;
  isBooking: boolean;
  showReviewForm: boolean;
  rating: number;
  reviewText: string;
  error: string;
}

const initialState: RoomPageState = {
  checkInDate: "",
  checkOutDate: "",
  numberOfDays: 0,
  totalPrice: 0,
  isBooking: false,
  showReviewForm: false,
  rating: 5,
  reviewText: "",
  error: "",
};

type RoomPageAction =
  | { type: "SET_CHECK_IN_DATE"; payload: string }
  | { type: "SET_CHECK_OUT_DATE"; payload: string }
  | { type: "SET_NUMBER_OF_DAYS"; payload: number }
  | { type: "SET_TOTAL_PRICE"; payload: number }
  | { type: "SET_IS_BOOKING"; payload: boolean }
  | { type: "TOGGLE_REVIEW_FORM" }
  | { type: "SET_RATING"; payload: number }
  | { type: "SET_REVIEW_TEXT"; payload: string }
  | { type: "RESET_REVIEW_FORM" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CALCULATE_STAY"; payload: { days: number; price: number } };

function reducer(state: RoomPageState, action: RoomPageAction): RoomPageState {
  switch (action.type) {
    case "SET_CHECK_IN_DATE":
      return { ...state, checkInDate: action.payload };
    case "SET_CHECK_OUT_DATE":
      return { ...state, checkOutDate: action.payload };
    case "SET_NUMBER_OF_DAYS":
      return { ...state, numberOfDays: action.payload };
    case "SET_TOTAL_PRICE":
      return { ...state, totalPrice: action.payload };
    case "SET_IS_BOOKING":
      return { ...state, isBooking: action.payload };
    case "TOGGLE_REVIEW_FORM":
      return { ...state, showReviewForm: !state.showReviewForm };
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_REVIEW_TEXT":
      return { ...state, reviewText: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET_REVIEW_FORM":
      return {
        ...state,
        showReviewForm: false,
        rating: 5,
        reviewText: "",
      };
    case "CALCULATE_STAY":
      return {
        ...state,
        numberOfDays: action.payload.days,
        totalPrice: action.payload.days * action.payload.price,
      };
    default:
      return state;
  }
}

function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const [room, setRoom] = useState<Room | null>(location.state?.room || null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    checkInDate,
    checkOutDate,
    numberOfDays,
    totalPrice,
    isBooking,
    showReviewForm,
    rating,
    reviewText,
  } = state;

  useEffect(() => {
    if (checkInDate && checkOutDate && room) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      console.log(start, end);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days > 0) {
        dispatch({
          type: "CALCULATE_STAY",
          payload: { days, price: room.price },
        });
      } else {
        dispatch({ type: "CALCULATE_STAY", payload: { days: 0, price: 0 } });
      }
    }
  }, [checkInDate, checkOutDate, room]);

  async function handleBooking() {
    if (!isLoggedIn) {
      dispatch({
        type: "SET_ERROR",
        payload: "You must be logged in to book a room.",
      });
      alert(state.error);
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate || numberOfDays <= 0) {
      console.log("Invalid dates selected");
      return;
    }

    dispatch({ type: "SET_IS_BOOKING", payload: true });
    try {
      const bookingData = {
        roomId: room?.id,
        startTime: checkInDate,
        endTime: checkOutDate,
        totalPrice: totalPrice,
      };
      console.log("Booking data:", bookingData);

      const apiData = await api.post("/api/addBooking", bookingData);

      console.log("Booking successful:", apiData);
      navigate("/Bookings");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      dispatch({ type: "SET_IS_BOOKING", payload: false });
    }
  }

  async function handleReviewSubmit() {
    if (!isLoggedIn) {
      dispatch({
        type: "SET_ERROR",
        payload: "You must be logged in to leave a review.",
      });
      alert(state.error);
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/addReview", {
        roomId: room?.id,
        rating: rating,
        description: reviewText,
      });

      dispatch({ type: "RESET_REVIEW_FORM" });
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  }

  useEffect(() => {
    async function fetchRoomReviews() {
      try {
        const response = await api.get(`/api/getRoomReviews`, {
          data: { roomId: room?.id },
        });
        console.log("Room reviews:", response.data);
      } catch (error) {
        console.error("Failed to fetch room reviews:", error);
      }
    }

    fetchRoomReviews();
  }, [room?.id]);

  function getMinDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  if (!room) {
    return (
      <Spinner>
        <p>Loading room details...</p>
      </Spinner>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <nav className={styles.navbar}>
        <button onClick={() => navigate("/Home")} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.logo}>Bookify</h1>
      </nav>

      {/* Room Details */}
      <div className={styles.roomDetails}>
        <div className={styles.roomImage}>
          {room.imageUrl && <img src={room.imageUrl} alt={room.name} />}
        </div>

        <div className={styles.roomInfo}>
          <div className={styles.roomHeader}>
            <h2 className={styles.roomName}>{room.name}</h2>
            <span className={styles.roomCategory}>{room.Category}</span>
          </div>
          <div className={styles.roomPrice}>
            <span>Price per night: </span>
            <span>${room.price}</span>
          </div>
          <p className={styles.roomDescription}>{room.description}</p>
          <div className={styles.roomStatus}>
            <span>Status: </span>
            <span
              className={
                room.isAvailable ? styles.available : styles.unavailable
              }
            >
              {room.isAvailable ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className={styles.belowImage}>
        <div className={styles.bookingSection}>
          <h3>Book This Room</h3>
          <div className={styles.dateInputs}>
            <div>
              <label>Start Date</label>
              <input
                type="date"
                min={getMinDate()}
                value={checkInDate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CHECK_IN_DATE",
                    payload: e.target.value,
                  })
                }
                disabled={!room.isAvailable}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                min={checkInDate || getMinDate()}
                value={checkOutDate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CHECK_OUT_DATE",
                    payload: e.target.value,
                  })
                }
                disabled={!room.isAvailable || !checkInDate}
              />
            </div>
          </div>
          {numberOfDays > 0 && (
            <div className={styles.bookingSummary}>
              <p>Number of nights: {numberOfDays}</p>
              <p>Total Price: ${totalPrice}</p>
            </div>
          )}
          <button
            onClick={handleBooking}
            disabled={!room.isAvailable || isBooking || numberOfDays <= 0}
            className={styles.bookButton}
          >
            {isBooking ? "Processing..." : "Book Now"}
          </button>
        </div>

        {/* Reviews Section */}
        <div className={styles.reviewsSection}>
          <h3>Reviews</h3>
          <button
            onClick={() => dispatch({ type: "TOGGLE_REVIEW_FORM" })}
            className={styles.reviewButton}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
          {showReviewForm && (
            <div className={styles.reviewForm}>
              <label>Rating</label>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      dispatch({
                        type: "SET_RATING",
                        payload: star,
                      })
                    }
                    className={
                      star <= rating ? styles.activeStar : styles.inactiveStar
                    }
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) =>
                  dispatch({
                    type: "SET_REVIEW_TEXT",
                    payload: e.target.value,
                  })
                }
                placeholder="Write your review here..."
              />
              <button
                onClick={handleReviewSubmit}
                className={styles.submitReviewButton}
              >
                Submit Review
              </button>
            </div>
          )}
          <div className={styles.existingReviews}>
            <p>No reviews yet. Be the first to review this room!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
