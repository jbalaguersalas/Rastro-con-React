import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateOfferMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { useCurrentUser } from "../users/CurrentUserContext";

type OfferFormProps = {
  listingId: string;
};

export function OfferForm({ listingId }: OfferFormProps) {
  const { user } = useCurrentUser(); // quién oferta: el del desplegable
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (Number(amount) <= 0) {
      setError("La oferta tiene que ser mayor que cero.");
      return;
    }
    setError(null);
    try {
      // La API pone el estado, la fecha y el nombre del comprador
      await createOffer({ listingId, buyerId: user.id, amount: Number(amount) }).unwrap();
      setAmount("");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hacer una oferta</h2>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="amount">Tu oferta (€)</label>
      <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Ofertar"}
      </button>
    </form>
  );
}
