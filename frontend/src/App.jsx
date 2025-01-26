import "./App.css";
import Navbar from "./components/Navbar";
import Box from "@mui/material/Box";
import Login from "./components/pages/Login/Login";
import LinearProgress from "@mui/material/LinearProgress";
import Footer from "./components/Footer";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/features/userAuth";
import { setCheckingAuth } from "./redux/features/checkingAuth";
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/SignUp/Signup";
import Profile from "./components/pages/Profile/Profile";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { setSocket } from "./redux/features/socket";
function App() {
  let checkingAuth = useSelector((store) => {
    return store.checkingAuth;
  });
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  
 
  let [isLoadingCheckAuth, setLoadingCheckAuth] = useState(true);
  let dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      console.log("hello");
      if (checkingAuth) {
        try {
          let response = await fetch("http://localhost:5000/api/auth/check", {
            method: "GET",
            credentials: "include",
          });
          const json = await response.json();
          if (response.status === 200) {
            const user = json.user;
            console.log(user);
            toast.success(`Welcome ${user.fullName}`);
            // let socket=io("http://localhost:5000",{
            //   query:{
            //     user:json.user
            //   }
            // });
            // dispatch(setSocket(socket));
            dispatch(setCheckingAuth(false));
            dispatch(setUser(user));
          } else {
            console.log("its 401");
            toast.error(json.message);
          }
          setLoadingCheckAuth(false);
        } catch (error) {
          toast.error(error.message);
          setLoadingCheckAuth(false);
          console.log("Error:", error);
        }
      }
    };
    checkAuth();
  }, []);

  if (isLoadingCheckAuth) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="success" />
      </Box>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                userAuth ? <Home></Home> : <Navigate to="/signup"></Navigate>
              }
            ></Route>
            <Route
              path="/signup"
              element={
                userAuth ? <Navigate to="/"></Navigate> : <Signup></Signup>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                userAuth ? (
                  <Profile></Profile>
                ) : (
                  <Navigate to="/signup"></Navigate>
                )
              }
            ></Route>
            <Route
              path="/login"
              element={
                userAuth ? <Navigate to="/"></Navigate> : <Login></Login>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
export default App;
