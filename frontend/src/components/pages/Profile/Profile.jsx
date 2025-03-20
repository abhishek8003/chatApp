import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../Navbar";
import EmailIcon from "@mui/icons-material/Email";
import Footer from "../../Footer";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { setUser } from "../../../redux/features/userAuth";
import toast from "react-hot-toast";
import { AccountCircle, ContactMail } from "@mui/icons-material";
import { backendContext } from "../../../BackendProvider";
import { updateOneUser } from "../../../redux/features/users";
import { updateSelectedUser } from "../../../redux/features/selectedUser";
import { updateFriends } from "../../../redux/features/friends";

function Profile() {
  let backendUrl = useContext(backendContext);
  let userAuth = useSelector((store) => store.userAuth);
  let dispatch = useDispatch();
  let [uploadingImg, setUploadingImg] = useState(false);
  let selectedUser=useSelector((store)=>store.selectedUser)

  let handleimageUpload = async (event) => {
    if (!event.target.img1.files[0]) {
      toast.error("No file selected");
      return;
    }

    setUploadingImg(true);
    try {
      let formData = new FormData();
      formData.append("profilePic", event.target.img1.files[0]);

      let response = await fetch(`${backendUrl}/api/auth/update-profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      let json = await response.json();
      if (response.status === 200) {
        console.log("new updated user:", json.user);
        dispatch(updateOneUser(json.user));
        if (selectedUser?._id === json.user?._id) {
          dispatch(updateSelectedUserr(json.user));
        }
        dispatch(updateFriends(json.user));
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setUploadingImg(false);
    }
  };

  let myform = useRef();
  useEffect(() => {
    document.body.style.overflowX = "hidden"; // Disable scroll

    return () => {
      document.body.style.overflow = "auto"; // Re-enable scroll on unmount
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="row flex-column justify-content-center align-items-center"
        style={{
          minHeight: "90vh",
          backgroundColor: "#f5f5f5", // Light gray background for the page
        }}
      >
        {/* Profile Section */}
        <div
          className="col-md-4 mb-3 p-3"
          style={{
            minHeight: "40vh",
            backgroundColor: "#ffffff", // White background
            borderRadius: "0.5rem", // Subtle rounded corners
            boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)", // Light shadow
            border: "none",
          }}
        >
          <Typography
            variant="h5"
            className="text-center fw-bolder"
            sx={{
              color: "#333", // Dark gray for contrast
              fontSize: "1.25rem", // Small, bold header
              mb: "0.5rem", // Tight spacing
            }}
          >
            Profile
          </Typography>
          <Typography
            variant="body1"
            className="text-center"
            sx={{
              color: "#666", // Muted gray
              fontSize: "0.875rem", // Small text
              mb: "1rem", // Tight spacing
            }}
          >
            Your profile Information
          </Typography>

          <div
            style={{
              margin: "20px auto",
              width: "fit-content",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img
              src={userAuth.profilePic.cloud_url}
              height={"120px"} // Compact size
              width={"120px"}
              style={{ borderRadius: "50%", border: "2px solid #e0e0e0" }} // Light gray border
            />
            {uploadingImg ? (
              <label
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "8px",
                  cursor: "pointer",
                  backgroundColor: "#e63946", // Red to match modal's remove button
                  color: "#ffffff",
                  padding: "5px",
                  borderRadius: "50%",
                }}
              >
                <i className="fa-solid fa-spinner fa-spin fa-lg" style={{}}></i>
              </label>
            ) : (
              <label
                htmlFor="selectImg"
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "8px",
                  cursor: "pointer",
                  backgroundColor: "#2ecc71", // Green to indicate action
                  color: "#ffffff",
                  padding: "3px",
                  borderRadius: "50%",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#27ae60")
                } // Darker green on hover
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#2ecc71")
                }
              >
                <CameraAltIcon sx={{ fontSize: "1.25rem" }} />{" "}
                {/* Small icon */}
              </label>
            )}

            <form
              encType="multipart/form-data"
              style={{ display: "none" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleimageUpload(e);
              }}
              ref={myform}
            >
              <input
                type="file"
                name="img1"
                id="selectImg"
                onChange={() => {
                  myform.current.requestSubmit();
                }}
              />
            </form>
          </div>
          <Typography
            className={"text-center"}
            sx={{
              color: "#666", // Muted gray
              fontSize: "0.75rem", // Smaller text
              mb: "1rem", // Tight spacing
            }}
          >
            Click camera icon to update profile picture
          </Typography>

          <label
            htmlFor="fullName"
            style={{
              padding: "0px",
              color: "#333", // Dark gray
              fontSize: "0.875rem", // Small text
            }}
          >
            Full Name
          </label>
          <TextField
            id="fullName"
            placeholder="Enter your fullName"
            disabled={true}
            value={userAuth.fullName}
            variant="outlined"
            onMouseOver={() => {
              document.body.style.cursor = "crosshair";
            }}
            onMouseOut={() => {
              document.body.style.cursor = "default";
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#666" }} />{" "}
                  {/* Muted gray icon */}
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              mb: "1rem", // Tight spacing
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.25rem", // Subtle rounding
                backgroundColor: "#ffffff", // White background
                "& fieldset": { borderColor: "#e0e0e0" }, // Light gray border
                "&:hover fieldset": { borderColor: "#bdbdbd" }, // Darker gray on hover
                "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue on focus
                "&.Mui-disabled fieldset": { borderColor: "#e0e0e0" }, // Light gray when disabled
              },
              "& .MuiInputBase-input": {
                color: "#333", // Dark gray text
                fontSize: "0.875rem", // Small text
                padding: "0.5rem", // Compact padding
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#666", // Muted gray for disabled text
              },
            }}
          />

          <label
            htmlFor="email"
            style={{
              padding: "0px",
              color: "#333", // Dark gray
              fontSize: "0.875rem", // Small text
            }}
          >
            Email
          </label>
          <TextField
            id="email"
            placeholder="Enter your email"
            disabled={true}
            value={userAuth.email}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#666" }} /> {/* Muted gray icon */}
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              mb: "1rem", // Tight spacing
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.25rem", // Subtle rounding
                backgroundColor: "#ffffff", // White background
                "& fieldset": { borderColor: "#e0e0e0" }, // Light gray border
                "&:hover fieldset": { borderColor: "#bdbdbd" }, // Darker gray on hover
                "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue on focus
                "&.Mui-disabled fieldset": { borderColor: "#e0e0e0" }, // Light gray when disabled
              },
              "& .MuiInputBase-input": {
                color: "#333", // Dark gray text
                fontSize: "0.875rem", // Small text
                padding: "0.5rem", // Compact padding
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#666", // Muted gray for disabled text
              },
            }}
          />
        </div>

        {/* Account Information Section */}
        <div
          className="col-md-4 p-3"
          style={{
            minHeight: "20vh",
            backgroundColor: "#ffffff", // White background
            borderRadius: "0.5rem", // Subtle rounded corners
            boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)", // Light shadow
            border: "none",
          }}
        >
          <Typography
            variant="h5"
            className="fw-bolder mb-3"
            sx={{
              color: "#333", // Dark gray
              fontSize: "1.25rem", // Small, bold header
            }}
          >
            Account Information
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#666", // Muted gray
                fontSize: "0.875rem", // Small text
              }}
            >
              Member Since
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#333", // Dark gray
                fontSize: "0.875rem", // Small text
              }}
            >
              {new Date(userAuth.createdAt).toLocaleTimeString()} -{" "}
              {new Date(userAuth.createdAt).toLocaleDateString()}
            </Typography>
          </div>
          <hr style={{ borderColor: "#e0e0e0", margin: "0.75rem 0" }} />{" "}
          {/* Light gray separator */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#666", // Muted gray
                fontSize: "0.875rem", // Small text
              }}
            >
              Last Modified
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#333", // Dark gray
                fontSize: "0.875rem", // Small text
              }}
            >
              {new Date(userAuth.updatedAt).toLocaleTimeString()} -{" "}
              {new Date(userAuth.updatedAt).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
