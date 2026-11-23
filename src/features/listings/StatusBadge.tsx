import { STATUS_LABELS } from "../../app/labels";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  status: string; // AVAILABLE, RESERVED, SOLD... (también los de las ofertas)
};

export function StatusBadge({ status }: StatusBadgeProps) {
  // styles[status]: la clase se llama igual que el estado
  return <span className={`${styles.badge} ${styles[status]}`}>{STATUS_LABELS[status]}</span>;
}
