import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";

const Footer = () => {
  let navigate = useNavigate();

  return (
    <footer
      className="py-4 mt-4"
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a", // "Kind of black" - very dark gray
        boxShadow: "0 -0.25rem 0.5rem rgba(0, 0, 0, 0.3)", // Darker shadow for depth
        borderTop: "1px solid #333", // Dark gray border to separate from content
      }}
    >
      <div className="container">
        <div className="row">
          {/* Contact Section */}
          <div className="col-md-4">
            <h5
              className="fw-bold"
              style={{
                color: "#e0e0e0", // Light gray for contrast on dark background
                fontSize: "1.25rem", // Small, bold header
                marginBottom: "1rem", // Tight spacing
              }}
            >
              Chat Application
            </h5>
            <h6
              className="fw-semibold"
              style={{
                color: "#b0b0b0", // Muted gray for secondary text
                fontSize: "0.875rem", // Small text
                marginBottom: "0.75rem", // Tight spacing
              }}
            >
              Contact
            </h6>
            <p
              className="mb-1"
              style={{
                color: "#e0e0e0", // Light gray for readability
                fontSize: "0.875rem", // Small text
              }}
            >
              Abhishek Agarwal
            </p>
            <p
              className="mb-1"
              style={{
                color: "#e0e0e0",
                fontSize: "0.875rem",
              }}
            >
              Jaipur, Rajasthan
            </p>
            <p
              className="mb-1"
              style={{
                color: "#e0e0e0",
                fontSize: "0.875rem",
              }}
            >
              Pincode - 302012
            </p>
            <p
              className="mb-0"
              style={{
                color: "#1976d2", // Blue to match Add New DM button/link color
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#42a5f5")} // Lighter blue on hover
              onMouseLeave={(e) => (e.target.style.color = "#1976d2")}
            >
              agarwalabhishek908@gmail.com
            </p>
          </div>

          {/* Pages Section */}
          <div className="col-md-4">
            <h6
              className="fw-bold"
              style={{
                color: "#e0e0e0", // Light gray
                fontSize: "0.875rem", // Small text
                marginBottom: "0.75rem", // Tight spacing
              }}
            >
              Pages
            </h6>
            <ul className="list-unstyled mt-3">
              <li
                style={{
                  color: "#b0b0b0", // Muted gray
                  fontSize: "0.875rem", // Small text
                  cursor: "pointer",
                  marginBottom: "0.5rem", // Tight spacing
                  transition: "color 0.3s ease",
                }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")} // Blue on hover
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                Chat App
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                SignIn
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onClick={() => navigate("/signup")}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                SignUp
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                Home
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="col-md-4">
            <h6
              className="fw-bold"
              style={{
                color: "#e0e0e0", // Light gray
                fontSize: "0.875rem", // Small text
                marginBottom: "0.75rem", // Tight spacing
              }}
            >
              Links
            </h6>
            <ul className="list-unstyled mt-3">
              <li
                style={{
                  color: "#b0b0b0", // Muted gray
                  fontSize: "0.875rem", // Small text
                  marginBottom: "0.5rem", // Tight spacing
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")} // Blue on hover
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                LinkedIn
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                Github
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                Instagram
              </li>
              <li
                style={{
                  color: "#b0b0b0",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
              >
                E-Mail
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div
          className="text-center mt-4"
          style={{
            borderTop: "1px solid #333", // Dark gray separator
            paddingTop: "1rem", // Tight spacing
          }}
        >
          <p
            className="mb-0"
            style={{
              color: "#b0b0b0", // Muted gray
              fontSize: "0.875rem", // Small text
            }}
          >
            All rights reserved {new Date(Date.now()).getFullYear()} © ChatApp
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;