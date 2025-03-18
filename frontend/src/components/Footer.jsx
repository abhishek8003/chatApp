import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";

const Footer = () => {
  let navigate = useNavigate();

  return (
    <footer
      className="bg-dark text-white py-4 mt-4"
      style={{
        width: "100%",
      }}
    >
      <div className="container">
        <div className="row">
          {/* Contact Section */}
          <div className="col-md-4">
            <h5 className="fw-bold">Chat Application</h5>
            <h6 className="mt-3 fw-semibold">Contact</h6>
            <p className="mb-1">Abhishek Agarwal</p>
            <p className="mb-1">Jaipur, Rajasthan</p>
            <p className="mb-1">Pincode - 302012</p>
            <p className="text-info">agarwalabhishek908@gmail.com</p>
          </div>

          {/* Pages Section */}
          <div className="col-md-4">
            <h6 className="fw-bold">Pages</h6>
            <ul className="list-unstyled mt-3">
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                Chat App
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                SignIn
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                SignUp
              </li>
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                Home
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="col-md-4">
            <h6 className="fw-bold">Links</h6>
            <ul className="list-unstyled mt-3">
              <li>LinkedIn</li>
              <li>Github</li>
              <li>Instagram</li>
              <li>E-Mail</li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-4">
          <p className="mb-0">
            All rights reserved {new Date(Date.now()).getFullYear()} © ChatApp
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
