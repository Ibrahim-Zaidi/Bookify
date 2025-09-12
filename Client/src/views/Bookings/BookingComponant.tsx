import styles from "./userBookings.module.css";

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
            // onClick={() => onHandleDeleteClick(booking.id)}
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
