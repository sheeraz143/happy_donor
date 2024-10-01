import "../css/BloodRequest.css";
import bloodGroupImg from "../assets/bloodimage.png";
// import profPicImg from "../assets/profpic.png";
import { Link, useNavigate } from "react-router-dom";
import shareIcon from "../assets/Share.png";
import locationIcon from "../assets/Mappoint.png";
import { useDispatch } from "react-redux";
import { BloodDonateList, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function Donate() {
  const [activeTab, setActiveTab] = useState("matched");
  const [openRequests, setOpenRequests] = useState([]);
  const [requestCount, setRequestCount] = useState({});
  const [closedRequests, setClosedRequests] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        BloodDonateList(activeTab, (res) => {
          console.log("res: ", res);
          dispatch(setLoader(false));

          // return;
          // setData(res?.user);
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
            dispatch(setLoader(false));
          } else {
            if (activeTab === "matched") {
              setOpenRequests(res?.requests);
              setRequestCount(res);
              setClosedRequests(res?.requests);

              dispatch(setLoader(false));
            } else {
              setClosedRequests(res?.requests);
              dispatch(setLoader(false));
            }
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, activeTab]);

  const handleCardClick = (request) => {
    console.log("request: ", request);
    // return;
    navigate(`/request/${request?.request_id}`, { state: { request } });
  };

  const renderRequestCard = (request, showAcceptButton) => (
    <div
      className="request-card"
      key={request?.id}
      onClick={() => handleCardClick(request)}
    >
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture}
            alt="Profile"
            style={{
              border: "1px solid gray",
              borderRadius: "50%",
              height: "60px",
              width: "60px",
              objectFit: "cover",
            }}
          />
          {/* Profile Picture Placeholder */}
        </div>
        <div className="request-details ms-3">
          <div className="text-start fw-bold">
            {request?.attender_first_name} {request?.attender_last_name}
          </div>
          <div className="text-start">{request?.location}</div>
          <div className="text-start">
            Blood units: {request?.units_required}
          </div>
          <div className="text-start">{request?.date}</div>
        </div>
        <div className="blood-group ms-auto">
          <img src={bloodGroupImg} alt="Blood Group" />
          {/* Blood Group Placeholder */}
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
          <button className="accepted-donors-btn btn btn-primary">
            Accept
          </button>
        )}
      </div>
    </div>
  );

  const renderOthersCard = (request) => (
    <div className="request-card" key={request?.id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture}
            alt="Profile"
            style={{
              border: "1px solid gray",
              borderRadius: "50%",
              height: "60px",
              width: "60px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="request-details ms-3">
          <div className="text-start fw-bold">
            {request?.attender_first_name}
          </div>
          <div className="text-start">
            Blood units: {request?.units_required}
          </div>
          <div className="text-start">{request?.date}</div>
          <div className="text-start"> {request?.location}</div>
        </div>
        <div className="blood-group ms-auto">
          <img src={bloodGroupImg} alt="Blood Group" />
        </div>
        <div className="icon-container d-flex me-3">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link to="#" className="location-link">
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3">Donate Blood</h3>
      <div className="blood-request-container">
        <div className="tabs mt-4">
          <button
            className={`tab ${activeTab === "matched" ? "active" : ""}`}
            onClick={() => setActiveTab("matched")}
          >
            Matching request ({requestCount?.pagination?.total || 0})
          </button>
          <button
            className={`tab ${activeTab === "unmatched" ? "active" : ""}`}
            onClick={() => setActiveTab("unmatched")}
          >
            Other request ({requestCount?.pagination?.total || 0})
          </button>
        </div>
        <div className="requests mb-5">
          {activeTab === "matched" &&
            openRequests.map((request) => renderRequestCard(request, true))}
          {activeTab === "unmatched" &&
            closedRequests.map((request) => renderOthersCard(request, false))}
        </div>
        <div>
          {activeTab === "matched" && openRequests.length === 0 && (
            <h4 className="mx-auto mb-5">No Data available.</h4>
          )}
          {activeTab === "unmatched" && closedRequests.length === 0 && (
            <h4 className="mx-auto mb-5">No Data available.</h4>
          )}
        </div>
      </div>
    </>
  );
}

export default Donate;
