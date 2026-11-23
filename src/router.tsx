import { createBrowserRouter } from "react-router";
import { Layout } from "./components/ui/Layout";
import { NotFoundPage } from "./components/ui/NotFoundPage";
import { ListingsPage } from "./features/listings/ListingsPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <ListingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
