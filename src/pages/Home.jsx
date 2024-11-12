import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Home.css";
// import bannerImg from "../assets/banner.png";
import requestblood from "../assets/requestblood.png";
import donateblood from "../assets/donateblood.png";
import medicalcamps from "../assets/medicalcamps.png";
import funddonation from "../assets/funddonation.png";
import sos from "../assets/sos.png";
// import bloodGroupImg from "../assets/bloodimage.png";
import profPicImg from "../assets/prof_img.png";
import shareIcon from "../assets/Share.png";
import locationIcon from "../assets/Mappoint.png";
import { Link, useNavigate } from "react-router-dom";
import {
  dashboardData,
  DonateAccept,
  sendSOS,
  setLoader,
} from "../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatDate } from "../utils/dateUtils";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getData, setData] = useState({});
  const [banners, setBanners] = useState([]);
  const [recentBloodRequest, setRecentBloodRequest] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [refresh, setRefresh] = useState(false);

  const isProfileUpdate = localStorage.getItem("is_profile_update");

  const storedUserType = localStorage.getItem("user_type");

  useEffect(() => {
    dispatch(setLoader(true)); // Start loading
    window.scrollTo(0, 0);

    try {
      dispatch(
        dashboardData((res) => {
          setData(res);
          // console.log("res: ", res.user_profile.usertype);
          localStorage.setItem("user_type", res.user_profile.usertype);

          setBanners(res.banners);
          setRecentBloodRequest(res?.recent_blood_requests);
          if (res.errors) {
            toast.error(res.errors);
          } else {
            // Handle success
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error);
      dispatch(setLoader(false));
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    // Function to get the user's current position
    const getCurrentPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            toast.error("Unable to retrieve your location.");
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    getCurrentPosition();
  }, []);

  const handleSubmit = () => {
    const data = {
      lat: String(coordinates.lat),
      lon: String(coordinates.lon),
    };
    dispatch(setLoader(true));
    try {
      dispatch(
        sendSOS(data, (res) => {
          dispatch(setLoader(false));

          // Check for response status
          if (res.code === 200) {
            toast.success(res.message);
            // navigate("#");
          } else {
            const errorMessages = res.message || "An error occurred.";
            toast.error(errorMessages);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false)); // Stop loading
    }
  };

  const handleCardClick = (request) => {
    console.log("request: ", request);
    // navigate(`/request/${request?.request_id}`, { state: { request } });

    dispatch(setLoader(true));

    try {
      dispatch(
        DonateAccept(request?.id, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            setRefresh(!refresh);
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleNavigation = (path) => {
    console.log("path: ", path);
    console.log("isProfileUpdate: ", isProfileUpdate);
    console.log("userType: ", storedUserType);

    if (isProfileUpdate == 0) {
      if (storedUserType == 4 || storedUserType == 5) {
        navigate(path);
      } else {
        if (path === "/request") {
          navigate("/profile");
          toast.error("Please update your profile to see requests");
        } else if (path === "/bloodcamps") {
          navigate("/profile");
          toast.error("Please update your profile to see Camps");
        } else if (path === "/donate") {
          navigate("/profile");
          toast.error("Please update your profile to see donation list");
        }
      }
    } else {
      navigate(path);
    }
  };

  const renderRequestCard = (request) => {
    return (
      <div className="request-card col position-relative" key={request.id}>
        {request?.is_critical && (
          <div className="emergency-tag position-absolute">Emergency</div>
        )}
        <div className="request-header d-flex align-items-center">
          <div className="align-content-center">
            <img
              src={getData?.user_profile?.profile_picture || profPicImg}
              style={{
                border: "1px solid gray",
                borderRadius: "50%",
                height: "60px",
                width: "60px",
              }}
              alt="Profile"
            />
          </div>
          <div className="request-details ms-3">
            <div
              className="request-date text-start fw-bold "
              style={{ color: "#000", fontSize: "20px" }}
            >
              {request?.username} {/* {request?.attender_last_name} */}
            </div>
            <div className="request-units text-start" style={{ color: "#000" }}>
              Units Required: {request?.quantity_units}
            </div>
            <div
              className="request-address text-start"
              style={{ color: "#000" }}
            >
              Address: {request?.delivery_address}
            </div>
            <div className="request-address text-start">
              Date: {formatDate(request?.required_date)}
            </div>
            {request?.phone_number && (
              <div>
                <label>Phone Number: </label>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `tel:${request.phone_number}`;
                  }}
                >
                  {request.phone_number}
                </Link>
              </div>
            )}
          </div>
          <div className="blood-group ms-auto">
            {/* <img
              src={request.bloodGroupImage || bloodGroupImg}
              alt="Blood Group"
            /> */}
            <h3 className="blood-group" style={{ color: "red" }}>
              {request.blood_group || ""}
            </h3>{" "}
            {/* Show blood group text */}
          </div>
        </div>

        <div className="accept-donor-button d-flex justify-content-around align-items-center ">
          <div className="icon-container d-flex me-3">
            <Link to="#" className="share-link me-2">
              <img src={shareIcon} alt="Share" className="icon-img" />
            </Link>
            {/* <Link to="#" className="location-link">
              <img src={locationIcon} alt="Location" className="icon-img" />
            </Link> */}
            <Link
              to={`https://www.google.com/maps?q=${request.delivery_lat},${request.delivery_lon}`}
              className="location-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={locationIcon} alt="Location" className="icon-img" />
            </Link>
          </div>
          {/* <button
            className="accepted-donors-btn btn btn-primary"
            onClick={() => {
              navigate(`/request/${request.id}`, { state: { request } });
            }}
          >
            Accept
          </button> */}
          <button
            className={`accepted-donors-btn btn ${
              request?.is_accepted ? "btn-secondary" : "btn-primary"
            }`}
            onClick={() => handleCardClick(request)}
            disabled={request?.is_accepted}
          >
            {request?.is_accepted ? "Accepted" : "Accept"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Banner Slider Section */}
      <Slider {...sliderSettings} className="banner-slider mb-5">
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.image_url}
              alt={`Banner ${index + 1}`}
              className="banner-image"
            />
          </div>
        ))}
        {/* <div>
          <img src={bannerImg} alt="Banner 2" className="banner-image" />
        </div>
        <div>
          <img src={bannerImg} alt="Banner 3" className="banner-image" />
        </div> */}
      </Slider>
      {/* Cards Section */}
      <div className="cards-container">
        <div
          className="card"
          onClick={() => handleNavigation("/request")}
          style={{ cursor: "pointer" }}
        >
          <img src={requestblood} alt="Request Blood" />
          <p style={{ color: "green" }}>Request For Blood</p>
        </div>
        {storedUserType == 4 || storedUserType == 5 ? (
          ""
        ) : (
          <div
            className="card"
            onClick={() => handleNavigation("/donate")}
            style={{ cursor: "pointer" }}
          >
            <img src={donateblood} alt="Donate Blood" />
            <p style={{ color: "green" }}>Donate Blood</p>
          </div>
        )}

        <div
          className="card"
          // onClick={() => navigate("/bloodcamps")}
          onClick={() => handleNavigation("/bloodcamps")}
          style={{ cursor: "pointer" }}
        >
          <img src={medicalcamps} alt="Blood-Medical Camps/Events" />
          <p style={{ color: "green" }}>Blood-Medical Camps/Events</p>
        </div>
        <div
          className="card"
          onClick={() => navigate("/funddonation")}
          style={{ cursor: "pointer" }}
        >
          <img src={funddonation} alt="Fund Donation" />
          <p style={{ color: "green" }}>Fund Donation</p>
        </div>
        {storedUserType == 4 || storedUserType == 5 ? (
          ""
        ) : (
          <div className="card cursor-pointer" onClick={() => handleSubmit()}>
            <img src={sos} alt="Emergency SOS" />
            <p style={{ color: "green" }}>Emergency SOS</p>
          </div>
        )}
      </div>
      {/* Recent Blood Requests Section */}

      {storedUserType == 4 || storedUserType == 5 ? (
        ""
      ) : (
        <>
          {isProfileUpdate !== 0 && (
            <div
              className="recent-requests mt-4"
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                display: isProfileUpdate == 0 ? "none" : "block",
              }}
            >
              <h2 style={{ fontSize: "1.5rem" }}>
                Recent Blood Requests
                <div>
                  <Link
                    to="/donate"
                    className="seeall"
                    style={{ fontSize: "1.25rem" }}
                  >
                    See all
                  </Link>
                </div>
              </h2>
            </div>
          )}
          <div className="blood-request-container">
            <div className="requests mt-5">
              {recentBloodRequest?.length > 0 ? (
                recentBloodRequest.map((request) => renderRequestCard(request))
              ) : (
                <p
                  style={{
                    display: isProfileUpdate == 0 ? "none" : "block",
                  }}
                >
                  No recent blood requests found.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Contribution Section */}
      <div className="Contribution-container mt-5">
        <div className="Contribution-card">
          <h3 className="Contribution-card-header mb-4">Our Contribution</h3>
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="Contribution-text">Total Requests</p>
              <p className="Contribution-count">{getData?.total_requests}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="Contribution-text">Total Donors</p>
              <p className="Contribution-count">{getData?.total_donors}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="Contribution-text">Total Units Donated</p>
              <p className="Contribution-count">
                {getData?.total_units_donated}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
