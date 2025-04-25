import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./Component/NavBar";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/Authentication/Signup";
import Login from "./Pages/Authentication/Login";
import Footer from "./Component/Footer";
import NotFound from "./Component/NotFound";
import CreateWorkspace from "./Component/ListingForm";
import ShowWorkspace from "./Pages/ShowWorkspace/ShowWorkspace";

const PageWrapper = ({ children }) => (
  <>
    <NavBar />
    {children}
    <Footer />
  </>
);

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/new",
    element: <CreateWorkspace />,
  },
  {
    path: "/workspace/:id",
    element: <ShowWorkspace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const authPath = ["/login", "/signup"];

const router = createBrowserRouter(
  routes.map(({ path, element }) => ({
    path,
    element: authPath.includes(path) ? (
      element
    ) : (
      <PageWrapper>{element}</PageWrapper>
    ),
  }))
);

export default function App() {
  return (
    <>
      <RouterProvider
        router={router}
        className="scroll-smooth"
      ></RouterProvider>
    </>
  );
}
