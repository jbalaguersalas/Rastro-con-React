# Respuestas

## Pregunta 1

`searchParams` forma parte del estado de React Router. Si lo cambio con `searchParams.set(...)`, el objeto sigue siendo el mismo y React no ve ningún cambio: la URL no se actualiza y la página no se vuelve a pintar. Con `new URLSearchParams(searchParams)` creo un objeto nuevo, lo modifico y se lo paso a `setSearchParams`. React Router recibe un valor distinto, cambia la URL y vuelve a pintar la página con los filtros nuevos.
