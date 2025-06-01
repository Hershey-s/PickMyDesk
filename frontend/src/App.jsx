import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./Component/NavBar";
import BackgroundWrapper from "./Component/BackgroundWrapper";
import Welcome from "./Pages/Welcome/Welcome";
import Home from "./Pages/Home/Home";
import UserDashboard from "./Pages/Dashboard/UserDashboard";
import Signup from "./Pages/Authentication/Signup";
import Login from "./Pages/Authentication/Login";
import UserLogin from "./Pages/Auth/UserLogin";
import AdminLogin from "./Pages/Auth/AdminLogin";
import UserSignup from "./Pages/Auth/UserSignup";
import AdminSignup from "./Pages/Auth/AdminSignup";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminWorkspaces from "./Pages/Admin/AdminWorkspaces";
import Footer from "./Component/Footer";
import NotFound from "./Component/NotFound";
import CreateWorkspace from "./Component/ListingForm";
import ShowWorkspace from "./Pages/ShowWorkspace/ShowWorkspace";
import WorkspaceBooking from "./Pages/WorkspaceBooking";
import UserBookings from "./Pages/Bookings/UserBookings";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import FAQ from "./Pages/FAQ/FAQ";
import Privacy from "./Pages/Privacy/Privacy";
import Terms from "./Pages/Terms/Terms";
import TestFeatures from "./Pages/TestFeatures/TestFeatures";
import Support from "./Pages/Support/Support";
import ReportIssue from "./Pages/ReportIssue/ReportIssue";
import Blog from "./Pages/Blog/Blog";
import WorkspaceGuide from "./Pages/WorkspaceGuide/WorkspaceGuide";
import CityGuides from "./Pages/CityGuides/CityGuides";
import RemoteWorkTips from "./Pages/RemoteWorkTips/RemoteWorkTips";
import TestBooking from "./Pages/TestBooking/TestBooking";
import TestBookingManagement from "./Pages/TestBookingManagement/TestBookingManagement";
import QuickBooking from "./Pages/QuickBooking/QuickBooking";
import ScrollToTop from "./Component/ScrollToTop";
import BackToTop from "./Component/BackToTop";
import AuthenticatedRoute from "./Component/AuthenticatedRoute";

const PageWrapper = ({ children, backgroundVariant = "default" }) => (
  <BackgroundWrapper variant={backgroundVariant}>
    <ScrollToTop />
    <NavBar />
    {children}
    <Footer />
    <BackToTop />
  </BackgroundWrapper>
);

const routes = [
  {
    path: "/",
    element: <AuthenticatedRoute />,
  },
  {
    path: "/workspaces",
    element: <UserDashboard />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
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
    path: "/book/:id",
    element: <WorkspaceBooking />,
  },
  {
    path: "/bookings",
    element: <UserBookings />,
  },
  // Legacy routes (redirect to new role-based routes)
  {
    path: "/login",
    element: <UserLogin />,
  },
  {
    path: "/signup",
    element: <UserSignup />,
  },
  // New role-based auth routes
  {
    path: "/user/login",
    element: <UserLogin />,
  },
  {
    path: "/user/signup",
    element: <UserSignup />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/signup",
    element: <AdminSignup />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/workspaces",
    element: <AdminWorkspaces />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/test-features",
    element: <TestFeatures />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/report-issue",
    element: <ReportIssue />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/workspace-guide",
    element: <WorkspaceGuide />,
  },
  {
    path: "/city-guides",
    element: <CityGuides />,
  },
  {
    path: "/remote-work-tips",
    element: <RemoteWorkTips />,
  },
  {
    path: "/test-booking",
    element: <TestBooking />,
  },
  {
    path: "/test-booking-management",
    element: <TestBookingManagement />,
  },
  {
    path: "/quick-booking",
    element: <QuickBooking />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const authPath = [
  "/login",
  "/signup",
  "/user/login",
  "/user/signup",
  "/admin/login",
  "/admin/signup",
];

const getBackgroundVariant = (path) => {
  if (authPath.includes(path)) return "auth";
  if (path.includes("/book/")) return "booking";
  if (path.includes("/workspace/")) return "workspace";
  return "default";
};

const isWelcomePage = (path) => {
  return path === "/" || path === "/welcome";
};

const router = createBrowserRouter(
  routes.map(({ path, element }) => ({
    path,
    element: authPath.includes(path) ? (
      <BackgroundWrapper variant="auth">{element}</BackgroundWrapper>
    ) : isWelcomePage(path) ? (
      element // Welcome page without navbar/footer wrapper
    ) : (
      <PageWrapper backgroundVariant={getBackgroundVariant(path)}>
        {element}
      </PageWrapper>
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
