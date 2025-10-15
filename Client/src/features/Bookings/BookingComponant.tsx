import styles from "./userBookings.module.css";
import { formatDate, calculateNights } from "../../utils/helpers";
import api from "../../api/axios";

interface BookingProps {
  booking: {
    id: number;
    userId: number;
    roomId: number;
    totalPrice: number;
    startTime: string;
    endTime: string;
    room: {
      id: number;
      name: string;
      Category: string;
      imageUrl: string | null;
      price: number;
    };
  };
}

function BookingComponant({ booking }: BookingProps) {
  async function deleteBooking() {
    try {
      const deletedRes = await api.delete(`/api/deleteBooking/${booking.id}`);
      console.log(deletedRes);

      if (deletedRes) {
        window.location.reload();
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <div key={booking.id} className={styles.bookingCard}>
      <div className={styles.bookingImageContainer}>
        <img
          src={
            booking.room.imageUrl ||
            "https://placehold.co/600x400?text=Room+Image"
          }
          alt={booking.room.name}
          className={styles.bookingImage}
        />
        <div className={styles.categoryBadge}>{booking.room.Category}</div>
      </div>

      <div className={styles.bookingDetails}>
        <h2 className={styles.roomName}>{booking.room.name}</h2>

        <div className={styles.bookingDates}>
          <div className={styles.dateRange}>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>Check-in</span>
              <span className={styles.dateValue}>
                {formatDate(booking.startTime)}
              </span>
            </div>
            <div className={styles.dateDivider}>→</div>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>Check-out</span>
              <span className={styles.dateValue}>
                {formatDate(booking.endTime)}
              </span>
            </div>
          </div>
          <div className={styles.stayDuration}>
            {calculateNights(booking.startTime, booking.endTime)} nights
          </div>
        </div>

        <div className={styles.bookingFooter}>
          <div className={styles.priceInfo}>
            <span className={styles.priceLabel}>Total Price</span>
            <span className={styles.priceAmount}>${booking.totalPrice}</span>
          </div>

          <button
            onClick={() => deleteBooking()}
            className={styles.cancelButton}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingComponant;
