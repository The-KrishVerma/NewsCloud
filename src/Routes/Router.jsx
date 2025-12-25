import { createBrowserRouter } from "react-router";
import HomeLayouts from "../Layouts/HomeLayouts";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Summarize from "../Pages/Summarize";
import NewsFeed from "../Pages/NewsFeed";
import CategoryNews from "../Pages/CategoryNews";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AuthLayout from "../Layouts/AuthLayout";
import NewsDetails from "../Pages/NewsDetails";
import PrivateRoute from "../Firebase/Provider/PrivateRoute";
import Loading from "../Pages/Loading";

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
        element: <NewsFeed showSummarizer={true}></NewsFeed>,
      },
      {
        path: "about",            // <-- changed from "/about" to "about"
        element: <About></About>,
      },
      {
        path: "summarize",
        element: <Summarize></Summarize>,
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