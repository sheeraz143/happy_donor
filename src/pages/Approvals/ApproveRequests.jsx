import { useEffect, useState } from "react";
import {
  ApproveAdminBloodRequest,
  CancelBloodRequest,
  donateBloods,
  setLoader,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";
import Modal from "react-modal";
import { formatDate } from "../../utils/dateUtils";
import profImg from "../../assets/prof_img.png";

export default function ApproveRequests() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closureReason, setClosureReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [requestId, setRequestId] = useState("");
  const [refresh, setRefresh] = useState(false);

  const openModal = (request_id) => {
    // console.log("request_id: ", request_id);
    setModalIsOpen(true);
    setRequestId(request_id);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setClosureReason("");
    setAdditionalComments("");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setLoader(true));
      const type = "all/admin";
      try {
        dispatch(
          donateBloods(
            type,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                setRequests(res?.requests);
                setTotalRequests(res?.pagination?.total);
              }
            },
            currentPage,
            perPage
          )
        );
      } catch (error) {
        toast.error(error.message || "Error fetching requests");
        dispatch(setLoader(false));
      }
    };

    fetchRequests();
  }, [dispatch, currentPage, refresh]);

  const handleApprove = (requestId) => {
    dispatch(setLoader(true));

    try {
      dispatch(
        ApproveAdminBloodRequest(requestId, (res) => {
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
        CancelBloodRequest(requestId, dataToSend, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            closeModal();
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
    <div className="cards-container my-5 mx-5">
      <div className="row">
        {requests?.length === 0 ? (
          <h4 className="text-center mb-5">No Data Available</h4>
        ) : (
          requests?.map((request) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12 mb-4"
              key={request.request_id}
            >
              <div className="card h-100 p-3">
                {request.is_critical && (
                  <div className="emergency-tag position-absolute">
                    Emergency
                  </div>
                )}
                <div className="d-flex mt-3">
                  <img
                    src={request?.profile_picture || profImg}
                    alt="Profile"
                    className="profile_img"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                      e.target.src = profImg; // Set to default image on error
                    }}
                  />
                  <div className="request-details">
                    <div className="text-start">
                      <p className="card-text ">Name: {request.patient_name}</p>
                      <p className="card-text ">
                        Attender Name: {request.attender_name}
                      </p>
                      <p className="card-text ">
                        Attender Mobile: {request.attender_mobile_number}
                      </p>
                      <p className="card-text ">
                        Willing to arrange transport:{" "}
                        {request?.willing_to_arrange_transport == true
                          ? "Yes"
                          : "No"}
                      </p>

                      <p className="card-text ">
                        Date: {formatDate(request.date)}
                      </p>
                      <p className="card-text ">
                        Units Required: {request.units_required}
                      </p>
                      <p className="card-text ">Address: {request.address}</p>
                    </div>
                  </div>
                  {/* <div className="blood-group">
                  <img src={bloodGroupImg} alt="Blood Group" />
                </div> */}
                </div>

                <div className="d-flex  mt-2 gap-3 ">
                  <button
                    className="btn btn-danger"
                    onClick={() => openModal(request.request_id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(request.request_id)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <Pagination
          align="center"
          className="mb-4"
          current={currentPage}
          total={totalRequests}
          pageSize={perPage}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gratitude Message"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="d-flex flex-column align-items-center">
          <h3>Cancel Blood Request</h3>
          <label className="text-start col-lg-6 col-md-6 col-sm-6">
            Closure reason
          </label>
          <input
            className="form-input col-lg-6 col-md-6 col-sm-6 mb-3"
            value={closureReason}
            onChange={(e) => setClosureReason(e.target.value)}
          />
          <label className="text-start col-lg-6 col-md-6 col-sm-6">
            Additional comments
          </label>
          <input
            className="form-input col-lg-6 col-md-6 col-sm-6 mb-3"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
          <div className="d-flex justify-content-evenly col-lg-6 col-md-6 col-sm-6">
            <button onClick={closeModal} className="btn btn-primary">
              Close
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
