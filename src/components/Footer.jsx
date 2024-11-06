// import "./Footer.css";
// import logo from "../assets/logo.png";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     // Handle the subscription logic here
//   };

//   return (
//     <footer className="footer">
//       <div className="footer-section">
//         <img
//           src={logo}
//           alt="Logo"
//           className="footer-logo"
//           style={{ cursor: "pointer" }}
//           onClick={() => window.scrollTo(0, 0)}
//         />
//       </div>
//       <div className="footer-section">
//         <ul className="footer-links">
//           <li>
//             <Link to="/aboutus">About Us</Link>
//           </li>
//           <li>
//             <Link to="/privacypolicy">Privacy Policy</Link>
//           </li>
//           <li>
//             <Link to="/terms">Terms of Service</Link>
//           </li>
//           <li>
//             <Link to="/faqs">FAQs</Link>
//           </li>
//           <li>
//             <Link to="writetoUs"> Write to Us</Link>
//           </li>
//         </ul>
//       </div>
//       <div className="footer-section">
//         {/* <Link to="#" className="footer-contact">
//           Write to Us
//         </Link> */}
//         <form onSubmit={handleSubscribe} className="subscribe-form">
//           <div className="row">
//             <div className="col-lg-12 d-flex">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="subscribe-input"
//               />
//               <button type="submit" className="subscribe-button btn-sm">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import "./Footer.css";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="footer-container">
        <div className="footer-section text-start">
          <h3>Happydonors</h3>
          <p>Ashok Nagar</p>
          <p>Chennai, Tamil Nadu</p>
          <p>600083</p>
          <div className="footer-social">
            <a href="https://facebook.com">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://youtube.com">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://whatsapp.com">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
        <div className="footer-section text-start">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a
                href="/app.html"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about-us.html"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/app.html"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Services
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section text-start">
          <h3>Campaign</h3>
          <ul>
            <li>
              <Link to="/home">Blood Banks</Link>
            </li>
            <li>
              <Link to="/home">Organization</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section text-start">
          <h3>Contact us</h3>
          <div className="d-flex flex-column">
            <a
              href="tel:+919966745424"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              +91-9966745424
            </a>
            <a
              href="mailto:info@happydonors.ngo"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              info@happydonors.ngo
            </a>
          </div>
        </div>
      </div> */}
      <div className="footer-bottom">
        <p>Copyright 2024 - Happy Donors. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
