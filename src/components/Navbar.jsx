import { NavLink, useNavigate } from "react-router-dom";
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_type");
    localStorage.removeItem("is_profile_update");
    localStorage.removeItem("oAuth");
    navigate("/"); // Change the path to your login or home page
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("user_type");
    setUserType(storedUserType);
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
            // Handle success
            setData(res?.user);
            console.log('res?.user: ', res?.user);
            setProfileVerified(res?.user?.profile_verified);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error);
      dispatch(setLoader(false));
    }
  }, [dispatch]);

  const handleNavigation = (path) => {
    if (profileVerified === "0") {
      navigate("/viewprofile"); // Navigate to profile page if not verified
    } else {
      navigate(path); // Navigate to the intended path
    }
    setIsOpen(false); // Close the menu after navigation
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
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => handleNavigation("/donate")}
        >
          Donate
        </NavLink>
        <NavLink
          to="/request"
          className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => handleNavigation("/request")}
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
        {userType === "2" && (
          <NavLink
            to="/approvals"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            Approvals
          </NavLink>
        )}
      </div>
      <div className="profile-container gap-3" onClick={toggleProfileMenu}>
        <h5 style={{ margin: 0 }}>
          {data?.name == null ? "Guest" : data?.name}
        </h5>
        <img
          src={data?.profile_picture || profilePic}
          alt="Profile"
          className="profile-pic"
        />
        {showProfileMenu && (
          <div className="profile-menu">
            <p>{data?.name}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
