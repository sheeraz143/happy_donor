import { useCallback, useEffect, useState } from "react";
import "../../css/BloodRequest.css";
import bloodGroupImg from "../../assets/bloodgroup.png";
import profPicImg from "../../assets/prof_img.png";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  CancelBloodRequest,
  donateBloods,
  setLoader,
} from "../../redux/product";
import { Pagination } from "antd";
import Modal from "react-modal";
import { formatDate } from "../../utils/dateUtils";

const ITEMS_PER_PAGE = 10; // Number of items per page

const BloodRequest = () => {
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

  // Load data with specified tab and page number
  const loadData = useCallback(
    (tab, page = 1) => {
      dispatch(setLoader(true));
      dispatch(
        donateBloods(tab, page, (res) => {
          dispatch(setLoader(false));
          if (res.errors) {
            toast.error(res.errors);
          } else {
            if (tab === "open") {
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
    },
    [dispatch]
  );

  useEffect(() => {
    loadData(activeTab, currentPage); // Load data on tab or page change
  }, [activeTab, currentPage, loadData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (request) => {
    navigate(`/bloodrequestdetail/${request.request_id}`);
  };

  const handleAcceptedDonorsClick = (request, event) => {
    event.stopPropagation();
    navigate(`/donarlist/${request.request_id}`);
  };

  const handleSubmit = () => {
    if (!closureReason.trim() || !additionalComments.trim()) {
      toast.error("Both reason and additional comments are required.");
      return;
    }

    const dataToSend = {
      closure_reason: closureReason,
      additional_comments: additionalComments,
    };

    dispatch(setLoader(true));
    dispatch(
      CancelBloodRequest(selectedRequest.request_id, dataToSend, (res) => {
        dispatch(setLoader(false));
        if (res.code === 200) {
          toast.success(res.message);
          closeModal();
          setRefresh(!refresh);
          loadData(activeTab, currentPage); // Refresh current page
        } else {
          toast.error(res.message);
        }
      })
    );
  };

  const renderRequestCard = (request, isOpen) => (
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
              e.target.onerror = null;
              e.target.src = profPicImg; // Set default image on error
            }}
          />
        </div>
        <div className="request-details">
          <div className="request-date text-start">{request.name}</div>
          <div className="request-date text-start">
            {formatDate(request.date)}
          </div>
          <div className="request-units text-start">
            Units Required: {request.units_required}
          </div>
          <div className="request-address text-start">{request.location}</div>
          <div className="request-status text-start">
            Status: {request.status}
          </div>
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

  return (
    <>
      <div className="blood-request-container mx-5">
        <h3 className="mt-3 d-flex justify-content-between align-items-center">
          <span className="mx-auto">My Requests</span>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/request")}
          >
            Add New
          </button>
        </h3>
        <div className="tabs mt-4">
          <button
            className={`tab ${activeTab === "open" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage(1); // Reset to page 1 when switching tabs
              setActiveTab("open");
            }}
          >
            Open ({requestCount.matched || 0})
          </button>
          <button
            className={`tab ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage(1); // Reset to page 1 when switching tabs
              setActiveTab("closed");
            }}
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
          total={requestCount[activeTab]}
          pageSize={ITEMS_PER_PAGE}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Close Request Modal"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="d-flex flex-column align-items-center">
          <h3 className="cancel_blood_req">Close Request</h3>
          <label className="text-start w-100">
            Reason for closing the request
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

export default BloodRequest;
