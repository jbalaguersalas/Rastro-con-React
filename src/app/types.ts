// Cómo llegan los datos de la API de Express (MongoDB)

export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// Lo que usa el listado (GET /listings)
export type ListingSummary = {
  _id: string; // en MongoDB el id se llama _id
  title: string;
  price: number;
  category: string;
  city: string;
  status: ListingStatus;
};

// La ficha completa (GET /listings/:id): lo de arriba y más
export type Listing = ListingSummary & {
  description: string;
  publishedAt: string;
  views: number;
  seller: { id: string; name: string };
  attributes: Record<string, string | number>;
};

// Lo que espera POST /listings. El estado, la fecha, las visitas
// y el nombre del vendedor los pone la API
export type NewListing = {
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  sellerId: string;
  attributes: Record<string, string | number>;
};

export type Offer = {
  _id: string;
  listing: { id: string; title: string; price: number };
  amount: number;
  status: OfferStatus;
  createdAt: string;
  buyer: { id: string; name: string };
};

// Lo que espera POST /offers. El estado, la fecha y el nombre del comprador los pone la API
export type NewOffer = {
  listingId: string;
  buyerId: string;
  amount: number;
};

// Los filtros del listado. Todos opcionales
export type ListingFilters = {
  category?: string;
  city?: string;
  maxPrice?: string;
};
