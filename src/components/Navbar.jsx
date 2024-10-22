import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";
import { getProfile, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import profilePic from "../assets/prof_img.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [data, setData] = useState({});
  const [profileVerified, setProfileVerified] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const storedUserType = localStorage.getItem("user_type");
    const profileVerified = localStorage.getItem("is_profile_update");
    setUserType(storedUserType);
    setProfileVerified(profileVerified);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          if (res.errors) {
            toast.error(res.errors);
          } else {
            setData(res?.user);
            // setProfileVerified(res?.user?.profile_verified);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error);
      dispatch(setLoader(false));
    }
  }, [dispatch]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    if (profileVerified === null || profileVerified === "0") {
      toast.error("Please update your profile");
      navigate("/profile");
      return;
    } else {
      navigate(path);
    }
    setActiveLink(path); // Set active link
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_type");
    localStorage.removeItem("is_profile_update");
    localStorage.removeItem("oAuth");
    navigate("/login");
  };

  const handleMouseEnter = () => {
    setShowProfileMenu(true);
  };

  const handleMouseLeave = () => {
    setShowProfileMenu(false);
  };

  return (
    <nav className="navbar mb-3">
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
          className={activeLink === "/donate" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/donate");
          }}
        >
          Donate
        </NavLink>
        <NavLink
          to="/request"
          className={activeLink === "/request" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/request");
          }}
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
        {(userType === "1" || userType === "3") && (
          <NavLink
            to="/approvals"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            Approvals
          </NavLink>
        )}
      </div>
      <div
        className="profile-container gap-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h5 style={{ margin: 0 }}>
          {data?.first_name == null
            ? "Guest"
            : `${data?.first_name} ${data?.last_name}`}
        </h5>
        <img
          src={data?.profile_picture || profilePic}
          alt="Profile"
          className="profile-pic"
        />
        {showProfileMenu && (
          <div className="profile-menu">
            <p>
              {data?.name == null
                ? "Guest"
                : `${data?.first_name} ${data?.last_name}`}
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
