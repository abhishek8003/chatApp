import React from "react";
import MessageIcon from "@mui/icons-material/Message";
import { useForm } from "react-hook-form";
import LockIcon from "@mui/icons-material/Lock";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { setUser } from "../../../redux/features/userAuth";
import { useDispatch } from "react-redux";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import { setSelectedUser } from "../../../redux/features/selectedUser";

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  let dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  let navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    console.log(isSubmitting);
    try {
      let response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });
      let json = await response.json();
      console.log(json);
      if (response.status === 200) {
        console.log("setting state");
        dispatch(setUser(json.user));
        dispatch(setSelectedUser(null));
        toast.success(`Welcome back, ${json.user.fullName}`);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    console.log(isSubmitting);
  };

  return (
    <>
      <Navbar></Navbar>

      <div>
        <div
          className="row"
          style={{
            "min-height": "100vh",
            alignItems: "center",
            "@media (max-width:600px)": {
              alignItems: "start",
            },
            justifyContent: "center",
          }}
        >
          <div
            className="col-md-4 "
            style={{
              height: "70%",
              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              padding: "2.25rem",
            }}
          >
            <MessageIcon sx={{ fontSize: "3rem" }} />
            <Typography variant="h5">Welcome back</Typography>
            <p>Sign in to your Account</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <div className="row mb-3">
                <label htmlFor="fullName" style={{ padding: "0px" }}>
                  Full Name
                </label>
                <TextField
                  id="fullName"
                  placeholder="Enter your fullName"
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: "Full name cant be empty",
                    },
                    minLength: {
                      value: 3,
                      message: "Full name cant be less than 3 characters",
                    },
                  })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                {errors.fullName && errors.fullName.message ? (
                  <p style={{ color: "red" }}>{errors.fullName.message}</p>
                ) : null}
              </div>
              <div className="row mb-3">
                <label htmlFor="email" style={{ padding: "0px" }}>
                  Email
                </label>
                <TextField
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: { value: true, message: "email cant be empty" },
                    minLength: {
                      value: 3,
                      message: "email cant be less than 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+/,
                      message: "email must include @",
                    },
                  })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon></EmailIcon>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                {errors.email && errors.email.message ? (
                  <p style={{ color: "red" }}>{errors.email.message}</p>
                ) : null}
              </div>
              <div className="row mb-3">
                <label htmlFor="password" style={{ padding: "0px" }}>
                  Password
                </label>

                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password can't be empty",
                    },
                    minLength: {
                      value: 6,
                      message: "Password can't be less than 6 characters",
                    },
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon></LockIcon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                {errors.password && errors.password.message ? (
                  <p style={{ color: "red" }}>{errors.password.message}</p>
                ) : null}
              </div>
              <div className="row mb-3">
                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth={true}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting" : "submit"}
                </Button>
              </div>
              <div className="mt-3">
                Dont have a account?
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Login;
