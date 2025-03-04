import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Home.css";
// import bannerImg from "../assets/banner.png";
import requestblood from "../assets/requestblood.png";
import donateblood from "../assets/donateblood.png";
import medicalcamps from "../assets/medicalcamps.png";
import funddonation from "../assets/funddonation.png";
import sos from "../assets/star_sos.webp";
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

import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

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

  const [visibleShareCard, setVisibleShareCard] = useState(null); // Track visible card

  const toggleShareOptions = (cardId, message, url) => {
    setVisibleShareCard((prev) => (prev === cardId ? null : cardId));

    const fullMessage = `Blood Donation Request\n${message}\nView details here: ${url}`; // Combine message with URL

    // Copy to clipboard when the share icon is clicked
    navigator.clipboard
      .writeText(fullMessage)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  function convertToLocalTime(timeString) {
    // Check if the input is a valid time in "HH:mm" format
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) {
      return ""; // Return a default message for invalid time
    }

    // Parse the valid time string
    const [hours, minutes] = timeString.split(":").map(Number);

    // Create a new Date object
    const date = new Date();
    date.setHours(hours, minutes);

    // Format the time to a user-friendly format
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  useEffect(() => {
    dispatch(setLoader(true)); // Start loading
    window.scrollTo(0, 0);

    try {
      dispatch(
        dashboardData((res) => {
          setData(res);
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
            // toast.error("Unable to retrieve your location.");
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
          }
          if (res.status === 404) {
            toast.error(res?.data?.error);
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

  // const handleShareClick = (request) => {
  //   const shareMessage = `${request.username} requires ${request.quantity_units} units of ${request.blood_group} blood at ${request.delivery_address}. View details here: https://app.happydonors.ngo/viewbloodrequest/${request?.id}`;

  //   if (navigator.share) {
  //     // Use Web Share API if available
  //     navigator
  //       .share({
  //         title: "Blood Donation Request",
  //         text: shareMessage,
  //         url: `https://app.happydonors.ngo/viewbloodrequest/${request?.id}`,
  //       })
  //       .then(() => console.log("Share successful"))
  //       .catch((error) => console.error("Error sharing:", error));
  //   } else {
  //     // WhatsApp fallback if Web Share API isn't available
  //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
  //       shareMessage
  //     )}`;
  //     window.open(whatsappUrl, "_blank"); // Opens WhatsApp share URL in a new tab
  //   }
  // };

  // const handleShareClick = (request) => {
  //   // Define the share message
  //   const shareMessage = `${request?.username || "Someone"} requires ${
  //     request?.quantity_units || "a certain number of"
  //   } units of ${request?.blood_group || "blood"} at ${
  //     request?.my_address || "an unknown location"
  //   }.\n\nView details here: ${
  //     request?.id
  //       ? `https://app.happydonors.ngo/viewbloodrequest/${request?.id}`
  //       : "Visit our platform for more details."
  //   }`;

  //   if (navigator.share) {
  //     // Use Web Share API if supported
  //     navigator
  //       .share({
  //         title: "Blood Donation Request",
  //         text: shareMessage,
  //         url: request?.id
  //           ? `https://app.happydonors.ngo/viewbloodrequest/${request?.id}`
  //           : undefined, // Include the URL only if available
  //       })
  //       .then(() => console.log("Shared successfully"))
  //       .catch((error) => console.error("Error sharing:", error));
  //   } else {
  //     // WhatsApp fallback if Web Share API isn't supported
  //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
  //       shareMessage
  //     )}`;

  //     // Open WhatsApp share link in a new tab
  //     window.open(whatsappUrl, "_blank");
  //   }
  // };

  const renderRequestCard = (request) => {
    // Create the share message and URL
    const shareMessage = `${request?.username} requires ${request?.quantity_units} units of ${request?.blood_group} blood at ${request?.delivery_address}.`;
    const encodedLink = encodeURIComponent(btoa(request?.id)); // Decode the request
    const shareUrl = `https://app.happydonors.ngo/viewbloodrequest/${encodedLink}`;
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
          <div className="request-details ms-4">
            <div
              className="request-date text-start fw-bold "
              style={{ color: "#000" }}
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
              Date: {formatDate(request?.required_date)}
            </div>
            <div
              className="request-address text-start"
              style={{ color: "#000" }}
            >
              Time:{" "}
              {request?.from && <span>{convertToLocalTime(request.from)}</span>}
              {request?.to && (
                <span> to {convertToLocalTime(request.to)}</span>
              )}{" "}
            </div>
            <div className="text-start">
              Patient Name: {request.patient_name}
            </div>
            {request.hospital_or_bank_name && (
              <div className="text-start">
                Hospital / Blood Bank Name: {request.hospital_or_bank_name}
              </div>
            )}
            <div
              className="request-address text-start"
              style={{ color: "#000" }}
            >
              Address: {request?.delivery_address}
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

        <div className="accept-donor-button d-flex justify-content-between align-items-center ">
          <div className="icon-container d-flex me-3">
            {/* Share Icon */}
            <img
              src={shareIcon}
              alt="Share"
              className="icon-img"
              onClick={() =>
                toggleShareOptions(request.id, shareMessage, shareUrl)
              }
              style={{ cursor: "pointer" }}
            />

            {/* Share Options */}
            {visibleShareCard === request.id && (
              <div className="share-options">
                <WhatsappShareButton url={shareUrl} title={shareMessage}>
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
                <EmailShareButton
                  url={shareUrl}
                  subject="Urgent Blood Donation Request"
                  body={shareMessage}
                >
                  <EmailIcon size={32} round={true} />
                </EmailShareButton>
              </div>
            )}
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
          <p style={{ color: "green" }}>Request Blood</p>
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
            <img src={sos} alt="Emergency SOS" style={{ height: "61px" }} />
            <p style={{ color: "green" }}>Emergency Reach</p>
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
