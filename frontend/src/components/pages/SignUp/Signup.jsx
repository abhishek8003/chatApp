import React, { useContext } from "react";
import MessageIcon from "@mui/icons-material/Message";
import { useForm } from "react-hook-form";
import LockIcon from "@mui/icons-material/Lock";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import { backendContext } from "../../../BackendProvider";

function Signup() {
  let backendUrl=useContext(backendContext)
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
    let formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);

    formData.append("password", data.password);
    if (data.profilePic) {
      formData.append("profilePic", data.profilePic[0]);
    }
    formData.append("profilePic", "");
    console.log(isSubmitting);
    try {
      let response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      let json = await response.json();
      console.log(json);
      if (response.status === 200) {
        console.log("setting state");

        toast.success("User registered success");
        dispatch(setSelectedUser(null));
        dispatch(setUser(json.user));
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

      
        <div
          className="row"
          style={{
            "min-height": "88vh",
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
            <Typography variant="h5">Create Account</Typography>
            <p>Get started with your free account</p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: "100%" }}
              encType="multipart/form-data"
            >
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
                <Button
                  className="mt-3"
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload profile image
                  <input
                    type="file"
                    {...register("profilePic")}
                    style={{ display: "none" }}
                  ></input>
                </Button>
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
                Already have an account?{" "}
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>
      
      <Footer></Footer>
    </>
  );
}

export default Signup;
