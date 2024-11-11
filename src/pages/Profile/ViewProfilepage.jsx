// import bloodGroupImg from "../../assets/bloodimage.png";
// import profPicImg from "../../assets/profpic.png";
import profImg from "../../assets/prof_img.png";
import User from "../../assets/User.png";
import SuccessIcon from "../../assets/success icon.png";
import Myrequest from "../../assets/myrequest.png";
// import Language from "../../assets/language.png";
import Bell from "../../assets/Bell.png";
// import DarkMode from "../../assets/dark_mode.png";
import Emergency from "../../assets/emergency-contact.png";
import Logout from "../../assets/Logout.png";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getProfile, setLoader, toggleAvailability } from "../../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dateUtils";

export default function ViewProfilepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getData, setData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const userType = localStorage.getItem("user_type");
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
  }, [dispatch, refresh]);

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
            <div
              className="text-start fw-bold"
              style={{
                display: userType == 4 || userType == 5 ? "none" : "flex",
              }}
            >
              {getData?.first_name} {getData?.last_name}
            </div>
            <div
              className="text-start fw-bold"
              style={{
                display: userType == 4 || userType == 5 ? "flex" : "none",
              }}
            >
              {getData.user_details?.organization_name}
            </div>
            <div className="text-start text-nowrap">{getData?.email}</div>
            <div
              className="text-start"
              style={{
                display: userType == 4 || userType == 5 ? "none" : "flex",
              }}
            >
              DOB:
              {getData?.date_of_birth
                ? formatDate(getData.date_of_birth)
                : "Date not updated"}
            </div>

            <div
              className="text-start"
              style={{
                display: userType == 4 || userType == 5 ? "none" : "flex",
              }}
            >
              LDD:
              {getData?.last_blood_donation_date
                ? formatDate(getData?.last_blood_donation_date)
                : "Date not updated"}
            </div>
          </div>
          <div className="blood-group">
            {/* <img
              src={getData?.bloodGroupImage || bloodGroupImg}
              alt="Blood Group"
              className="Blood_Group_img"
            /> */}
            <h3 className="blood-group" style={{ color: "red" }}>
              {getData.blood_group || ""}
            </h3>{" "}
            {/* Show blood group text */}
            {/* Fallback to default blood group image */}
          </div>
        </div>
      </div>
    );
  };

  const onAvailabilityChange = () => {
    dispatch(setLoader(true));
    try {
      dispatch(
        toggleAvailability((res) => {
          dispatch(setLoader(false));

          if (res.status === true) {
            toast.success(res.message);
            setRefresh(!refresh);
            // localStorage.setItem("is_profile_update", 1);
            navigate("/viewprofile");
          } else {
            toast.error(res.message || "An error occurred.");
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  return (
    <>
      <div className="form-container mb-5 mt-2">
        <div className="blood-viewprofile-container">
          <div className="">
            {getData ? renderRequestCard() : <p>No profile data found.</p>}
          </div>
        </div>
        <div
          className="switch-container mb-3"
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
        >
          <label className="switch-label">Availability</label>
          <label className="switch">
            <input
              type="checkbox"
              className="switch-input"
              checked={getData?.availability || false}
              onChange={onAvailabilityChange}
              // checked={getData?.availability || false}
              // onChange={(e) =>
              //   setData({ ...getData, availability: e.target.checked })
              // }
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
          onClick={() => {
            const profileVerified = localStorage.getItem("is_profile_update");
            if (profileVerified == 1) {
              navigate("/editprofile");
            } else {
              navigate("/profile");
              toast.error("please update your profile");
            }
          }}
        >
          <img src={User} alt="profile" style={{ cursor: "pointer" }} />
          <label className="switch-label">Edit Profile</label>
        </div>

        <div
          className="formpf-container mb-3"
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
          onClick={() => {
            const profileVerified = localStorage.getItem("is_profile_update");
            if (profileVerified == 1) {
              navigate("/donationhistory");
            } else {
              navigate("/profile");
              toast.error("please update your profile");
            }
          }}
        >
          <img src={SuccessIcon} alt="profile" />
          <label className="switch-label">Donate History</label>
        </div>
        <div
          className="formpf-container mb-3"
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
          onClick={() => {
            const profileVerified = localStorage.getItem("is_profile_update");
            if (profileVerified == 1) {
              navigate("/bloodrequest");
            } else {
              navigate("/profile");
              toast.error("please update your profile");
            }
          }}
        >
          <img src={Myrequest} alt="profile" />
          <label className="switch-label">My Requests</label>
        </div>
        {/* <div
          className="formpf-container mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/selectlanguage");
          }}
        >
          <img src={Language} alt="profile" />
          <label className="switch-label">Language</label>
        </div> */}
        <div
          className="formpf-container mb-3"
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
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
          style={{
            cursor: "pointer",
            display: userType == 4 || userType == 5 ? "none" : "flex",
          }}
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
            navigate("/login");
          }}
        >
          <img src={Logout} alt="profile" />
          <label className="switch-label">Log Out</label>
        </div>
      </div>
    </>
  );
}
