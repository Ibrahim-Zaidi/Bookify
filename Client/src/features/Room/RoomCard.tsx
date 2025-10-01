import { useNavigate } from "react-router";
import Style from "./RoomCard.module.css";

type RoomCardProps = {
  id: number;
  name: string;
  imageUrl: string;
  Category: string;
  isAvailable: boolean;
  price: number;
  rating: number;
};

function RoomCard({ room }: { room: RoomCardProps }) {
  const { id, name, imageUrl, Category, isAvailable, rating, price } = room;
  const navigate = useNavigate();

  const handleNavigate = () => {
    //delivering the room data with the navigation state
    navigate(`/room/${id}`, { state: { room } });
  };

  const renderStars = (rating: number) => {
    const fullStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return fullStars + emptyStars;
  };

  return (
    <div className={Style.roomCard} onClick={handleNavigate}>
      <div className={Style.roomImage}>
        <img src={imageUrl} alt={name} />
        <div className={Style.imageOverlay}>
          <span className={Style.roomCategory}>{Category}</span>
          <span
            className={`${Style.availabilityBadge} ${
              isAvailable ? Style.available : Style.unavailable
            }`}
          >
            {isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      <div className={Style.roomInfo}>
        <div className={Style.roomHeader}>
          <h4 className={Style.roomName}>{name}</h4>
          <div className={Style.roomRating}>
            <span className={Style.stars}>{renderStars(rating)}</span>
            <span className={Style.ratingNumber}>
              {rating ? `(${rating}.0)` : "No Rating yet"}
            </span>
          </div>
        </div>

        <div className={Style.roomFooter}>
          <div className={Style.price}>
            <span className={Style.priceAmount}>${price}</span>
            <span className={Style.pricePeriod}>/night</span>
          </div>
          <button
            className={`${Style.bookBtn} ${!isAvailable ? Style.disabled : ""}`}
            disabled={!isAvailable}
          >
            {isAvailable ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
