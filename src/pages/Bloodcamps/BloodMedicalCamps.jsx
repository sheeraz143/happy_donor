import { useEffect, useState } from "react";
import BloodCamps from "../../assets/BloodCamps.png";
// import bloodGroupImage from "../../assets/bloodimage.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { formatDate } from "../../utils/dateUtils";
import {
  CampsList,
  DonateAcceptCamp,
  ParticipateAccept,
  setLoader,
} from "../../redux/product";
import profImg from "../../assets/prof_img.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

const BloodMedicalCamps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [camps, setCamps] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("matched");
  const [currentPage, setCurrentPage] = useState(1);

  const [visibleShareCard, setVisibleShareCard] = useState(null); // Track visible card

  const toggleShareOptions = (cardId, message, url) => {
    setVisibleShareCard((prev) => (prev === cardId ? null : cardId));

    const fullMessage = `\n${message}\nView details here: ${url}`; // Combine message with URL

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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCampsAndEvents = async () => {
      const handleResponse = (result, type) => {
        // console.log("result: ", result);
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
        ParticipateAccept(request?.id, (res) => {
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

  const renderRequestCard = (request) => {
    const shareMessage = `New Blood Camp\nCamp title: ${request?.title} on ${request?.date} from ${request?.time} at ${request?.location}.`;
    const shareUrl = `https://app.happydonors.ngo/viewcampdetails/${request?.camp_id}`;
    return (
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

          <div className="request-details">
            <div className="text-start fw-bold">{request?.title}</div>
            <div className="text-start">Date: {request.date}</div>
            <div className="text-start">
              Time: {request.time || "Not specified"}
            </div>
            <div className="text-start">{request?.location}</div>
          </div>
          <div className="blood-group">
            <img
              src={request?.camp_image || BloodCamps}
              alt="Blood Group"
              style={{ maxWidth: "150px", height: "150px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profImg;
              }}
            />
          </div>
        </div>

        {/* <div className="accept-donar-button d-flex justify-content-around"> */}
        <div className="d-flex align-items-center mt-3 justify-content-between">
          <div className="icon-container">
            {/* Share Icon */}
            <img
              src={shareIcon}
              alt="Share"
              className="icon-img"
              onClick={() => {
                toggleShareOptions(request?.camp_id, shareMessage, shareUrl);
                // event.stopPropagation();
                // event.preventDefault();
              }}
              style={{ cursor: "pointer" }}
            />

            {/* Share Options */}
            {visibleShareCard === request.camp_id && (
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
              to={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
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
  };

  const renderOthersCard = (request) => {
    const formatDate1 = (dateString) => {
      if (!dateString) return "Invalid date";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString) => {
      if (!timeString || !/^\d{2}:\d{2}:\d{2}$/.test(timeString))
        return "Invalid time";
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(hours, minutes);
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    };

    // Usage in the share message:
    const shareMessage = `New Event\nEvent title: ${
      request?.title
    } on ${formatDate1(request?.event_date)} from ${formatTime(
      request?.start_time
    )} - ${formatTime(request?.end_time)} at ${request?.location}.`;

    const shareUrl = `https://app.happydonors.ngo/vieweventdetails/${request?.id}`;
    return (
      <div
        className="request-card cursor-pointer"
        key={request?.id}
        onClick={() => {
          // console.log("request?.id: ", request?.id);
          // return;
          navigate("/eventdetails", { state: { request: request?.id } });
          // navigate(`/eventdetails/${request?.id}`);
        }}
      >
        <div className="request-header d-flex align-items-center">
          <div className="align-content-center"></div>
          <div className="request-details ms-3">
            <div className="text-start fw-bold">{request?.title}</div>
            {/* <div className="text-start">Blood units: {request?.units}</div> */}
            <div className="text-start">{formatDate(request?.event_date)}</div>
            <div className="text-start">{request?.location}</div>
            <div className="text-start" style={{ color: "#0d6efd" }}>
              Status: {request?.status}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="d-flex me-3 justify-content-around align-items-center">
            <div className="">
              <div className="icon-container">
                {/* Share Icon */}
                <img
                  src={shareIcon}
                  alt="Share"
                  className="icon-img"
                  onClick={(event) => {
                    toggleShareOptions(request?.id, shareMessage, shareUrl);
                    event.stopPropagation();
                    event.preventDefault();
                  }}
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
                  to={`https://www.google.com/maps?q=${request.lat},${request.lon}`}
                  className="location-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={locationIcon} alt="Location" className="icon-img" />
                </Link>
              </div>
            </div>
            {request?.option === "Participate" || request?.option === "Both" ? (
              <button
                className="accepted-donors-btn btn"
                style={{
                  background: request?.participate === 1 ? "" : "green",
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
  };

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
        <div>
          {activeTab === "matched" && camps?.length === 0 && (
            <h4 className="mx-auto mb-5 text-center">No Data available.</h4>
          )}
          {activeTab === "unmatched" && events?.length === 0 && (
            <h4 className="mx-auto mb-5 text-center">No Data available.</h4>
          )}
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
