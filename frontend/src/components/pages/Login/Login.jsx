import React, { useContext, useEffect, useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import { useForm } from "react-hook-form";
import LockIcon from "@mui/icons-material/Lock";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Paper,
  Container,
  CircularProgress,
  Fade,
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

function Login() {
  const backendUrl = useContext(backendContext);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
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
      const json = await response.json();

      if (response.ok) {
        dispatch(setUser(json.user));
        dispatch(setSelectedUser(null));
        toast.success(`Welcome back, ${json.user.fullName}!`);
        navigate("/"); // Redirect to dashboard or desired page
      } else {
        toast.error(json.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "88vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, sm: 4 },
                width: "100%",
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <MessageIcon
                  sx={{ fontSize: "3.5rem", color: "primary.main", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "text.primary",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your account
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters",
                      },
                    })}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Must be at least 6 characters",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "action.active" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      position: "relative",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "white",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                        <span style={{ visibility: "hidden" }}>
                          Signing In...
                        </span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  >
                    Don’t have an account?{" "}
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/signup");
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "primary.main",
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          color: "primary.dark",
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Login;
