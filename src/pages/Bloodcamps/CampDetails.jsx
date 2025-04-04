import BloodCamps from "../../assets/BloodCamps.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "../../components/map/MapComponent";
// import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import {
  DonateAcceptCamp,
  setLoader,
  ViewCampsRequest,
  // ViewCampsRequest,
} from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

export default function CampDetails() {
  const location = useLocation();
  const campID = location.state?.request || {}; // Retrieve the passed request object
  const dispatch = useDispatch();
  // const [data, setData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewCampsRequest(campID, (res) => {
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

  const renderRequestCard = () => {
    const shareMessage = `New Blood Camp\nCamp title: ${data?.title} on ${data?.date} from ${data?.time} at ${data?.location}.`;
    const encodedLink = encodeURIComponent(btoa(data.camp_id)); // Decode the request
    const shareUrl = `https://app.happydonors.ngo/viewcampdetails/${encodedLink}`;
    return (
      <div className="request-card mb-4" key={data.camp_id}>
        <div className="d-flex align-items-start">
          <div className="request-details ms-3">
            <h4 className="text-start fw-bold">{data.title || "Camp"}</h4>
            <div className="text-start">Date: {data.date}</div>
            <div className="text-start">
              Time: {data.time || "Not specified"}
            </div>
            <div className="text-start">Location: {data.location}</div>
          </div>
        </div>

        <div className="d-flex align-items-center mt-3 justify-content-between">
          <div className="icon-container d-flex me-3">
            <Link to="#" className="share-link me-2">
              <img
                src={shareIcon}
                alt="Share"
                className="icon-img"
                // onClick={() => handleShareClick(data)}
                onClick={(event) => {
                  toggleShareOptions(data?.camp_id, shareMessage, shareUrl);
                  event.stopPropagation();
                  event.preventDefault();
                }}
              />
            </Link>

            {/* Share Options */}
            {visibleShareCard === data.camp_id && (
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
              to={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
              className="location-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={locationIcon} alt="Location" className="icon-img" />
            </Link>
          </div>
          <button
            className={`accepted-donors-btn btn ${
              data.is_accepted ? "btn-secondary" : "btn-primary"
            }`}
            style={{ width: "7.5rem" }}
            onClick={(event) => handleCardClick(data, event)}
            disabled={data?.is_accepted}
          >
            {data.is_accepted ? "Accepted" : "Accept"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="mt-3 mb-4 text-center">Camp Details</h3>
      <div className="d-flex justify-content-center ms-auto mb-4">
        <img
          src={data?.camp_image || BloodCamps}
          alt="Camp image not uploaded "
          style={{ maxWidth: "100%", maxHeight: "200px" }}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
            // e.target.src = BloodCamps; // Set to default image on error
          }}
        />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-8 mx-auto">
        <div className="mb-2">
          {data ? renderRequestCard(data) : <p>No camp details available.</p>}
        </div>
        <div className="mb-5">
          <MapComponent
            path={
              data.latitude && data.longitude
                ? [
                    {
                      lat: parseFloat(data.latitude) || 0,
                      lng: parseFloat(data.longitude) || 0,
                    },
                  ]
                : []
            }
          />
        </div>
      </div>
    </>
  );
}
