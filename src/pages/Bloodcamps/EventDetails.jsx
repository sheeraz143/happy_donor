import { Link, useLocation, useNavigate } from "react-router-dom";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
// import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import {
  ParticipateAccept,
  setLoader,
  ViewEventRequest,
} from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

export default function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location?.state?.request || {}; // Retrieve the passed request object
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewEventRequest(id, (res) => {
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

  const handleParticipate = () => {
    dispatch(setLoader(true));

    try {
      dispatch(
        ParticipateAccept(data?.id, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            navigate("/bloodcamps");
          } else {
            toast.error(res.message);
            navigate("/bloodcamps");
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

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
  const shareMessage = `New Event\nEvent title: ${data?.title} on ${formatDate1(
    data?.event_date
  )} from ${formatTime(data?.start_time)} - ${formatTime(data?.end_time)} at ${
    data?.location
  }.`;
  const encodedLink = encodeURIComponent(btoa(data?.id)); // Decode the request
  const shareUrl = `https://app.happydonors.ngo/vieweventdetails/${encodedLink}`;
  return (
    <div className="mt-4 mb-5">
      <h2 className="mb-3 text-center">Event Details</h2>
      <div className="col-lg-8 col-md-8 col-sm-8 shadow-sm p-3 mb-4 border rounded-3 mx-auto">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 text-start" style={{ color: "green" }}>
              Event Title : {data?.title}
            </h5>
            <p className="mb-0">Location: {data?.location}</p>
          </div>
          <div className="d-flex align-items-center">
            <div className="icon-container">
              {/* Share Icon */}
              <img
                src={shareIcon}
                alt="Share"
                className="icon-img"
                onClick={(event) => {
                  toggleShareOptions(data?.id, shareMessage, shareUrl);
                  event.stopPropagation();
                  event.preventDefault();
                }}
                style={{ cursor: "pointer" }}
              />

              {/* Share Options */}
              {visibleShareCard === data.id && (
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
                to={`https://www.google.com/maps?q=${data.lat},${data.lon}`}
                className="location-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={locationIcon} alt="Location" className="icon-img" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-lg-8 col-md-8 col-sm-8 mx-auto  mb-4 p-3"
        style={{ color: "blue" }}
      >
        <h6 className="mb-1 text-start">Description:</h6>
        <p className="mt-3" style={{ color: "#000" }}>
          {data?.description}
        </p>
      </div>

      <div className="col-lg-8 col-md-8 col-sm-8 mx-auto d-flex justify-content-between">
        <button
          className="btn btn-success flex-fill me-2 fw-bold"
          style={{
            color: "#fff",
            padding: "13px 20px", // Reduced padding for smaller height
            backgroundColor: data?.participate === 1 ? "#e6e6e6" : "green",
            borderColor: data?.participate === 1 ? "#e6e6e6" : "green",
          }}
          onClick={() => handleParticipate()}
          disabled={data?.participate === 1}
        >
          {data?.participate === 1 ? "Participated" : "Participate"}
        </button>
        <button
          className={`btn flex-fill ms-2 fw-bold ${
            data?.contribute === 1 ? "btn-secondary" : "btn-primary"
          }`}
          style={{
            color: "#fff",
            padding: "10px 20px", // Reduced padding for smaller height
            backgroundColor: data?.contribute === 1 ? "gray" : "", // Use "" for the default primary color
            borderColor: data?.contribute === 1 ? "gray" : "",
          }}
          disabled={data?.contribute === 1}
          onClick={() => navigate("/contributefund", { state: { data } })}
        >
          {data?.contribute === 1 ? "Contributed" : "Contribute"}
        </button>
      </div>
    </div>
  );
}
