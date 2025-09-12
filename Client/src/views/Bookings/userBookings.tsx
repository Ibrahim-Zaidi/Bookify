import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api/axios";
import styles from "./userBookings.module.css";
import logo from "../../assets/B.svg";
import BookingComponant from "./BookingComponant";

const fakeBookings = [
  {
    id: 1,
    userId: 101,
    roomId: 201,
    totalPrice: 780,
    startTime: "2024-09-15T14:00:00.000Z",
    endTime: "2024-09-18T11:00:00.000Z",
    room: {
      id: 201,
      name: "Deluxe Ocean View Suite",
      Category: "Luxury",
      imageUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: 260,
    },
  },
  {
    id: 2,
    userId: 101,
    roomId: 202,
    totalPrice: 450,
    startTime: "2024-10-20T15:00:00.000Z",
    endTime: "2024-10-23T10:00:00.000Z",
    room: {
      id: 202,
      name: "Mountain View Cabin",
      Category: "Standard",
      imageUrl:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: 150,
    },
  },
  {
    id: 3,
    userId: 101,
    roomId: 203,
    totalPrice: 1200,
    startTime: "2024-12-24T16:00:00.000Z",
    endTime: "2024-12-30T10:00:00.000Z",
    room: {
      id: 203,
      name: "Presidential Penthouse",
      Category: "Premium",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: 400,
    },
  },
  {
    id: 4,
    userId: 101,
    roomId: 204,
    totalPrice: 320,
    startTime: "2025-01-15T14:00:00.000Z",
    endTime: "2025-01-17T11:00:00.000Z",
    room: {
      id: 204,
      name: "Garden Villa",
      Category: "Deluxe",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      price: 160,
    },
  },
  {
    id: 5,
    userId: 101,
    roomId: 205,
    totalPrice: 180,
    startTime: "2025-02-10T15:00:00.000Z",
    endTime: "2025-02-11T10:00:00.000Z",
    room: {
      id: 205,
      name: "Cozy Studio",
      Category: "Budget",
      imageUrl: null, // Testing with a null image URL
      price: 90,
    },
  },
];

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

  // const handleDeleteClick = (id: number) => {
  //   setDeleteId(id);
  //   setShowConfirmation(true);
  // };

  // const confirmDelete = async () => {
  //   if (!deleteId) return;

  //   setIsDeleting(true);
  //   try {
  //     // This endpoint needs to be implemented on the server
  //     await api.delete(`/api/deleteBooking`, {
  //       data: { bookingId: deleteId },
  //     });

  //     setBookings(bookings.filter((booking) => booking.id !== deleteId));
  //     setShowConfirmation(false);
  //   } catch (err) {
  //     console.error("Failed to delete booking:", err);
  //     setError("Failed to delete booking. Please try again.");
  //   } finally {
  //     setIsDeleting(false);
  //     setDeleteId(null);
  //   }
  // };

  // const cancelDelete = () => {
  //   setShowConfirmation(false);
  //   setDeleteId(null);
  // };

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
