import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";
import { getProfile, setLoader, ViewNotifications } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import profilePic from "../assets/prof_img.png";
import { IoMdNotificationsOutline } from "react-icons/io";
// import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import PropTypes from "prop-types";

function Navbar({ refreshNavbar }) {
  const [userType, setUserType] = useState(localStorage.getItem("user_type"));

  const [isOpen, setIsOpen] = useState(false);
  // const [userType, setUserType] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [data, setData] = useState({});
  const [count, setCount] = useState([]);
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
  }, [refreshNavbar]);

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

  useEffect(() => {
    dispatch(setLoader(true));
    dispatch(
      ViewNotifications((res) => {
        dispatch(setLoader(false));
        if (res.errors) {
          toast.error(res.errors);
        } else {
          setCount(res.pagination?.total);
        }
      })
    ).catch((error) => {
      toast.error(error.message || "Error fetching notifications");
      dispatch(setLoader(false));
    });
  }, [dispatch, refreshNavbar]);

  const handleNavigation = (path) => {
    console.log("path: ", path);
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
    navigate("/");
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
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/donate"
          className={activeLink === "/donate" ? "active" : "inactive"}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/donate");
          }}
          style={{
            display: userType == 4 || userType == 5 ? "none" : "block",
          }}
        >
          Donate
        </NavLink>
        <NavLink
          to={userType == 4 || userType == 5 ? "/camps/list" : ""}
          className={activeLink === "/camps/list" ? "active" : "inactive"}
          // onClick={(e) => {
          //   e.preventDefault();
          //   handleNavigation(
          //     userType == 4 || userType == 5 ? "/camps/list" : ""
          //   );
          // }}
          style={{ display: userType == 4 || userType == 5 ? "block" : "none" }}
        >
          {userType == 4 || userType == 5 ? "Camps" : ""}
        </NavLink>
        <NavLink
          to="/bloodrequest"
          className={activeLink === "/bloodrequest" ? "active" : "inactive"}
          // onClick={(e) => {
          //   e.preventDefault();
          //   handleNavigation(userType == 5 ? "/camps/list" : "/bloodrequest");
          // }}
        >
          Request
        </NavLink>
        <NavLink
          to="/viewprofile"
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          onClick={() => setIsOpen(false)}
        >
          Profile
        </NavLink>
        {(userType === "1" || userType === "3") && (
          <NavLink
            to="/approvals"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
            onClick={() => setIsOpen(false)}
          >
            Approvals
          </NavLink>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="notification-icon-wrapper">
          <IoMdNotificationsOutline
            style={{
              height: "25px",
              width: "25px",
              cursor: "pointer",
              color: "#fff",
            }}
            className="notify_bell"
            onClick={() => navigate("/notification")}
          />
          {<span className="notification-count">{count}</span>}
        </div>
        <div
          className="profile-container gap-3 d-flex align-items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h5 style={{ margin: 0, color: "#fff", fontSize: "1rem" }}>
            {data?.first_name == null
              ? "Guest"
              : ` ${data?.first_name} ${data?.last_name}`}
          </h5>
          <img
            src={data?.profile_picture || profilePic}
            alt="Profile"
            className="profile-pic"
          />
          {showProfileMenu && (
            <div className="profile-menu ">
              <p style={{ fontSize: "16px" }}>
                <FaRegUserCircle
                  style={{ height: "20px", width: "20px" }}
                  className="mx-2"
                />
                {data?.name == null
                  ? "Guest"
                  : `${data?.first_name} ${data?.last_name}`}
              </p>
              {/* <span className="border_bottom"></span>
              <div className="d-flex align-items-center gap-2">
                <AiOutlineLogout
                  style={{ height: "20px", width: "20px" }}
                  className="mt-3"
                /> */}
              <button onClick={handleLogout} style={{ background: "red" }}>
                Logout
              </button>
            </div>
            // </div>
          )}
        </div>
      </div>
    </nav>
  );
}
Navbar.propTypes = {
  refreshNavbar: PropTypes.bool.isRequired, // Specify that refreshNavbar is required and must be a boolean
};

export default Navbar;
