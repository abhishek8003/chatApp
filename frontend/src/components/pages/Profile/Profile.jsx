import React, { useContext, useRef, useState } from "react";
import Navbar from "../../Navbar";
import EmailIcon from "@mui/icons-material/Email";
import Footer from "../../Footer";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { setUser } from "../../../redux/features/userAuth";
import toast from "react-hot-toast";
import { AccountCircle, ContactMail } from "@mui/icons-material";
import  { backendContext } from "../../../BackendProvider";

function Profile() {
  let backendUrl=useContext(backendContext)
  let userAuth = useSelector((store) => store.userAuth);
  let dispatch = useDispatch();
  let [uploadingImg, setUploadingImg] = useState(false);

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
        // console.log("Before dispatch:", userAuth);
        // console.log("Server user:",json.user);
        dispatch(setUser(json.user));
        // console.log("After dispatch:", userAuth);
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

  return (
    <>
      <Navbar />
      <div className="row flex-column justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div className="col-md-4 border mb-3 p-3" style={{ minHeight: "40vh" }}>
          <Typography variant="h5"  className="text-center fw-bolder">
            Profile
          </Typography>
          <Typography variant="body1" className="text-center">
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
              height={"140px"}
              width={"150px"}
              style={{ borderRadius: "50%" }}
            />
            {uploadingImg ? (
              <label
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "8px",
                  cursor: "pointer",
                  backgroundColor: "red",
                  color: "white",
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
                  backgroundColor: "green",
                  color: "white",
                  padding: "3px",
                  borderRadius: "50%",
                }}
              >
                <CameraAltIcon />
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
          <Typography className={"text-center text-muted fs-6"}>Click camera icon to update profile name</Typography>
          <label htmlFor="fullName" style={{ padding: "0px" }}>
                  Full Name <span className="text-muted fs-6"> (Cant be changed now)</span>
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
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
          <label htmlFor="email" style={{ padding: "0px" }}>
                  Email <span className="text-muted fs-6"> (Cant be changed now)</span>
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
                        <EmailIcon></EmailIcon>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
        </div>
        <div className="col-md-4 p-3 border" style={{ minHeight: "20vh" }}>
        <Typography variant="h5"  className="fw-bolder mb-3">
            Account Information
          </Typography>
         <div style={{display:"flex", justifyContent:"space-between"}}>
         <Typography variant="subtitle-1">
            Member Since
          </Typography>
          <Typography variant="subtitle-1">
          {new Date(userAuth.createdAt).toLocaleTimeString()}-{new Date(userAuth.createdAt).toLocaleDateString()}
          </Typography>
         </div>
         <hr></hr>
         <div style={{display:"flex", justifyContent:"space-between"}}>
         <Typography variant="subtitle-1">
            Last modified
          </Typography>
          <Typography variant="subtitle-1">
          {new Date(userAuth.updatedAt).toLocaleTimeString()}-{new Date(userAuth.updatedAt).toLocaleDateString()}
          </Typography>
         </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
