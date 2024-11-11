import { Steps } from "antd";
import "../css/BloodrequestDetailPage.css";
import { useNavigate, useParams } from "react-router";
// import bloodGroupImg from "../assets/bloodgroup.png";
import profPicImg from "../assets/prof_img.png";
// import { formatDate } from "../utils/dateUtils";

import MapComponent from "../components/map/MapComponent";
// import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CancelCamp, setLoader, ViewSinglecamp } from "../redux/product";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

export default function CampsrequestDetailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [closureReason, setClosureReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewSinglecamp(id, (res) => {
          console.log("res: ", res);
          if (res.code == 200) {
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
  }, [dispatch, id]);

  const statusToStep = {
    Initiated: 0,
    Active: 1,
    "In Progress": 2,
    Completed: 3,
  };

  const currentStep = statusToStep[data?.status] || 0;

  if (!data.camp_id) {
    return <h4 className="mt-4 mb-4 text-center">No data found!</h4>;
  }

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
        CancelCamp(data.camp_id, dataToSend, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            closeModal();
            navigate("/camps/list");
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
    <>
      <div
        className="mb-5 mt-5 d-flex res_mobile mx-5"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          className="flex-shrink-0"
          style={{ flex: "0 0 40%", paddingRight: "20px" }}
        >
          <MapComponent
            path={[
              {
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude),
              },
            ]}
          />
        </div>
        <div
          className="col-lg-7 col-md-8 col-sm-10 d-flex flex-column"
          style={{ flex: "0 0 60%" }}
        >
          <div className="col-lg-10 col-md-10 col-sm-10">
            <div
              className="request-card"
              key={data.camp_id}
              style={{ position: "relative" }}
            >
              {/* Close Icon in the top-right corner */}
              <button
                className="close-button"
                onClick={(event) => openModal(data, event)}
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
              <div className="request-header d-flex align-items-center">
                <div className="align-content-center">
                  <img
                    className="prof_img"
                    src={data?.camp_image}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                      e.target.src = profPicImg; // Set to default image on error
                    }}
                  />
                </div>
                <div className="request-details ms-3">
                  <div className="text-start">Title: {data?.title}</div>
                  <div className="text-start">{data?.date}</div>
                  <div className="text-start">Time: {data?.time}</div>
                  <div className="text-start">Address: {data?.location}</div>
                </div>
                <div className="blood-group ms-auto">
                  {/* <img
                    src={bloodGroupImg}
                    alt="Blood Group"
                    onClick={openModal}
                    className="cursor-pointer"
                  /> */}
                  <h3 className="blood-group" style={{ color: "red" }}>
                    {data.blood_group || ""}
                  </h3>
                </div>
              </div>
              {data?.view_donors && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-primary"
                    style={{ padding: "10px" }}
                    onClick={() => navigate(`/camplist/${id}`)}
                  >
                    Accepted Donors
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-10 col-md-10 col-sm-10 mt-2">
            <Steps
              progressDot
              current={currentStep}
              direction="vertical"
              // style={{ display: "flex", alignItems: "center" }}
              items={[
                { title: "Initiated", description: "" },
                { title: "Active", description: "" },
                { title: "In Progress", description: "" },
                { title: "Completed", description: "" },
              ]}
            />
          </div>
        </div>
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
          <h3 className="cancel_blood_req ">Cancel Blood Request</h3>
          <label className="text-start w-100">Closure reason</label>
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
}
