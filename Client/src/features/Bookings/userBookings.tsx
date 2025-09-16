import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import styles from "./userBookings.module.css";
import logo from "../../assets/B.svg";
import BookingComponant from "./BookingComponant";

interface Booking {
  id: number;
  userId: number;
  roomId: number;
  totalPrice: number;
  startTime: string;
  endTime: string;
  room: {
    id: number;
    name: string;
    imageUrl: string;
    Category: string;
    price: number;
  };
}

function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get("/api/getBookings");
        setBookings(response.data.Bookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            onClick={() => navigate("/Home")}
            className={styles.backButton}
          >
            ← Back
          </button>
        </div>
        <div className={styles.navCenter}>
          <img src={logo} className={styles.logo} alt="Bookify logo" />
          <span className={styles.logoTitle}>ookify</span>
        </div>
        <div className={styles.navRight}>
          {user && <span className={styles.username}>{user.username}</span>}
        </div>
      </nav>

      {/* Page Content */}
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>My Bookings</h1>
          <p className={styles.subTitle}>
            Manage your upcoming and past room reservations
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={fetchBookings} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && bookings.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🏠</div>
            <h2>No bookings yet</h2>
            <p>
              You haven't booked any rooms yet. Start exploring our available
              rooms.
            </p>
            <button
              onClick={() => navigate("/Home")}
              className={styles.exploreButton}
            >
              Explore Rooms
            </button>
          </div>
        )}

        {!error && (
          <div className={styles.bookingsList}>
            {bookings.map((booking) => (
              <BookingComponant
                key={booking.id}
                booking={booking}
                // onHandleDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cancel Booking</h3>
            <p>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>

            <div className={styles.modalButtons}>
              <button
                onClick={cancelDelete}
                className={styles.cancelModalButton}
                disabled={isDeleting}
              >
                Keep Booking
              </button>
              <button
                onClick={confirmDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? "Cancelling..." : "Yes, Cancel It"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Bookify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserBookings;
