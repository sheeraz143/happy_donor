import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Home.css";
import bannerImg from "../assets/banner.png";
import requestblood from "../assets/requestblood.png";
import donateblood from "../assets/donateblood.png";
import medicalcamps from "../assets/medicalcamps.png";
import funddonation from "../assets/funddonation.png";
import sos from "../assets/sos.png";
import bloodGroupImg from "../assets/bloodimage.png";
import profPicImg from "../assets/profpic.png";
import shareIcon from "../assets/Share.png";
import locationIcon from "../assets/Mappoint.png";
import { Link, useNavigate } from "react-router-dom";
import { dashboardData, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getData, setData] = useState({});
  const [recentBloodRequest, setRecentBloodRequest] = useState([]);
  useEffect(() => {
    dispatch(setLoader(true)); // Start loading
    window.scrollTo(0, 0);
    try {
      dispatch(
        dashboardData((res) => {
          console.log("res: ", res);
          setData(res);
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
  }, [dispatch]);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const renderRequestCard = (request) => {
    return (
      <div className="request-card" key={request.id}>
        <div className="request-header d-flex align-items-center">
          <div className="align-content-center">
            <img
              // src={request?.user_profile?.profile_picture || profPicImg}
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
            <div className="request-id">Request ID: {request?.id}</div>
            {/* Changed recentBloodRequest to request */}
            <div className="request-date">
              Attender: {request?.attender_first_name}{" "}
              {request?.attender_last_name}
            </div>
            <div className="request-units">
              Units Required: {request?.quantity_units}
            </div>
            <div className="request-address">
              Address: {request?.delivery_address}
            </div>
          </div>
          <div className="blood-group ms-auto">
            <img
              src={request.bloodGroupImage || bloodGroupImg}
              alt="Blood Group"
            />
          </div>
        </div>

        <div className="accept-donor-button d-flex align-items-center mt-3">
          <div className="icon-container d-flex me-3">
            <Link to="#" className="share-link me-2">
              <img src={shareIcon} alt="Share" className="icon-img" />
            </Link>
            <Link to="#" className="location-link">
              <img src={locationIcon} alt="Location" className="icon-img" />
            </Link>
          </div>
          <button
            className="accepted-donors-btn btn btn-primary"
            onClick={() => {
              navigate(`/request/${request.id}`, { state: { request } });
            }}
          >
            Accept
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Banner Slider Section */}
      <Slider {...sliderSettings} className="banner-slider mb-5">
        <div>
          <img src={bannerImg} alt="Banner 1" className="banner-image" />
        </div>
        <div>
          <img src={bannerImg} alt="Banner 2" className="banner-image" />
        </div>
        <div>
          <img src={bannerImg} alt="Banner 3" className="banner-image" />
        </div>
      </Slider>
      {/* Cards Section */}
      <div className="cards-container ">
        <div
          className="card"
          onClick={() => {
            navigate("/request");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={requestblood} alt="Request Blood" />
          <p>Request Blood</p>
        </div>
        <div
          className="card"
          onClick={() => {
            navigate("/donate");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={donateblood} alt="Donate Blood" />
          <p>Donate Blood</p>
        </div>
        <div
          className="card"
          onClick={() => {
            navigate("/bloodcamps");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={medicalcamps} alt="Blood-Medical Camps/Events" />
          <p>Blood-Medical Camps/Events</p>
        </div>
        <div
          className="card"
          onClick={() => {
            navigate("/funddonation");
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={funddonation} alt="Fund Donation" />
          <p>Fund Donation</p>
        </div>
        <div className="card">
          <img src={sos} alt="Emergency SOS" />
          <p>Emergency SOS</p>
        </div>
      </div>
      {/* Recent Blood Requests Section */}
      <div className="recent-requests">
        <h2>
          Recent Blood Requests
          <div>
            <Link to="/donate" className="seeall">
              See all
            </Link>
          </div>
        </h2>
      </div>
      {/* <div className=""> */}
      <div className="blood-request-container">
        <div className="requests mt-5">
          {recentBloodRequest.length > 0 ? (
            recentBloodRequest.map((request) => renderRequestCard(request))
          ) : (
            <p>No recent blood requests found.</p>
          )}
        </div>
      </div>
      {/* </div> */}
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
