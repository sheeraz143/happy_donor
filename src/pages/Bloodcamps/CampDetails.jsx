import BloodCamps from "../../assets/BloodCamps.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/mappoint.png";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "../../components/map/MapComponent";

export default function CampDetails() {
  const location = useLocation();
  const { request } = location.state || {}; // Retrieve the passed request object
  console.log("data: ", request);
  const openRequests = [
    {
      id: 1,
      date: "2024.07.16,05:30",
      location: "City park",
      time: "10:00AM - 4:00PM",
      BloodType: "A+,B+",
      bloodGroupImage: BloodCamps,
    },
  ];

  const renderRequestCard = (request) => (
    <div className="request-card" key={request.id}>
      <div className=" d-flex align-items-start">
        <div className="request-details ms-3">
          <h4 className="text-start fw-bold" style={{ color: "green" }}>
            Camp1:
          </h4>
          <div className="text-start">Date: {request.date}</div>
          <div className="text-start">Location: {request.location}</div>
          <div className="text-start">Time: {request.time}</div>
          <div className="text-start">Blood Type: {request.BloodType}</div>
        </div>
      </div>

      <div className="d-flex align-items-center mt-3 justify-content-between">
        <div className="icon-container d-flex me-3">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link to="#" className="location-link">
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
        <button
          className="accepted-donors-btn btn btn-primary mx-5"
          style={{ width: "7.5rem" }}
        >
          Accept
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3 mb-4">Camps Details</h3>
      <div className="blood-group ms-auto mb-4">
        <img src={BloodCamps} alt="Blood Group" />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-8 mx-auto">
        <div className="mb-2">
          {openRequests.map((request) => renderRequestCard(request))}
        </div>
        <div className="mb-5">
          <MapComponent />
        </div>
      </div>
    </>
  );
}
