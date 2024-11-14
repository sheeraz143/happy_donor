import BloodCamps from "../../assets/BloodCamps.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "../../components/map/MapComponent";
// import { formatDate } from "../../utils/dateUtils";
import { useState } from "react";
import {
  DonateAcceptCamp,
  setLoader,
  // ViewCampsRequest,
} from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CampDetails() {
  const location = useLocation();
  console.log("location: ", location);
  const campData = location.state?.request || {}; // Retrieve the passed request object
  const dispatch = useDispatch();
  // const [data, setData] = useState({});
  const [refresh, setRefresh] = useState(false);

  // useEffect(() => {
  //   dispatch(setLoader(true));
  //   try {
  //     dispatch(
  //       ViewCampsRequest(campData?.id, (res) => {
  //         if (res.code === 200) {
  //           setData(res);
  //         } else {
  //           toast.error(res.message);
  //         }
  //         dispatch(setLoader(false));
  //       })
  //     );
  //   } catch (error) {
  //     toast.error(error.message || "Error fetching requests");
  //     dispatch(setLoader(false));
  //   }
  // }, []);

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

  const handleShareClick = (request) => {
    const shareMessage = `${request.title} camp at ${request.location}. View details here: https://happydonorsdev.devdemo.tech/viewcampdetails/${request?.camp_id}`;

    if (navigator.share) {
      // Use Web Share API if available
      navigator
        .share({
          title: "Blood Donation Request",
          text: shareMessage,
          url: `https://happydonorsdev.devdemo.tech/viewcampdetails/${request?.camp_id}`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // WhatsApp fallback if Web Share API isn't available
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareMessage
      )}`;
      window.open(whatsappUrl, "_blank"); // Opens WhatsApp share URL in a new tab
    }
  };

  const renderRequestCard = () => {
    return (
      <div className="request-card mb-4" key={campData.camp_id}>
        <div className="d-flex align-items-start">
          <div className="request-details ms-3">
            <h4 className="text-start fw-bold" style={{ color: "green" }}>
              {campData.title || "Camp"}
            </h4>
            <div className="text-start">Date: {campData.date}</div>
            <div className="text-start">
              Time: {campData.time || "Not specified"}
            </div>
            <div className="text-start">Location: {campData.location}</div>
          </div>
        </div>

        <div className="d-flex align-items-center mt-3 justify-content-between">
          <div className="icon-container d-flex me-3">
            <Link to="#" className="share-link me-2">
              <img
                src={shareIcon}
                alt="Share"
                className="icon-img"
                onClick={() => handleShareClick(campData)}
              />
            </Link>
            <Link
              to={`https://www.google.com/maps?q=${campData.latitude},${campData.longitude}`}
              className="location-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={locationIcon} alt="Location" className="icon-img" />
            </Link>
          </div>
          <button
            className={`accepted-donors-btn btn ${
              campData.is_accepted ? "btn-secondary" : "btn-primary"
            }`}
            style={{ width: "7.5rem" }}
            onClick={(event) => handleCardClick(campData, event)}
            disabled={campData?.is_accepted}
          >
            {campData.is_accepted ? "Accepted" : "Accept"}
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
          src={campData?.camp_image || BloodCamps}
          alt="Camp"
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-8 mx-auto">
        <div className="mb-2">
          {campData ? (
            renderRequestCard(campData)
          ) : (
            <p>No camp details available.</p>
          )}
        </div>
        <div className="mb-5">
          {/* <MapComponent latitude={data?.latitude} longitude={data?.longitude} /> */}
          <MapComponent
            path={[
              {
                lat: parseFloat(campData.latitude),
                lng: parseFloat(campData.longitude),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
