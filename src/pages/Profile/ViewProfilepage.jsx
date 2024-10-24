import bloodGroupImg from "../../assets/bloodimage.png";
// import profPicImg from "../../assets/profpic.png";
import profImg from "../../assets/prof_img.png";

import User from "../../assets/User.png";
import SuccessIcon from "../../assets/success icon.png";
import Myrequest from "../../assets/myrequest.png";
import Language from "../../assets/language.png";
import Bell from "../../assets/Bell.png";
// import DarkMode from "../../assets/dark_mode.png";
import Emergency from "../../assets/emergency-contact.png";
import Logout from "../../assets/Logout.png";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getProfile, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function ViewProfilepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getData, setData] = useState({});
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          setData(res?.user);
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

  const renderRequestCard = () => {
    if (!getData) {
      return <p>No data available</p>;
    }

    return (
      <div className="request-card mb-4" key={getData?.id}>
        <div className="d-flex align-items-center justify-center">
          <div className="align-content-center">
            <img
              src={getData?.profile_picture || profImg}
              alt="Profile"
              className="profile_img"
              // style={{ height: "70px", width: "70px", borderRadius: "50%" }}
            />
            {/* Fallback to default image */}
          </div>
          <div className="request-details ms-3">
            <div className="text-start fw-bold">
              {getData?.first_name} {getData?.last_name}
            </div>
            <div className="text-start text-nowrap">{getData?.email}</div>
            <div className="text-start">DOB: {getData?.date_of_birth}</div>
            <div className="text-start">
              LDD: {getData?.last_blood_donation_date}
            </div>
          </div>
          <div className="blood-group">
            <img
              src={getData?.bloodGroupImage || bloodGroupImg}
              alt="Blood Group"
              className="Blood_Group_img"
            />{" "}
            {/* Fallback to default blood group image */}
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="form-container mb-5 mt-2">
        <div className="blood-viewprofile-container">
          <div className="">
            {getData ? renderRequestCard() : <p>No profile data found.</p>}
          </div>
        </div>
        <div className="switch-container mb-3">
          <label className="switch-label">Availability</label>
          <label className="switch">
            <input
              type="checkbox"
              className="switch-input"
              checked={getData?.availability || false}
              onChange={(e) =>
                setData({ ...getData, availability: e.target.checked })
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/editprofile");
          }}
        >
          <img src={User} alt="profile" style={{ cursor: "pointer" }} />
          <label className="switch-label">Edit Profile</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/donationhistory");
          }}
        >
          <img src={SuccessIcon} alt="profile" />
          <label className="switch-label">Donate History</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/bloodrequest");
          }}
        >
          <img src={Myrequest} alt="profile" />
          <label className="switch-label">My Requests</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/selectlanguage");
          }}
        >
          <img src={Language} alt="profile" />
          <label className="switch-label">Language</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/notifisetting");
          }}
        >
          <img src={Bell} alt="profile" />
          <label className="switch-label">Notification Preference</label>
        </div>
        {/* <div className="formpf-container mb-3">
          <img src={DarkMode} alt="profile" />
          <label
            className="switch-label"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/modesetting");
            }}
          >
            Mode
          </label>
        </div> */}
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/emergencycontact");
          }}
        >
          <img src={Emergency} alt="profile" />
          <label className="switch-label">Emergency Contact</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            localStorage.removeItem("user_type");
            localStorage.removeItem("is_profile_update");
            localStorage.removeItem("oAuth");
            navigate("/");
          }}
        >
          <img src={Logout} alt="profile" />
          <label className="switch-label">Log Out</label>
        </div>
      </div>
    </>
  );
}
