import { useCallback, useEffect, useState } from "react";
import "../css/BloodRequest.css";
import bloodGroupImg from "../assets/bloodgroup.png";
import profPicImg from "../assets/prof_img.png";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { CampsLists, CancelBloodCamp, setLoader } from "../redux/product";
import { Pagination } from "antd";
import Modal from "react-modal";
import { formatDate } from "../utils/dateUtils";

const CampsList = () => {
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closureReason, setClosureReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const openModal = (request, event) => {
    event.stopPropagation();
    setSelectedRequest(request);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setClosureReason("");
    setAdditionalComments("");
    setModalIsOpen(false);
  };

  const loadData = useCallback(
    (tab, page = 1) => {
      dispatch(setLoader(true)); // Start loading
      try {
        dispatch(
          CampsLists(
            tab,
            (res) => {
              console.log("res: ", res);
              dispatch(setLoader(false));

              if (res.errors) {
                toast.error(res.errors);
              } else {
                if (tab === "open") {
                  setOpenRequests(res.camps);
                  setRequestCount((prevCount) => ({
                    ...prevCount,
                    matched: res.pagination.total,
                  }));
                } else {
                  setClosedRequests(res.camps);
                  setRequestCount((prevCount) => ({
                    ...prevCount,
                    unmatched: res.pagination.total,
                  }));
                }
              }
            },
            page
          )
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
  }, [activeTab, dispatch, loadData, refresh]);

  useEffect(() => {
    loadData("open"); // Load open requests initially
    loadData("closed"); // Load closed requests initially
  }, [dispatch, loadData]);

  const handleCardClick = (request) => {
    navigate(`/campsrequestdetail/${request.camp_id}`);
  };

  const handleAcceptedDonorsClick = (request, event) => {
    event.stopPropagation();
    navigate(`/donarlist/${request.request_id}`);
  };

  const handleSubmit = () => {
    if (!closureReason.trim()) {
      toast.error("Closure reason is required");
      return;
    }
    if (!additionalComments.trim()) {
      toast.error("Additional comments are required");
      return;
    }
    const dataToSend = {
      closure_reason: closureReason,
      additional_comments: additionalComments,
    };

    dispatch(setLoader(true));

    try {
      dispatch(
        CancelBloodCamp(selectedRequest.camp_id, dataToSend, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            closeModal();
            setRefresh(!refresh);
            navigate("/bloodrequest");
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

  const renderRequestCard = (request, isOpen) => {
    return (
      <div
        className="request-card"
        key={request.request_id}
        style={{ cursor: "pointer" }}
        onClick={() => handleCardClick(request)}
      >
        <div className="request-header">
          <div className="align-content-center">
            <img
              src={request.profile_picture || profPicImg}
              alt="Profile"
              style={{ height: "70px", width: "70px", borderRadius: "50%" }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                e.target.src = profPicImg; // Set to default image on error
              }}
            />
          </div>
          <div className="request-details">
            <div className="request-date text-start"> {request?.title}</div>
            <div className="request-date text-start">
              {formatDate(request?.date)}
            </div>

            <div className="request-address text-start">{request.location}</div>

            {/* Conditionally render the reason and additional comments for closed requests */}
            {!isOpen && (
              <>
                <div className="request-units text-start">
                  Reason: {request.reason}
                </div>
                <div className="request-units text-start">
                  Additional Comments: {request.reason_comments}
                </div>
              </>
            )}
            <div className="request-status text-start">
              Status: {request.status}
            </div>
          </div>
          {isOpen && (
            <div className="blood-group text-start">
              <img
                src={bloodGroupImg}
                alt="Blood Group"
                onClick={(event) => openModal(request, event)}
              />
            </div>
          )}
        </div>

        <div className="accept-donar-button d-flex justify-content-center">
          {request.view_donors && (
            <button
              className="accepted-donors-btn"
              onClick={(event) => handleAcceptedDonorsClick(request, event)}
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
      <div className="blood-request-container mx-5">
        <h3 className="mt-3 d-flex justify-content-between align-items-center">
          <span className="mx-auto">My Camps</span>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/camps")}
          >
            Add New
          </button>
        </h3>
        <div className="tabs mt-4 ">
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
            openRequests.map((request) => renderRequestCard(request, true))}
          {activeTab === "closed" &&
            closedRequests.map((request) => renderRequestCard(request, false))}
        </div>
        <div>
          {activeTab === "open" && openRequests.length === 0 && (
            <h4 className="mx-auto mb-5 text-center">No Data available.</h4>
          )}
          {activeTab === "closed" && closedRequests.length === 0 && (
            <h4 className="mx-auto mb-4 text-center">No Data available.</h4>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gratitude Message"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="d-flex flex-column align-items-center">
          <h3 className="cancel_blood_req ">Close Camp</h3>
          <label className="text-start w-100">
            Reason for closing the camp
          </label>
          <select
            className="form-input w-100 mb-3"
            onChange={(e) => setClosureReason(e.target.value)}
          >
            <option value="">Select reason</option>
            <option value="Request fulfilled">Request fulfilled</option>
            <option value="Request canceled">Request canceled</option>
            <option value="Found an alternate solution">
              Found an alternate solution
            </option>
            <option value="Others">Others (please specify)</option>
          </select>
          <label className="text-start w-100">Additional comments</label>
          <textarea
            className="form-input w-100 mb-3"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
          <div className="d-flex justify-content-evenly w-100">
            <button onClick={closeModal} className="btn btn-primary">
              Close
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CampsList;
