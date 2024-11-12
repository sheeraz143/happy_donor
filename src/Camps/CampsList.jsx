import { useCallback, useEffect, useState } from "react";
import "../css/BloodRequest.css";
import bloodGroupImg from "../../src/assets/BloodCamps.png";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { CampsLists, CancelBloodCamp, setLoader } from "../redux/product";
import { Pagination } from "antd";
import Modal from "react-modal";
import { formatDate } from "../utils/dateUtils";
import { FaTimes } from "react-icons/fa";

const ITEMS_PER_PAGE = 10; // Set items per page

const CampsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRequests, setOpenRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);
  const [requestCount, setRequestCount] = useState({
    matched: 0,
    unmatched: 0,
  });
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [activeTab, setActiveTab] = useState("open");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closureReason, setClosureReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [totalItems, setTotalItems] = useState(0); // Track total items for pagination

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

  // Fetches data from the API based on active tab and page number
  const loadData = useCallback(
    (tab, page) => {
      dispatch(setLoader(true));
      try {
        dispatch(
          CampsLists(
            tab,
            page,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                if (tab === "open") {
                  setOpenRequests(res.camps);
                  console.log("res.camps: ", res.camps);

                  setRequestCount((prevCount) => ({
                    ...prevCount,
                    matched: res.pagination?.total,
                  }));
                } else {
                  setClosedRequests(res.camps);
                  setRequestCount((prevCount) => ({
                    ...prevCount,
                    unmatched: res.pagination?.total,
                  }));
                }
                setTotalItems(res.pagination?.total || 0); // Set total items for pagination
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

  // Reload data on tab or page change
  useEffect(() => {
    loadData(activeTab, currentPage);
  }, [activeTab, currentPage, loadData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (request) => {
    // Navigate to the details page of the selected camp
    navigate(`/campsrequestdetail/${request.camp_id}`);
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
            setCurrentPage(1); // Reset to page 1 after submission
            loadData(activeTab, 1); // Refresh data for the first page
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

  const handleAcceptedDonorsClick = (request, event) => {
    event.stopPropagation();
    navigate(`/camplist/${request.camp_id}`);
  };

  const renderRequestCard = (request, isOpen, index) => {
    return (
      <div
        className="request-card"
        key={`${request.camp_id}-${index}`}
        style={{ cursor: "pointer", position: "relative" }}
        onClick={() => handleCardClick(request)}
      >
        {/* Close Icon in the top-right corner */}
        <button
          className="close-button"
          onClick={(event) => openModal(request, event)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "white", // White background for contrast
            border: "1px solid lightgray", // Light gray border for better visibility
            borderRadius: "50%", // Circle shape
            color: "gray",
            cursor: "pointer",
            fontSize: "16px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", // Optional shadow for depth
          }}
        >
          <FaTimes />
        </button>
        <div className="request-header">
          <div className="request-details">
            <div className="request-date text-start"> {request?.title}</div>
            <div className="request-date text-start"> {request?.date}</div>
            <div className="request-date text-start"> Time:{request?.time}</div>
            <div className="request-date text-start">
              {formatDate(request?.date)}
            </div>
            <div className="request-address text-start">{request.location}</div>
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
          <div className="blood-group text-start">
            <img
              style={{ maxWidth: "200px" }}
              className="img_fluid"
              src={request.camp_image || bloodGroupImg}
              alt="Blood Group"
              // onClick={(event) => openModal(request, event)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = bloodGroupImg;
              }}
            />
          </div>
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
            openRequests?.map((request, index) =>
              renderRequestCard(request, true, index)
            )}
          {activeTab === "closed" &&
            closedRequests?.map((request, index) =>
              renderRequestCard(request, false, index)
            )}
        </div>
        <div>
          {activeTab === "open" && openRequests?.length === 0 && (
            <h4 className="mx-auto mb-5 text-center">No Data available.</h4>
          )}
          {activeTab === "closed" && closedRequests?.length === 0 && (
            <h4 className="mx-auto mb-4 text-center">No Data available.</h4>
          )}
        </div>
        <Pagination
          align="center"
          className="mb-4"
          current={currentPage}
          total={totalItems} // Total items for pagination
          pageSize={ITEMS_PER_PAGE} // Show 10 items per page
          onChange={handlePageChange} // Set new page and load data
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Close Camp Modal"
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
