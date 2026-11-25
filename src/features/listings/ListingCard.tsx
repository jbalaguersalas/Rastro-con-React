import { Link } from "react-router";
import { CATEGORY_LABELS, formatPrice } from "../../app/labels";
import type { ListingSummary } from "../../app/types";
import styles from "./ListingCard.module.css";
import { StatusBadge } from "./StatusBadge";

type ListingCardProps = {
  listing: ListingSummary;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link to={`/listings/${listing._id}`} className={styles.card}>
      <div className={`${styles.image} ${styles[listing.category]}`}>
        {CATEGORY_LABELS[listing.category]}
      </div>
      <div className={styles.body}>
        <span className={styles.price}>{formatPrice(listing.price)}</span>
        <span className={styles.title}>{listing.title}</span>
        <div className={styles.footer}>
          <span>{listing.city}</span>
          <StatusBadge status={listing.status} />
        </div>
      </div>
    </Link>
  );
}
