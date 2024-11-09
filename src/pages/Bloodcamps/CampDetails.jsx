import BloodCamps from "../../assets/BloodCamps.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "../../components/map/MapComponent";
// import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import { setLoader, ViewCampsRequest } from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CampDetails() {
  const location = useLocation();
  console.log("location: ", location);
  const id = location.state.request || {}; // Retrieve the passed request object
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewCampsRequest(id, (res) => {
          if (res.code === 200) {
            setData(res);
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, []);

  const renderRequestCard = (camp) => (
    <div className="request-card" key={camp.camp_id}>
      <div className="d-flex align-items-start">
        <div className="request-details ms-3">
          <h4 className="text-start fw-bold" style={{ color: "green" }}>
            {camp.title || "Camp"}
          </h4>
          <div className="text-start">Date: {camp.date}</div>
          <div className="text-start">Location: {camp.location}</div>
          <div className="text-start">Time: {camp.time || "Not specified"}</div>
          <div className="text-start">
            Blood Types Needed: {camp.blood_types_needed || "Not specified"}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center mt-3 justify-content-between">
        <div className="icon-container d-flex me-3">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <a
            href={`https://www.google.com/maps?q=${camp.latitude},${camp.longitude}`}
            className="location-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={locationIcon} alt="Location" className="icon-img" />
          </a>
        </div>
        <button
          className={`accepted-donors-btn btn ${
            camp.is_accepted ? "btn-secondary" : "btn-primary"
          }`}
          style={{ width: "7.5rem" }}
          disabled={camp.is_accepted}
        >
          {camp.is_accepted ? "Accepted" : "Accept"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3 mb-4 text-center">Camp Details</h3>
      <div className="d-flex justify-content-center ms-auto mb-4">
        <img
          src={data?.camp_image || BloodCamps}
          alt="Camp"
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-8 mx-auto">
        <div className="mb-2">
          {data ? renderRequestCard(data) : <p>No camp details available.</p>}
        </div>
        <div className="mb-5">
          {/* <MapComponent latitude={data?.latitude} longitude={data?.longitude} /> */}
          <MapComponent
            path={[
              {
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
