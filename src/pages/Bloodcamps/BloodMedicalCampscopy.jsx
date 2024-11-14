import { useEffect, useState } from "react";
import BloodCamps from "../../assets/BloodCamps.png";
import profPicImg from "../../assets/profpic.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { Link, useNavigate } from "react-router-dom";

const BloodMedicalCampsCopy = () => {
  const [activeTab, setActiveTab] = useState("open");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openRequests = [
    {
      id: 1, // Added unique id
      name: "sheeraz",
      hospital: "Mount Sinal Hospital",
      units: 2,
      date: "2024.07.16,05:30",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
    {
      id: 2, // Added unique id
      name: "john",
      hospital: "Mount Sinal Hospital",
      units: 2,
      date: "2024.07.16,05:30",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
    {
      id: 3, // Added unique id
      name: "smith",
      hospital: "Mount Sinal Hospital",
      units: 2,
      date: "2024.07.16,05:30",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
    {
      id: 4, // Added unique id
      name: "virat",
      hospital: "Mount Sinal Hospital",
      units: 2,
      date: "2024.07.16,05:30",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
  ];

  const closedRequests = [
    {
      id: 1, // Added unique id
      name: "sheeraz",
      units: 2,
      date: "2024.07.16,05:30",
      Address: "Nehru Street, chennai",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
    {
      id: 2, // Added unique id
      name: "john",
      Address: "Nehru Street, chennai",
      units: 2,
      date: "2024.07.16,05:30",
      profilePic: profPicImg,
      bloodGroupImage: BloodCamps,
    },
  ];
  const renderRequestCard = (request, showAcceptButton) => (
    <div className="request-card" key={request.id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img src={request.profilePic} alt="Profile" />
        </div>
        <div className="request-details ms-3">
          <div className="text-start fw-bold"> {request.name}</div>
          <div className="text-start"> {request.hospital}</div>
          <div className="text-start">Blood units: {request.units}</div>
          <div className="text-start"> {request.date}</div>
        </div>
        <div className="blood-group ms-auto">
          <img
            src={request.bloodGroupImage}
            alt="Blood Group"
            style={{ maxWidth: "130px" }}
          />
        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3">
        <div className="icon-container d-flex me-3">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link to="#" className="location-link">
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
        {showAcceptButton && (
          <button
            className="accepted-donors-btn btn btn-primary"
            onClick={() => {
              navigate("/campdetails", { state: { request } });
            }}
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );

  const renderOthersCard = (request) => (
    <div className="request-card" key={request.id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img src={request.profilePic} alt="Profile" />
        </div>
        <div className="request-details ms-3">
          <div className="text-start fw-bold"> {request.name}</div>
          <div className="text-start">Blood units: {request.units}</div>
          <div className="text-start"> {request.date}</div>
          <div className="text-start"> {request.Address}</div>
        </div>
        <div className="blood-group ms-auto">
          <img
            src={request.bloodGroupImage}
            alt="Blood Group"
            style={{ maxWidth: "130px" }}
          />
        </div>
      </div>
      <div className="mt-3">
        <div className=" d-flex me-3 ">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link to="#" className="location-link">
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <div className=" d-flex me-3 justify-content-between">
          <button
            className="accepted-donors-btn btn "
            style={{ background: "green", color: "#fff" }}
            onClick={() => {
              navigate("/bloodrequest");
            }}
          >
            Participate
          </button>
          <button
            className="accepted-donors-btn btn btn-primary"
            onClick={() => navigate("/contributefund")}
          >
            Contribute
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3">Blood-Medical Camps/Events</h3>
      <div className="blood-request-container">
        <div className="tabs mt-4">
          <button
            className={`tab ${activeTab === "open" ? "active" : ""}`}
            onClick={() => setActiveTab("open")}
          >
            Camps ({openRequests.length})
          </button>
          <button
            className={`tab ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            Events ({closedRequests.length})
          </button>
        </div>
        <div className="requests mb-5">
          {activeTab === "open" &&
            openRequests.map((request) => renderRequestCard(request, true))}
          {activeTab === "closed" &&
            closedRequests.map((request) => renderOthersCard(request))}
        </div>
      </div>
    </>
  );
};

export default BloodMedicalCampsCopy;
