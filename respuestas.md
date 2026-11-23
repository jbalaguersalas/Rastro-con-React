# Respuestas

## Pregunta 1

`searchParams` forma parte del estado de React Router. Si lo cambio con `searchParams.set(...)`, el objeto sigue siendo el mismo y React no ve ningún cambio: la URL no se actualiza y la página no se vuelve a pintar. Con `new URLSearchParams(searchParams)` creo un objeto nuevo, lo modifico y se lo paso a `setSearchParams`. React Router recibe un valor distinto, cambia la URL y vuelve a pintar la página con los filtros nuevos.

## Pregunta 2

Por las etiquetas de RTK Query. `getOffers` dice que sus datos son `"Offer"` (`providesTags`), y `createOffer` declara que, cuando termina, `"Offer"` está desactualizado (`invalidatesTags`). Al crear la oferta, RTK Query busca las consultas activas con esa etiqueta y repite `GET /offers?listingId=...`. `OfferList` está suscrito a esa consulta, recibe la lista nueva y se vuelve a pintar. Los dos componentes no se hablan entre sí: comparten la caché del store.
