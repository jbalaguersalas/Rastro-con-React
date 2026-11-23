import { useSearchParams } from "react-router";
import { useGetListingsQuery } from "../../app/api";
import type { ListingFilters as Filters } from "../../app/types";
import { Loading } from "../../components/ui/Loading";
import { ListingCard } from "./ListingCard";
import { ListingFilters } from "./ListingFilters";

export function ListingsPage() {
  // Los filtros viven en la URL: /?category=Cars&maxPrice=5000
  const [searchParams, setSearchParams] = useSearchParams();

  // Convierte la URL en un objeto: { category: "Cars", maxPrice: "5000" }
  const filters: Filters = Object.fromEntries(searchParams);

  const { data: listings, isLoading, isError } = useGetListingsQuery(filters);

  function changeFilter(name: keyof Filters, value: string) {
    const next = new URLSearchParams(searchParams); // una copia: el estado no se cambia
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  }

  return (
    <>
      <h1>Anuncios</h1>
      <ListingFilters filters={filters} onChange={changeFilter} />
      {isLoading && <Loading />}
      {isError && (
        <p className="error" role="alert">
          No se han podido cargar los anuncios.
        </p>
      )}
      {listings?.length === 0 && <p className="loading">No hay anuncios con esos filtros.</p>}
      <div className="grid">
        {listings?.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
}
