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

  const handleShareClick = () => {
    const shareMessage = `${data?.title}  event at ${data.location}. View details here: https://app.happydonors.ngo/eventdetails`;

    if (navigator.share) {
      // Use Web Share API if available
      navigator
        .share({
          title: "Blood Donation Request",
          text: `${data?.title}  event at ${data.location}. View details here: https://app.happydonors.ngo/eventdetails`,
          url: "https://app.happydonors.ngo/eventdetails",
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
            <Link to="#" className="me-2">
              <img
                src={shareIcon}
                alt="Share"
                className="img-fluid"
                style={{ width: "24px", height: "24px" }}
                onClick={() => handleShareClick()}
              />
            </Link>
            {/* <a
            href=
            className="location-link"
            target="_blank"
            rel="noopener noreferrer"
          > */}
            <Link
              to={`https://www.google.com/maps?q=${data.lat},${data.lon}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={locationIcon}
                alt="Location"
                className="img-fluid"
                style={{ width: "24px", height: "24px" }}
              />
            </Link>
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
            padding: "20px",
            backgroundColor: data?.participate === 1 ? "gray" : "green",
            border: data?.participate === 1 ? "gray" : "green",
          }}
          onClick={() => handleParticipate()}
          disabled={data?.participate === 1}
        >
          Participate
        </button>
        <button
          className={`btn flex-fill ms-2 fw-bold ${
            data?.contribute === 1 ? "btn-secondary" : "btn-primary"
          }`}
          style={{
            padding: "20px",
            backgroundColor: data?.contribute === 1 ? "gray" : "", // Use "" for the default primary color
            borderColor: data?.contribute === 1 ? "gray" : "",
          }}
          disabled={data?.contribute === 1}
          onClick={() => navigate("/contributefund", { state: { data } })}
        >
          Contribute
        </button>
      </div>
    </div>
  );
}
