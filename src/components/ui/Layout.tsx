import { Outlet } from "react-router";
import { Header } from "../layout/Header";

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
