import "./Footer.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle the subscription logic here
    console.log("Subscribed with:", email);
  };

  return (
    <footer className="footer">
      <div className="footer-section">
        <img
          src={logo}
          alt="Logo"
          className="footer-logo"
          style={{ cursor: "pointer" }}
          onClick={() => window.scrollTo(0, 0)}
        />
      </div>
      <div className="footer-section">
        <ul className="footer-links">
          <li>
            <Link to="/aboutus">About Us</Link>
          </li>
          <li>
            <Link to="/privacypolicy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms">Terms of Service</Link>
          </li>
          <li>
            <Link to="/faqs">FAQs</Link>
          </li>
          <li>
            <Link to="writetoUs"> Write to Us</Link>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        {/* <Link to="#" className="footer-contact">
          Write to Us
        </Link> */}
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <div className="row">
            <div className="col-lg-12 d-flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="subscribe-input"
              />
              <button type="submit" className="subscribe-button btn-sm">
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
