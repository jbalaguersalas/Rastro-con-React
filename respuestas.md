# Respuestas

## Pregunta 1

`searchParams` forma parte del estado de React Router. Si lo cambio con `searchParams.set(...)`, el objeto sigue siendo el mismo y React no ve ningún cambio: la URL no se actualiza y la página no se vuelve a pintar. Con `new URLSearchParams(searchParams)` creo un objeto nuevo, lo modifico y se lo paso a `setSearchParams`. React Router recibe un valor distinto, cambia la URL y vuelve a pintar la página con los filtros nuevos.

## Pregunta 2

Por las etiquetas de RTK Query. `getOffers` dice que sus datos son `"Offer"` (`providesTags`), y `createOffer` declara que, cuando termina, `"Offer"` está desactualizado (`invalidatesTags`). Al crear la oferta, RTK Query busca las consultas activas con esa etiqueta y repite `GET /offers?listingId=...`. `OfferList` está suscrito a esa consulta, recibe la lista nueva y se vuelve a pintar. Los dos componentes no se hablan entre sí: comparten la caché del store.

## Pregunta 3

Al cambiar de Luis Martín a Ana García, el panel "Tu anuncio" desaparece y en su lugar sale el formulario "Hacer una oferta". Al volver a Luis, vuelve el panel.

La ficha se entera porque llama a `useCurrentUser()`, que lee el contexto. Cuando cambio el desplegable, `changeUser` cambia el estado del `CurrentUserProvider`, el Provider pasa un `value` nuevo y React vuelve a pintar todos los componentes que leen ese contexto, la ficha entre ellos. Con el usuario nuevo, `isSeller` da otro resultado.

En la pestaña Red no aparece ninguna petición nueva a `/listings/listing-1`: el id del anuncio no ha cambiado, así que `useGetListingQuery` sigue con los datos que ya tiene en la caché de RTK Query. Lo único que cambia es quién lo mira.

## Pregunta 4

Antes de algunas peticiones, el navegador manda una pregunta previa (`OPTIONS`, el *preflight*) y solo sigue si la API le contesta que sí.

- **GET y POST** son métodos "simples": el navegador no pregunta por ellos. **PATCH y DELETE** no lo son: el navegador pregunta y mira si están en `Access-Control-Allow-Methods`. Sin `PATCH`, fallaría **cambiar el precio** (`PATCH /listings/:id`). Sin `DELETE`, fallaría **borrar el anuncio** (`DELETE /listings/:id`).
- **Content-Type**: RTK Query manda los body con `Content-Type: application/json`, y ese valor no es de los "simples" (solo lo son `text/plain`, `multipart/form-data` y `application/x-www-form-urlencoded`). El navegador pregunta si se permite esa cabecera. Sin `Content-Type` en `Access-Control-Allow-Headers`, fallarían todas las peticiones con body: **ofertar** (`POST /offers`), **publicar** (`POST /listings`) y también **cambiar el precio** (`PATCH`). Los GET y el DELETE no llevan body y seguirían funcionando.

## Pregunta 5

Al entrar la primera vez, `useGetListingQuery(id)` hace `GET /listings/:id` y la API suma una visita. RTK Query guarda la respuesta en la caché del store.

Al volver al listado y entrar otra vez, RTK Query ya tiene ese anuncio en la caché (guarda los datos sin usar 60 segundos, `keepUnusedDataFor`). Usa lo que tiene y **no hace la petición**: la API no se entera y las visitas no suben. En la pestaña Red no aparece ningún `GET /listings/:id` nuevo.

Al recargar, el navegador borra todo el JavaScript de la página, y con él el store de Redux y su caché. La página empieza de cero, RTK Query no tiene nada guardado, hace el `GET` y la API suma otra visita.

(Si se espera más de 60 segundos fuera de la ficha, la caché se borra y al volver sí suben. También suben al cambiar el precio: `updatePrice` invalida la etiqueta `"Listing"` y la ficha se vuelve a pedir.)

## Diario de errores (Parte 6)

| # | Prueba | Qué salía (Red / consola) | Causa | Arreglo |
|---|--------|---------------------------|-------|---------|
| 1 | Abrir `/` | Error en rojo. En la consola: `blocked by CORS policy` | La API no mandaba la cabecera `Access-Control-Allow-Origin`: el navegador no deja leer la respuesta de otro origen (5173 → 3000) | Middleware de CORS en `api-rastro` (PR de `feature/deploy-render`) y reiniciar la API |
| 2 | Pulsar un anuncio | "Ese anuncio no existe." En Red, `GET /listings/undefined` con 400. En la consola, el aviso de que cada hijo de una lista necesita una `key` | MongoDB llama al id `_id`, no `id`. `listing.id` era `undefined` | En `types.ts`, `id` → `_id` en `ListingSummary` y `Offer`. TypeScript marcó todos los sitios: `ListingCard`, `ListingsPage`, `ListingDetailPage`, `SellerPanel` y `OfferList` |
| 3 | Móviles hasta 200 € | Salía también el iPhone (380 €) | La web mandaba `price:lte=200` (el filtro de json-server) y la API lo ignora: espera `maxPrice` | En `getListings`, `params: { category, city, maxPrice }`. Quito también `_sort`: la API ya ordena por fecha |
| 4 | Ficha del Seat | "Ofertas (0)". En Red, 404: `No existe la ruta GET /api/offers?listingId=...` | La API no tiene `GET /offers`. Las ofertas de un anuncio están en `GET /listings/:id/offers` | `getOffers` pide `/listings/${listingId}/offers`. En `Offer`, `listingId` → `listing: { id, title, price }`, que es lo que guarda la API |
| 5 | Ofertar | `Datos no válidos` (400): `buyerId` llegaba vacío | La web mandaba la oferta entera como a json-server (`buyer`, `status`, `createdAt`). La API solo espera `{ listingId, buyerId, amount }` y pone ella el estado, la fecha y el nombre | `NewOffer = { listingId, buyerId, amount }` y `createOffer({ listingId, buyerId: user.id, amount })` |
| 6 | Publicar | `sellerId no tiene un formato válido` (400) | Igual: la API espera `sellerId`, no `seller`. Además devuelve `_id`, así que al navegar iba a `/listings/undefined` | `NewListing` con `sellerId` y sin `status`, `views` ni `publishedAt`. Navegar a `/listings/${created._id}` |
| 7 | Entrar varias veces en un anuncio | Las visitas suben | No es un error: la API suma una visita en cada `GET /listings/:id` (ver pregunta 5) | Nada |
