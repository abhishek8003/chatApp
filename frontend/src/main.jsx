import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/pages/Home/Home.jsx";
import Profile from "./components/pages/Profile/Profile.jsx";
import Signup from "./components/pages/SignUp/Signup.jsx";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      { path: "/myProfile", element: <Profile></Profile> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
);
