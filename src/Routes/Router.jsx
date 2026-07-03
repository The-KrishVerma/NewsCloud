import { createBrowserRouter } from "react-router-dom";
import HomeLayouts from "../Layouts/HomeLayouts";
import Home from "../Pages/Home";
import About from "../Pages/About";
import LinkSummarizer from "../Pages/LinkSummarizer";
import NewsFeed from "../Pages/NewsFeed";
import CategoryNews from "../Pages/CategoryNews";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AuthLayout from "../Layouts/AuthLayout";
import NewsDetails from "../Pages/NewsDetails";
import PrivateRoute from "../Firebase/Provider/PrivateRoute";
import Loading from "../Pages/Loading";
import CompareNews from "../Pages/CompareNews";
import NewsFinder from "../Pages/NewsFinder";
import Analytics from "../Pages/Analytics";
import Profile from "../Pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayouts,
    children: [
      {
        path: "",                 // root -> renders Home within HomeLayouts
        element: <Home></Home>,
      },
      {
        path: "newsfinder",
        element: <NewsFinder></NewsFinder>,
      },
      {
        path: "about",            // <-- changed from "/about" to "about"
        element: <About></About>,
      },
      {
        path: "link-summarizer",
        element: <LinkSummarizer></LinkSummarizer>,
      },
      {
        path: "compare",
        element: <CompareNews></CompareNews>,
      },
      {
        path: "analytics",
        element: <Analytics></Analytics>,
      },

      {
        path: "category/:id",     // <-- changed from "/category/:id" to "category/:id"
        element: <CategoryNews></CategoryNews>,
        loader: () => fetch("/news.json"),
        hydrateFallbackElement: <Loading></Loading>,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "login",            // <-- changed from "/auth/login" to "login"
        element: <Login></Login>,
      },
      {
        path: "register",         // <-- changed from "/auth/register" to "register"
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/news-details/:id",
    element: (
      <PrivateRoute>
        <NewsDetails></NewsDetails>
      </PrivateRoute>
    ),
    loader: () => fetch("/news.json"),
    hydrateFallbackElement: <Loading></Loading>,
  },
  {
    path: "/*",
    element: <h2>Error 404</h2>,
  },
]);

export default router;