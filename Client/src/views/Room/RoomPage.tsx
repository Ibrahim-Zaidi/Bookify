import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import styles from "./RoomPage.module.css"; // Import the CSS module

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  category: string;
  imageUrl: string;
}

function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // {
  //   "id": 9,
  // "name": "Double Room with Balcony",
  // "description": "Two twin beds with a private balcony, perfect for a relaxing getaway.",
  // "price": 160,
  // "isAvailable": true,
  // "Category": "Double",
  // "imageUrl": null
  // }

  //   model Booking {
  //   id Int @id @default(autoincrement())
  //   userId Int
  //   roomId Int
  //   totalPrice Float
  //   startTime DateTime
  //   endTime DateTime
  //   user User @relation(fields : [userId] , references : [id])
  //   room Room @relation(fields : [roomId] , references : [id])
  // }

  useEffect(() => {
    const mockRoom = {
      id: Number(id),
      name: "Double Garden View",
      description:
        "Experience luxury and comfort in our spacious Double Garden View room. This elegantly appointed accommodation features a plush king-size bed, modern amenities, and stunning views of our landscaped gardens. Perfect for business travelers or couples seeking a peaceful retreat.",
      price: 229,
      isAvailable: true,
      category: "double",
      imageUrl:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
    };
    setRoom(mockRoom);
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days > 0) {
        setNumberOfDays(days);
        setTotalPrice(days * (room?.price || 0));
      } else {
        setNumberOfDays(0);
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, room]);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate || numberOfDays <= 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        roomId: room?.id,
        startTime: checkInDate,
        endTime: checkOutDate,
        totalPrice: totalPrice,
      };

      await api.post("/auth/addBooking", bookingData);
      alert("Booking successful!");
      navigate("/Home");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/addReview", {
        roomId: room?.id,
        rating: rating,
        description: reviewText,
      });
      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    console.log(today);
    return today.toISOString().split("T")[0];
  };

  if (!room) {
    return <div className={styles.loading}>Loading...</div>;
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
          <img src={room.imageUrl} alt={room.name} />
        </div>

        <div className={styles.roomInfo}>
          <div className={styles.roomHeader}>
            <h2 className={styles.roomName}>{room.name}</h2>
            <span className={styles.roomCategory}>{room.category}</span>
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
                onChange={(e) => {
                  setCheckInDate(e.target.value);
                  console.log(checkInDate);
                }}
                disabled={!room.isAvailable}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                min={checkInDate || getMinDate()}
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
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
            onClick={() => setShowReviewForm(!showReviewForm)}
            className={styles.reviewButton}
          >
            Write a Review
          </button>
          {showReviewForm && (
            <div className={styles.reviewForm}>
              <label>Rating</label>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
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
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
              />
              <button
                onClick={handleReviewSubmit}
                className={styles.submitReviewButton}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
