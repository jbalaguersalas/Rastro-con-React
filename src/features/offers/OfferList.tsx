import { useGetOffersQuery } from "../../app/api";
import { formatPrice } from "../../app/labels";
import { StatusBadge } from "../listings/StatusBadge";
import styles from "./OfferList.module.css";

type OfferListProps = {
  listingId: string;
};

// Pide sus propias ofertas: la ficha solo le pasa el id
export function OfferList({ listingId }: OfferListProps) {
  const { data: offers = [] } = useGetOffersQuery(listingId);

  return (
    <div className={styles.box}>
      <h2>Ofertas ({offers.length})</h2>
      {offers.length === 0 && <p className="loading">Todavía no hay ofertas.</p>}
      {offers.map((offer) => (
        <div key={offer._id} className={styles.offer}>
          <span>{offer.buyer.name}</span>
          <strong>{formatPrice(offer.amount)}</strong>
          <StatusBadge status={offer.status} />
        </div>
      ))}
    </div>
  );
}
