import "../css/BloodRequest.css";
import bloodGroupImg from "../assets/bloodimage.png";
import { Link } from "react-router-dom";
import shareIcon from "../assets/Share.png";
import profImg from "../assets/prof_img.png";
import locationIcon from "../assets/Mappoint.png";
import { useDispatch } from "react-redux";
import { BloodDonateList, DonateAccept, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Pagination } from "antd";

function Donate() {
  const [activeTab, setActiveTab] = useState("matched");
  const [openRequests, setOpenRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);
  const [requestCount, setRequestCount] = useState({
    matched: 0,
    unmatched: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchData = (tab) => {
    dispatch(setLoader(true)); // Start loading
    dispatch(
      BloodDonateList(tab, (res) => {
        dispatch(setLoader(false));

        if (res.errors) {
          toast.error(res.errors);
          dispatch(setLoader(false));
        } else {
          if (tab === "matched") {
            setOpenRequests(res?.requests);
            setRequestCount((prevCount) => ({
              ...prevCount,
              matched: res.pagination.total,
            }));
          } else {
            setClosedRequests(res?.requests);
            setRequestCount((prevCount) => ({
              ...prevCount,
              unmatched: res.pagination.total,
            }));
          }
        }
      })
    ).catch((error) => {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    });
  };

  useEffect(() => {
    fetchData("matched", 1);
    fetchData("unmatched", 1);
  }, [dispatch]);

  useEffect(() => {
    fetchData(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handleCardClick = (request) => {
    // console.log("request: ", request);
    // navigate(`/request/${request?.request_id}`, { state: { request } });

    dispatch(setLoader(true));

    try {
      dispatch(
        DonateAccept(request?.request_id, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
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

  const renderRequestCard = (request, showAcceptButton) => (
    <div className="request-card position-relative" key={request?.request_id}>
      {request.is_critical && (
        <div className="emergency-tag position-absolute">Emergency</div>
      )}
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture || profImg}
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
          <div className="text-start fw-bold">{request?.name}</div>
          <div className="text-start">{request?.location}</div>
          <div className="text-start">
            Blood units: {request?.units_required}
          </div>
          <div className="text-start">{request?.date}</div>
        </div>
        <div className="blood-group ms-auto">
          <img src={bloodGroupImg} alt="Blood Group" />
        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3">
        <div className="icon-container d-flex me-3">
          <Link to="#" className="share-link me-2">
            <img src={shareIcon} alt="Share" className="icon-img" />
          </Link>
          <Link
            to={`https://www.google.com/maps?q=${request.lat},${request.lon}`}
            className="location-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={locationIcon} alt="Location" className="icon-img" />
          </Link>
        </div>
        {showAcceptButton && (
          <button
            className={`accepted-donors-btn btn ${
              request?.is_accepted ? "btn-secondary" : "btn-primary"
            }`}
            onClick={() => handleCardClick(request)}
            disabled={request?.is_accepted}
          >
            {request?.is_accepted ? "Accepted" : "Accept"}
          </button>
        )}
      </div>
    </div>
  );

  const renderOthersCard = (request) => (
    <div className="request-card" key={request?.request_id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture || profImg}
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
          <div className="text-start">{request?.location}</div>
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
            Matching requests ({requestCount.matched || 0})
          </button>
          <button
            className={`tab ${activeTab === "unmatched" ? "active" : ""}`}
            onClick={() => setActiveTab("unmatched")}
          >
            Other requests ({requestCount.unmatched || 0})
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
        <Pagination
          align="center"
          className="mb-4"
          current={currentPage}
          total={requestCount[activeTab] || 0}
          onChange={(page) => {
            setCurrentPage(page);
            fetchData(activeTab, page);
          }}
        />
      </div>
    </>
  );
}

export default Donate;
