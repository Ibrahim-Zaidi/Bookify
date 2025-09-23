// import { useState } from "react";
import { useEffect } from "react";
import styles from "./Reviews.module.css";
import api from "../../api/axios";

// Static reviews data

type reviewType = {
  userId?: number;
  username: string;
  roomId: number;
  rating: number;
  description: string;
};

const reviews: reviewType[] = [
  {
    userId: 1,
    username: "JohnDoe",
    roomId: 1,
    rating: 5,
    description: "Amazing room!",
  },
  {
    username: "JaneSmith",
    roomId: 1,
    rating: 4,
    description: "Very comfortable stay.",
  },
];

function Reviews({ roomId }) {
  console.log(roomId);
  // useEffect(() => {
  //   async function fetchRoomReviews() {
  //     try {
  //       const response = await api.get(`/api/getRoomReviews`, {
  //         roomId,
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.error("Failed to fetch room reviews:", error);
  //     }
  //   }

  //   fetchRoomReviews();
  // }, []);

  const renderStars = (rating: number) => {
    return (
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? styles.filledStar : styles.emptyStar}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Helper function to get initials from username
  const getInitials = (username: string) => {
    // Get first letter, or first two letters if name contains space
    if (username.includes(" ")) {
      const [first, last] = username.split(" ");
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
    return username.charAt(0).toUpperCase();
  };

  // If no reviews, show empty state
  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <p>No reviews yet. Be the first to review this room!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      {/* Review statistics */}
      <div className={styles.reviewStats}>
        <div className={styles.averageRating}>
          <span className={styles.ratingNumber}>
            {(
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)}
          </span>
          <span className={styles.outOf}>/5</span>
        </div>
        <div className={styles.totalReviews}>
          Based on {reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"}
        </div>
      </div>

      {/* Reviews list */}
      <div className={styles.reviewsList}>
        {reviews.map((review, index) => (
          <div
            key={review.userId || `review-${index}`}
            className={styles.reviewCard}
          >
            <div className={styles.reviewHeader}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {getInitials(review.username)}
                </div>
              </div>
              <div className={styles.reviewMeta}>
                <div className={styles.reviewerName}>{review.username}</div>
                {/* No date in static data */}
              </div>
              <div className={styles.reviewRating}>
                {renderStars(review.rating)}
              </div>
            </div>
            <div className={styles.reviewContent}>
              <p>{review.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
