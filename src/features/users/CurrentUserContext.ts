import { createContext, useContext } from "react";
import type { User } from "./users";

type CurrentUserValue = {
  user: User; // quién soy
  changeUser: (id: string) => void; // para cambiar de usuario
};

export const CurrentUserContext = createContext<CurrentUserValue | null>(null);

// Atajo para leer el contexto desde cualquier componente
export function useCurrentUser() {
  const value = useContext(CurrentUserContext);
  if (!value) throw new Error("useCurrentUser tiene que estar dentro de <CurrentUserProvider>");
  return value;
}
