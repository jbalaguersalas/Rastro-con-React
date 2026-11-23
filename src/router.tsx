import { createBrowserRouter } from "react-router";
import { Layout } from "./components/ui/Layout";
import { NotFoundPage } from "./components/ui/NotFoundPage";
import { ListingDetailPage } from "./features/listings/ListingDetailPage";
import { ListingsPage } from "./features/listings/ListingsPage";
import { NewListingPage } from "./features/listings/NewListingPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <ListingsPage /> },
      // listings/new antes que listings/:id: si no, "new" sería un id
      { path: "listings/new", element: <NewListingPage /> },
      { path: "listings/:id", element: <ListingDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
