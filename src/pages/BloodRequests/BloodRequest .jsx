import { useCallback, useEffect, useState } from "react";
import "../../css/BloodRequest.css";
import bloodGroupImg from "../../assets/bloodgroup.png";
// import profPicImg from "../../assets/profpic.png";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { donateBloods, setLoader } from "../../redux/product";
import { Pagination } from "antd";

const BloodRequest = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRequests, setOpenRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);
  const [requestCount, setRequestCount] = useState({
    matched: 0,
    unmatched: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTab, setActiveTab] = useState("open");

  const loadData = useCallback(
    (tab) => {
      dispatch(setLoader(true)); // Start loading
      try {
        dispatch(
          donateBloods(tab, (res) => {
            console.log("res: ", res);
            dispatch(setLoader(false));

            if (res.errors) {
              toast.error(res.errors);
            } else {
              if (tab === "open") {
                // setOpenRequests(
                //   res.requests.filter((req) => req.status === "In Process")
                // );
                setOpenRequests(res.requests);
                setRequestCount((prevCount) => ({
                  ...prevCount,
                  matched: res.pagination.total,
                }));
              } else {
                setClosedRequests(res.requests);
                setRequestCount((prevCount) => ({
                  ...prevCount,
                  unmatched: res.pagination.total,
                }));
              }
            }
          })
        );
      } catch (error) {
        toast.error(error.message || "Error fetching requests");
        dispatch(setLoader(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, dispatch, loadData]);

  useEffect(() => {
    loadData("open"); // Load open requests initially
    loadData("closed"); // Load closed requests initially
  }, [dispatch, loadData]);

  const handleCardClick = (request) => {
    navigate(`/donarlist/${request.request_id}`);
  };

  const renderRequestCard = (request) => {
    return (
      <div
        className="request-card"
        key={request.request_id}
        style={{ cursor: "pointer " }}
        onClick={() => {
          navigate(`/bloodrequestdetail/${request.request_id}`);
        }}
      >
        <div className="request-header">
          <div className="align-content-center">
            <img
              src={request.profile_picture}
              alt="Profile"
              style={{ height: "70px", width: "70px", borderRadius: "50%" }}
            />
          </div>
          <div className="request-details">
            <div className="request-id">Request ID: {request.request_id}</div>
            <div className="request-date">Date: {request.date}</div>
            <div className="request-units">
              Units Required: {request.units_required}
            </div>
            <div className="request-address">Address: {request.address}</div>
            <div className="request-status">Status: {request.status}</div>
          </div>
          <div className="blood-group">
            <img src={bloodGroupImg} alt="Blood Group" />
          </div>
        </div>

        <div className="accept-donar-button justify-content-end">
          {request.view_donors && (
            <button
              className="accepted-donors-btn"
              onClick={() => handleCardClick(request)}
            >
              Accepted Donors
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="mt-3">My Requests</h3>
      <div className="blood-request-container">
        <div className="tabs mt-4">
          <button
            className={`tab ${activeTab === "open" ? "active" : ""}`}
            onClick={() => setActiveTab("open")}
          >
            Open ({requestCount.matched || 0})
          </button>
          <button
            className={`tab ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            Closed ({requestCount.unmatched || 0})
          </button>
        </div>
        <div className="requests mb-5">
          {activeTab === "open" &&
            openRequests.map((request) => renderRequestCard(request))}
          {activeTab === "closed" &&
            closedRequests.map((request) => renderRequestCard(request))}
        </div>
        <div>
          {activeTab === "open" && openRequests.length === 0 && (
            <h4 className="mx-auto mb-5">No Data available.</h4>
          )}
          {activeTab === "closed" && closedRequests.length === 0 && (
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
            loadData(activeTab, page);
          }}
        />
      </div>
    </>
  );
};

export default BloodRequest;
