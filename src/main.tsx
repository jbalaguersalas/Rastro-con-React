import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.tsx";
import { CurrentUserProvider } from "./features/users/CurrentUserProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </Provider>
  </StrictMode>,
);
