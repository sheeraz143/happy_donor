import { useEffect, useState } from "react";
import {
  DeletePendingApprovals,
  // CancelBloodRequest,
  PendingApprovals,
  PendingApprovalsAccept,
  PendingApprovalsView,
  setLoader,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";
import Modal from "react-modal";
import profImg from "../../assets/prof_img.png";

export default function ChangeRequests() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [closureReason, setClosureReason] = useState("");
  // const [additionalComments, setAdditionalComments] = useState("");
  const [requestId, setRequestId] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [updatedContent, setUpdatedContent] = useState([]); // To store the updated fields

  const openModal = (request_id) => {
    setModalIsOpen(true);
    setRequestId(request_id);
    viewRequests(request_id);
  };

  const viewRequests = async (request_id) => {
    dispatch(setLoader(true));
    try {
      dispatch(
        PendingApprovalsView(request_id, (res) => {
          dispatch(setLoader(false));
          if (res.errors) {
            toast.error(res.errors);
          } else {
            const changes = res?.changes || {};
            const updated = Object.entries(changes)
              .filter(([, value]) => value.updated) // Keep only fields with "updated" content
              .map(([field, value]) => ({
                field: formatFieldLabel(field), // Format field labels
                updated: value.updated,
              }));
            setUpdatedContent(updated);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  };

  // Helper function to format field labels
  const formatFieldLabel = (field) => {
    const fieldMap = {
      aadhar_id: "Aadhar",
      email: "Email",
      blood_group: "Blood Group",
      date_of_birth: "Date of Birth",
      gender: "Gender",
      address: "Address",
      location: "Location",
      lon: "Longitude",
      lat: "Latitude",
      last_blood_donation_date: "Last Blood Donation Date",
    };
    return (
      fieldMap[field] ||
      field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // setClosureReason("");
    // setAdditionalComments("");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setLoader(true));
      // const type = "all/admin";
      try {
        dispatch(
          PendingApprovals(
            // type,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                setRequests(res?.users);
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
        PendingApprovalsAccept(requestId, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            setRefresh(!refresh);
            closeModal();
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
  const handleDelete = (requestId) => {
    dispatch(setLoader(true));

    try {
      dispatch(
        DeletePendingApprovals(requestId, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            setRefresh(!refresh);
            closeModal();
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

  // const handleSubmit = () => {
  //   if (!closureReason.trim()) {
  //     toast.error("Closure reason is required");
  //     return;
  //   }
  //   if (!additionalComments.trim()) {
  //     toast.error("Additional comments are required");
  //     return;
  //   }
  //   const dataToSend = {
  //     closure_reason: closureReason,
  //     additional_comments: additionalComments,
  //   };
  //   dispatch(setLoader(true));
  //   try {
  //     dispatch(
  //       CancelBloodRequest(requestId, dataToSend, (res) => {
  //         if (res.code === 200) {
  //           toast.success(res.message);
  //           closeModal();
  //           setRefresh(!refresh);
  //         } else {
  //           toast.error(res.message);
  //         }
  //         dispatch(setLoader(false));
  //       })
  //     );
  //   } catch (error) {
  //     toast.error(error.message || "An unexpected error occurred.");
  //     dispatch(setLoader(false));
  //   }
  // };

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
                      <p className="card-text ">Name: {request.name}</p>
                      <p className="card-text ">Email: {request.email}</p>
                      <p className="card-text ">
                        Phone Number: {request.phone}
                      </p>
                      <p className="card-text ">
                        Blood Group: {request.blood_group}
                      </p>
                      <p className="card-text ">
                        Created On: {request.created_on}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex  mt-2 gap-3 ">
                  <button
                    className="btn btn-primary"
                    onClick={() => openModal(request.id)}
                  >
                    Show
                  </button>
                </div>
                {/* <div className="d-flex  mt-2 gap-3 ">
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
                </div> */}
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
        contentLabel="User Profile"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header">
          <h5>User Profile</h5>
          {/* <button className="close-btn" onClick={closeModal}>
            &times;
          </button> */}
        </div>
        <div className="modal-body">
          <div className="changes-list">
            {updatedContent.length > 0 ? (
              updatedContent.map((update, index) => (
                <div key={index} className="update-item">
                  <strong>{update.field}:</strong> {update.updated}
                </div>
              ))
            ) : (
              <p>No updates available.</p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            //  onClick={closeModal}
            onClick={() => handleDelete(requestId)}
            className="btn btn-danger"
          >
            Reject
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleApprove(requestId)}
          >
            Approve this User
          </button>
        </div>
      </Modal>
    </div>
  );
}
