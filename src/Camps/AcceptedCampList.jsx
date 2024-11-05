import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AcceptedCamps, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "../css/BloodRequest.css";
import bloodGroupImg from "../assets/bloodimage.png";
import profPicImg from "../assets/prof_img.png";
import { formatDate } from "../utils/dateUtils";

const AcceptedCampList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [donors, setDonors] = useState([]);
  const [requestId, setRequestId] = useState({});
  // const [donationStatus, setDonationStatus] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        AcceptedCamps(id, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setDonors(res.accepted_donors || []);
            setRequestId(res.camp_id);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, id]);

  const markAsDonated = (donor) => {
    navigate(`/confirmcamp/${id}`, { state: { donor } });
  };

  const openModal = (donor) => {
    setSelectedDonor(donor);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDonor(null);
  };

  const navigateToGratitude = (requestId, donorId) => {
    navigate(`/gratitudecampmesage?requestId=${requestId}&donorId=${donorId}`);
  };

  const renderRequestCard = (donor) => {
    return (
      <div className="request-card" key={donor.donor_id}>
        <div className="request-header">
          <div className="align-content-center">
            <img
              src={donor.camp_image || profPicImg}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                e.target.src = profPicImg; // Set to default image on error
              }}
            />
          </div>
          <div className="request-details">
            <div className="request-date text-start">{donor?.donor_name}</div>
            <div className="request-units text-start">
              {formatDate(donor?.date)}
            </div>
            <div className="request-date text-start">{donor?.location}</div>
            <div
              className="request-date text-start"
              style={{ color: "#0750b1" }}
            >
              {donor?.status}
            </div>
          </div>
          <div className="blood-group">
            <img src={bloodGroupImg} alt="Blood Group" />
          </div>
        </div>

        <div className="accept-donar-button d-flex justify-content-end gap-3 mt-2">
          {donor.status == "Approved" && (
            <button
              className="accepted-donors-btn"
              onClick={() => markAsDonated(donor, donor.camp_id)}
            >
              Mark As Donated
            </button>
          )}
          {(donor.donation_status === "Completed" ||
            donor.donation_status === "Donated") && (
            <>
              <button className="accepted-donors-btn btn-secondary" disabled>
                Donated
              </button>
              {donor.gratitude_msg !== "" ? (
                <button
                  className="accepted-donors-btn"
                  onClick={() => openModal(donor)}
                >
                  View Gratitude Message
                </button>
              ) : (
                <button
                  className="accepted-donors-btn"
                  onClick={() => navigateToGratitude(requestId, donor.camp_id)}
                >
                  Post Gratitude Message
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="mt-3 text-center">Accepted Donors</h3>
      <div className="blood-request-container">
        <div className="requests mb-5 mt-5">
          {donors.length > 0 ? (
            donors.map(renderRequestCard)
          ) : (
            <h4>No accepted donors available.</h4>
          )}
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
        {selectedDonor && (
          <div className="d-flex flex-column align-items-center ">
            <h2>Gratitude Message</h2>
            <p>{selectedDonor.gratitude_msg}</p>

            {selectedDonor.media_type === "video" && (
              <video width="320" height="240" controls className="mb-4">
                <source src={selectedDonor.media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {selectedDonor.media_type === "image" && (
              <img
                src={selectedDonor.media}
                alt="Gratitude"
                className="img-fluid rounded mb-4"
                style={{ maxWidth: "100%", height: "150px" }}
              />
            )}

            {selectedDonor.media_type === "audio" && (
              <audio controls className="mb-4">
                <source src={selectedDonor.media} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <button onClick={closeModal} className="btn btn-primary">
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AcceptedCampList;
