import "../../css/BloodrequestDetailPage.css";
import { useParams } from "react-router";
import { formatDate } from "../../utils/dateUtils";
import shareIcon from "../../assets/Share.png";
import profImg from "../../assets/prof_img.png";
import locationIcon from "../../assets/Mappoint.png";
import MapComponent from "../../components/map/MapComponent";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DonateAccept, setLoader, ViewBloodRequest } from "../../redux/product";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

export default function RequestDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [visibleShareCard, setVisibleShareCard] = useState(null); // Track visible card
  console.log("fdsfs");

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
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequest(id, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setData(res);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, id, refresh]);

  if (!data.request_id) {
    return <h4 className="mt-4 mb-4">No data found!</h4>;
  }

  const toggleShareOptions = (cardId, message, url) => {
    setVisibleShareCard((prev) => (prev === cardId ? null : cardId));

    const fullMessage = `${message}\nView details here: ${url}`; // Combine message with URL

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

  const shareMessage = `Blood Donation Request\n${data?.name} requires ${data?.units_required} units of ${data?.blood_group} blood at ${data?.location}.`;
  const encodedLink = encodeURIComponent(btoa(data?.request_id)); // Decode the request
  const shareUrl = `https://app.happydonors.ngo/viewbloodrequest/${encodedLink}`;
  const handleCardClick = (request) => {
    dispatch(setLoader(true));

    try {
      dispatch(
        DonateAccept(request?.request_id, (res) => {
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
  return (
    <>
      <div
        className="mb-5 mt-5 d-flex res_mobile mx-5"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          className="flex-shrink-0"
          style={{ flex: "0 0 40%", paddingRight: "20px" }}
        >
          <MapComponent
            path={[
              {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon),
              },
            ]}
          />
        </div>
        <div
          className="col-lg-7 col-md-8 col-sm-10 d-flex flex-column"
          style={{ flex: "0 0 60%" }}
        >
          <div className="col-lg-10 col-md-10 col-sm-10">
            <div
              className="request-card position-relative cursor-pointer"
              key={data?.request_id}
            >
              {data?.is_critical && (
                <div className="emergency-tag position-absolute">Emergency</div>
              )}
              <div className="request-header">
                <img
                  src={data?.profile_picture || profImg}
                  alt="Profile"
                  className="profile_img"
                />
                <div className="request-details">
                  <div className="text-start fw-bold">{data?.name}</div>
                  <div className="text-start">
                    Time:{" "}
                    {data?.from && <span>{convertToLocalTime(data.from)}</span>}
                    {data?.to && <span> to {convertToLocalTime(data.to)}</span>}
                  </div>
                  <div className="text-start">{formatDate(data?.date)}</div>
                  <div className="text-start">
                    Patient Name: {data.patient_name}
                  </div>
                  {data.hospital_or_bank_name && (
                    <div className="text-start">
                      Hospital / Blood Bank Name:{" "}
                      {data.hospital_or_bank_name}
                    </div>
                  )}
                  <div className="text-start">
                    Blood units: {data?.units_required}
                  </div>
                  <div className="text-start">{data?.location}</div>
                </div>
                <div className="blood-group">
                  {/* <img src={bloodGroupImg} alt="Blood Group" /> */}
                  <h3 className="blood-group" style={{ color: "red" }}>
                    {data.blood_group || "Unknown"}
                  </h3>{" "}
                  {/* Show blood group text */}
                </div>
              </div>

              <div className="accept-donar-button d-flex justify-content-between">
                <div className="icon-container">
                  {/* Share Icon */}
                  <img
                    src={shareIcon}
                    alt="Share"
                    className="icon-img"
                    onClick={() => {
                      toggleShareOptions(
                        data?.request_id,
                        shareMessage,
                        shareUrl
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  />

                  {/* Share Options */}
                  {visibleShareCard === data.request_id && (
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
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="icon-img"
                    />
                  </Link>
                </div>
                <button
                  className={`accepted-donors-btn btn ${
                    data?.is_accepted ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={() => handleCardClick(data)}
                  disabled={data?.is_accepted}
                >
                  {data?.is_accepted ? "Accepted" : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
