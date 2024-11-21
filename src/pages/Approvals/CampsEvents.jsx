import { useEffect, useState } from "react";
import {
  AdminCampsList,
  CampApproved,
  CampReject,
  setLoader,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";
// import Modal from "react-modal";
import profImg from "../../assets/prof_img.png";

export default function CampsEvents() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [closureReason, setClosureReason] = useState("");
  // const [additionalComments, setAdditionalComments] = useState("");
  // const [requestId, setRequestId] = useState("");
  const [refresh, setRefresh] = useState(false);

  // const [updatedContent, setUpdatedContent] = useState([]); // To store the updated fields

  // const openModal = (request_id) => {
  //   // setModalIsOpen(true);
  //   // setRequestId(request_id);
  //   viewRequests(request_id);
  // };

  // const viewRequests = async (request_id) => {
  //   dispatch(setLoader(true));
  //   try {
  //     dispatch(
  //       PendingApprovalsView(request_id, (res) => {
  //         dispatch(setLoader(false));
  //         if (res.errors) {
  //           toast.error(res.errors);
  //         } else {
  //           const changes = res?.changes || {};
  //           const updated = Object.entries(changes)
  //             .filter(([, value]) => value.updated) // Keep only fields with "updated" content
  //             .map(([field, value]) => ({
  //               field: formatFieldLabel(field), // Format field labels
  //               updated: value.updated,
  //             }));
  //           setUpdatedContent(updated);
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     toast.error(error.message || "Error fetching requests");
  //     dispatch(setLoader(false));
  //   }
  // };

  // // Helper function to format field labels
  // const formatFieldLabel = (field) => {
  //   const fieldMap = {
  //     aadhar_id: "Aadhar",
  //     email: "Email",
  //     blood_group: "Blood Group",
  //     date_of_birth: "Date of Birth",
  //     gender: "Gender",
  //     address: "Address",
  //     location: "Location",
  //     lon: "Longitude",
  //     lat: "Latitude",
  //     last_blood_donation_date: "Last Blood Donation Date",
  //   };
  //   return (
  //     fieldMap[field] ||
  //     field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  //   );
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  //   // setClosureReason("");
  //   // setAdditionalComments("");
  // };

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setLoader(true));
      // const type = "all/admin";
      try {
        dispatch(
          AdminCampsList(
            // type,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                setRequests(res?.camps);
                console.log("res?.requests: ", res);
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

  const handleApprove = (campID) => {
    dispatch(setLoader(true));

    try {
      dispatch(
        CampApproved(campID, (res) => {
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
  const handleDelete = (requestId) => {
    const dataToSend = {
      closure_reason: "rejected",
      additional_comments: "",
    };
    dispatch(setLoader(true));

    try {
      dispatch(
        CampReject(dataToSend, requestId, (res) => {
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

  return (
    <div className="cards-container my-5 mx-5">
      <div className="row">
        {requests?.length === 0 ? (
          <h4 className="text-center mb-5">No Data Available</h4>
        ) : (
          requests?.map((request) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12 mb-4"
              key={request.camp_id}
            >
              <div className="card h-100 p-3">
                {request.is_critical && (
                  <div className="emergency-tag position-absolute">
                    Emergency
                  </div>
                )}
                <div className="d-flex mt-3">
                  <img
                    src={request?.camp_image || profImg}
                    alt="Profile"
                    className="profile_img"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                      e.target.src = profImg; // Set to default image on error
                    }}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "unset",
                    }}
                  />
                  <div className="request-details">
                    <div className="text-start">
                      <p className="card-text ">Title: {request.title}</p>
                      <p className="card-text ">Camp ID: {request.camp_id}</p>
                      <p className="card-text ">Date: {request.date}</p>
                      <p className="card-text ">Time: {request.time}</p>
                      <p className="card-text ">Lat: {request.latitude}</p>
                      <p className="card-text ">Lon: {request.longitude}</p>
                      <p className="card-text ">Status: {request.status}</p>
                      <p className="card-text ">Location: {request.location}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex  mt-2 gap-3 ">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(request.camp_id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(request.camp_id)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {/* {requests?.length === 0 ? (
          <h4 className="text-center mb-5">No Data Available</h4>
        ) : (
          requests?.map((request) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12 mb-4"
              key={request.camp_id}
            >
              <div className="card h-100 p-3">
                {request.is_critical && (
                  <div className="emergency-tag position-absolute">
                    Emergency
                  </div>
                )}
                <div className="d-flex align-items-start">
                  <div className="text-center me-3">
                    <img
                      src={request?.camp_image || profImg}
                      alt="Camp"
                      className="profile_img"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                        e.target.src = profImg; // Set to default image on error
                      }}
                    />
                    <h6 className="mt-3">{request.title}</h6>
                  </div>
                  <div className="request-details">
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Camp ID:</strong>
                      </div>
                      <div className="col-6">{request.camp_id}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Date:</strong>
                      </div>
                      <div className="col-6">{request.date}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Start Time:</strong>
                      </div>
                      <div className="col-6">{request.start_time}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>End Time:</strong>
                      </div>
                      <div className="col-6">{request.end_time}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Latitude:</strong>
                      </div>
                      <div className="col-6">{request.latitude}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Longitude:</strong>
                      </div>
                      <div className="col-6">{request.longitude}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Status:</strong>
                      </div>
                      <div className="col-6">{request.status}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-6 text-end">
                        <strong>Location:</strong>
                      </div>
                      <div className="col-6">{request.location}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-evenly mt-3">
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
        )} */}
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

      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Profile"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header">
          <h5>User Profile</h5>
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
      </Modal> */}
    </div>
  );
}
