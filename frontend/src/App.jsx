import "./App.css";
import Navbar from "./components/Navbar";
import Box from "@mui/material/Box";
import Login from "./components/pages/Login/Login";
import LinearProgress from "@mui/material/LinearProgress";
import Footer from "./components/Footer";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/features/userAuth";
import { setCheckingAuth } from "./redux/features/checkingAuth";
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/SignUp/Signup";
import Profile from "./components/pages/Profile/Profile";
import toast, { Toaster } from "react-hot-toast";
import { socketContext } from "./SocketProvider";
import BackendProvider, { backendContext } from "./BackendProvider";

function App() {
  let backendUrl=useContext(backendContext);
  console.log(backendUrl);
  
  let checkingAuth = useSelector((store) => {
    return store.checkingAuth;
  });
  let userAuth = useSelector((store) => {
    return store.userAuth;
  });
  // let clientSocket=useContext(socketContext);
  let [isLoadingCheckAuth, setLoadingCheckAuth] = useState(true);
  // console.log(clientSocket);
  let dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      console.log("hello");
      if (checkingAuth) {
        try {
          let response = await fetch(`${backendUrl}/api/auth/check`, {
            method: "GET",
            credentials: "include",
          });
          const json = await response.json();
          if (response.status === 200) {
            const user = json.user;
            console.log(user);
            toast.success(`Welcome ${user.fullName}`);
            dispatch(setCheckingAuth(false));
            dispatch(setUser(user));
          } else if(response.status==401) {
            console.log("its 401");
            console.log(json.message);
          }
          else if(response.status==404){
            console.log("its 404");
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
