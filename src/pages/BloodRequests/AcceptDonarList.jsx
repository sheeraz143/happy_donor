import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AcceptedDonors, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "../../css/BloodRequest.css";
import bloodGroupImg from "../../assets/bloodimage.png";
import profPicImg from "../../assets/prof_img.png";

const AcceptDonorList = () => {
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
        AcceptedDonors(id, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setDonors(res.donors || []);
            setRequestId(res.request_id);
            // const initialStatus = res.donors.reduce((acc, donor) => {
            //   acc[donor.donor_id] = donor.donation_status !== "Donated";
            //   return acc;
            // }, {});
            // // setDonationStatus(initialStatus);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, id]);

  const markAsDonated = (donor) => {
    navigate(`/confirmdonation/${id}`, { state: { donor } });
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
    navigate(`/postgratitudemesage?requestId=${requestId}&donorId=${donorId}`);
  };

  const renderRequestCard = (donor) => (
    <div className="request-card" key={donor.donor_id}>
      <div className="request-header">
        <div className="align-content-center">
          <img
            src={donor.profile_picture || profPicImg}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="request-details">
          <div className="request-id">Name: {donor.donor_name}</div>
          <div className="request-date">Patient Name: {donor.patient_name}</div>
          {/* <div className="request-address">Address: {donor.address}</div> */}
          <div className="request-units">Date: {donor.date}</div>
        </div>
        <div className="blood-group">
          <img src={bloodGroupImg} alt="Blood Group" />
        </div>
      </div>

      <div className="accept-donar-button justify-content-end gap-3">
        {donor.donation_status == "Donated" ? (
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
                onClick={() => navigateToGratitude(requestId, donor.donor_id)}
              >
                Post Gratitude Message
              </button>
            )}
          </>
        ) : (
          <button
            className="accepted-donors-btn"
            onClick={() => markAsDonated(donor, donor.donor_id)}
          >
            Mark As Donated
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3">Accepted Donors</h3>
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
            <button onClick={closeModal} className="btn btn-primary">
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AcceptDonorList;
