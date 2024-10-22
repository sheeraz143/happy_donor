import { Steps } from "antd";
import "../../css/BloodrequestDetailPage.css";
import { useNavigate, useParams } from "react-router";
import bloodGroupImg from "../../assets/bloodimage.png";
import MapComponent from "../../components/map/MapComponent";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CancelBloodRequest,
  setLoader,
  ViewBloodRequest,
} from "../../redux/product";
import { toast } from "react-toastify";
import Modal from "react-modal";

export default function BloodrequestDetailPage() {
  const navigate = useNavigate();
  // const location = useLocation();
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
        ViewBloodRequest(id, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setData(res);
          }
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

  const currentStep = statusToStep[data.status] || 0;

  if (!data.request_id) {
    return <p>No data found!</p>;
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
    // return;
    dispatch(setLoader(true));

    try {
      dispatch(
        CancelBloodRequest(data.request_id, dataToSend, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            closeModal();
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
  return (
    <>
      <div className="mb-5 mt-5">
        <MapComponent
          path={[{ lat: parseFloat(data.lat), lng: parseFloat(data.lon) }]}
        />
        <div className="d-flex flex-column">
          <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5">
            <div className="request-card" key={data.request_id}>
              <div className="request-header d-flex align-items-center">
                <div className="align-content-center">
                  <img
                    src={data.profile_picture}
                    alt="Profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="request-details ms-3">
                  <div
                    className="text-start"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    Request ID: {data.request_id}
                  </div>
                  <div className="text-start">Date: {data.date}</div>
                  <div className="text-start">Units: {data.units_required}</div>
                  <div className="text-start">Address: {data.address}</div>
                </div>
                <div className="blood-group ms-auto">
                  <img src={bloodGroupImg} alt="Blood Group" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-8 col-sm-10 mx-auto mt-3">
            <Steps
              progressDot
              current={currentStep}
              direction="vertical"
              items={[
                {
                  title: "Initiated",
                  description: "",
                },
                {
                  title: "Active",
                  description: "",
                },
                {
                  title: "In Progress",
                  description: "",
                },
                {
                  title: "Completed",
                  description: "",
                },
              ]}
            />
            <div
              className="d-flex form-control"
              style={{
                background: "#D9D9D9",
                padding: "25px",
                borderRadius: "10px",
              }}
            >
              <input
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "#D9D9D9",
                  color: "black",
                }}
                placeholder="Enter Your Queries"
                className=""
              />
              <Link to="#" style={{ textDecoration: "none" }}>
                Submit
              </Link>
            </div>
          </div>
          <div className="col-lg-5 col-md-8 col-sm-10 mx-auto mt-5 d-flex">
            <button
              className="btn flex-fill me-2 fw-bold"
              style={{ padding: "15px", background: "#D9D9D9", color: "black" }}
              onClick={() => openModal()}
            >
              Cancel
            </button>
            {data.view_donors && (
              <button
                className="btn btn-primary flex-fill ms-2 fw-bold"
                style={{ padding: "15px" }}
                onClick={() => navigate(`/donarlist/${id}`)}
              >
                Accepted Donors
              </button>
            )}
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
        <div className="d-flex flex-column align-items-center ">
          <h2>Cancel Blood Request</h2>
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
    </>
  );
}
