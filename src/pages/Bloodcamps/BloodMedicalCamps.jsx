import { useEffect, useState } from "react";
import BloodCamps from "../../assets/BloodCamps.png";
import bloodGroupImage from "../../assets/bloodimage.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { formatDate } from "../../utils/dateUtils";
import { CampsList, DonateAcceptCamp, setLoader } from "../../redux/product";
import profImg from "../../assets/prof_img.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const BloodMedicalCamps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [camps, setCamps] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("matched");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCampsAndEvents = async () => {
      const handleResponse = (result, type) => {
        if (result.code === 200) {
          if (type === "matched") {
            setCamps(result.camps || []);
          } else {
            setEvents(result.events || []);
          }
        } else {
          toast.error(result.message || "Failed to fetch data");
        }
      };

      // Fetch both matched and unmatched data initially
      await CampsList("matched", (result) =>
        handleResponse(result, "matched")
      )();
      await CampsList("unmatched", (result) =>
        handleResponse(result, "unmatched")
      )();
    };

    fetchCampsAndEvents();
  }, [refresh]);

  const handleContribute = (request) => {
    if (request?.contribute === 1) return; // Prevent navigation if already contributed
    navigate("/contributefund", { state: { request } });
  };

  const handleCardClick = (request, event) => {
    event.stopPropagation();
    // return;

    // console.log("request: ", request);
    // return;
    // // navigate(`/request/${request?.request_id}`, { state: { request } });

    dispatch(setLoader(true));

    try {
      dispatch(
        DonateAcceptCamp(request?.camp_id, (res) => {
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
  const handleParticipate = (request) => {
    dispatch(setLoader(true));

    try {
      dispatch(
        DonateAcceptCamp(request?.id, (res) => {
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

  const renderRequestCard = (request) => (
    <div className="request-card position-relative" key={request?.camp_id}>
      <div
        className="request-header cursor-pointer"
        onClick={() => {
          navigate("/campdetails", { state: { request: request?.camp_id } });
        }}
      >
        {request?.is_critical && (
          <div className="emergency-tag position-absolute">Emergency</div>
        )}
        <img
          src={request?.camp_image || profImg}
          alt="Profile"
          className="profile_img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = profImg;
          }}
        />
        <div className="request-details">
          <div className="text-start fw-bold">{request?.title}</div>
          <div className="text-start">{request?.location}</div>
          <div className="text-start">
            Blood units: {request?.units_required}
          </div>
          <div className="text-start">{formatDate(request?.date)}</div>
        </div>
        <div className="blood-group">
          <img
            src={BloodCamps}
            alt="Blood Group"
            style={{ maxWidth: "160px" }}
          />
        </div>
      </div>

      <div className="accept-donar-button d-flex justify-content-around">
        <div className="icon-container">
          <Link href="#" className="share-link">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link
            href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
            className="location-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
        <button
          className={`accepted-donors-btn btn ${
            request?.is_accepted ? "btn-secondary" : "btn-primary"
          }`}
          onClick={(event) => handleCardClick(request, event)}
          disabled={request?.is_accepted}
        >
          {request?.is_accepted ? "Accepted" : "Accept"}
        </button>
      </div>
    </div>
  );

  const renderOthersCard = (request) => (
    <div
      className="request-card"
      key={request?.id}
      onClick={() => {
        navigate("/eventdetails", { state: { request: request?.id } });
      }}
    >
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profilePic || profImg}
            alt="Profile"
            className="profile_img"
          />
        </div>
        <div className="request-details ms-3">
          <div className="text-start fw-bold">{request?.title}</div>
          <div className="text-start">Blood units: {request?.units}</div>
          <div className="text-start">{formatDate(request?.event_date)}</div>
          <div className="text-start">{request?.location}</div>
        </div>
        <div className="blood-group ms-auto">
          <img
            src={request?.bloodGroupImage || bloodGroupImage}
            alt="Blood Group"
            style={{ maxWidth: "130px" }}
          />
        </div>
      </div>
      <div className="mt-3">
        <div className="d-flex mx-3">
          <Link href="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link
            href={`https://www.google.com/maps?q=${request.lat},${request.lon}`}
            className="location-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <div className="d-flex me-3 justify-content-around">
          {request?.option === "Participate" || request?.option === "Both" ? (
            <button
              className="accepted-donors-btn btn"
              style={{
                background: request?.participate === 1 ? "gray" : "green",
                color: "#fff",
                // cursor: request?.participate === 1 ? "not-allowed" : "pointer",
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (request?.participate === 1) return; // Prevent function if already participated
                handleParticipate(request);
              }}
              disabled={request?.participate === 1}
            >
              {request?.participate === 1 ? "Participated" : "Participate"}
            </button>
          ) : null}
          {request?.option === "Both" ? (
            <button
              className={`accepted-donors-btn btn ${
                request?.contribute === 1 ? "btn-disabled" : "btn-primary"
              }`}
              style={{
                color: "#fff",
                // cursor: request?.participate === 1 ? "not-allowed" : "pointer",
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (request?.contribute === 1) return; // Prevent click if already contributed
                handleContribute(request);
              }}
              disabled={request?.contribute === 1}
            >
              {request?.contribute === 1 ? "Contributed" : "Contribute"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3 text-center">Blood-Medical Camps/Events</h3>
      <div className="blood-request-container">
        <div className="tabs mt-4 mx-3">
          <button
            className={`tab ${activeTab === "matched" ? "active" : ""}`}
            onClick={() => setActiveTab("matched")}
          >
            Camps ({camps?.length})
          </button>
          <button
            className={`tab ${activeTab === "unmatched" ? "active" : ""}`}
            onClick={() => setActiveTab("unmatched")}
          >
            Events ({events?.length})
          </button>
        </div>
        <div className="requests mb-5 mx-4">
          {activeTab === "matched" &&
            camps.map((request) => renderRequestCard(request))}
          {activeTab === "unmatched" &&
            events?.map((request) => renderOthersCard(request))}
        </div>
        <Pagination
          align="center"
          className="mb-4"
          current={currentPage}
          total={activeTab === "matched" ? camps?.length : events?.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default BloodMedicalCamps;
