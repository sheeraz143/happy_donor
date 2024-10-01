import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar mb-3">
      {/* Single button for both hamburger and close icon */}
      <button className="hamburger" onClick={toggleMenu}>
        {isOpen ? "×" : "☰"}
      </button>
      <div className={`menu ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/donate"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsOpen(false)}
        >
          Donate
        </NavLink>
        <NavLink
          to="/request"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsOpen(false)}
        >
          Request
        </NavLink>
        <NavLink
          to="/viewprofile"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsOpen(false)}
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
