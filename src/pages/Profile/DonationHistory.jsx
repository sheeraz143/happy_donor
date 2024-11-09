import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import bloodGroupImage from "../../assets/bloodimage.png";
// import profilePic from "../../assets/profpic.png";
// import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DonateHistory, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { formatDate } from "../../utils/dateUtils";
import Modal from "react-modal";

function DonationHistory() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRequests, setOpenRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const openModal = (donor) => {
    console.log("donor: ", donor);
    setSelectedDonor(donor);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDonor(null);
  };

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        DonateHistory((res) => {
          if (res.code === 200) {
            // console.log(res?.requests);
            setOpenRequests(res?.donors);
            setTotalRequests(res?.pagination?.total);
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
  }, [dispatch]);

  // const handleButtonClick = (request) => {
  //   if (request?.requestType === "gratitude") {
  //     navigate("/gratitude", { state: { request } });
  //   } else {
  //     navigate("/report", { state: { request } });
  //   }
  // };

  const renderRequestCard = (request) => (
    <div className="request-card" key={request?.request_id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture}
            alt="Profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
        <div className="request-details ms-3">
          {/* Bootstrap's `ms-3` adds left margin */}

          <div className="request-date text-start">
            {request?.patient_name ?? request?.donor_name}
          </div>
          <div className="request-date text-start">
            {formatDate(request?.date)}
          </div>
          <div className="request-date text-start">{request?.location}</div>
          <div className="request-date text-start" style={{ color: "blue" }}>
            {request?.donation_status ??
              `Contributed amount: ${request?.contributed_amount ?? 0}`}
          </div>
        </div>
        <div className="blood-group ms-auto">
          {/* <img src={bloodGroupImage} alt="Blood Group" /> */}
          <h3 className="blood-group" style={{color:"red"}}>{request.blood_group || ''}</h3> {/* Show blood group text */}

        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3 justify-content-end">
        {/* <button
          className="accepted-donors-btn btn btn-primary"
          onClick={() => handleButtonClick(request)}
        >
          {request.requestType === "gratitude"
            ? "View Gratitude Message"
            : "TTI Report"}
        </button> */}
        <div className="accept-donar-button d-flex justify-content-end gap-3 mt-2">
          {(request.donation_status === "Completed" ||
            request.donation_status === "Donated" ||
            request.status === "completed") && (
            <>
              <button className="accepted-donors-btn btn-secondary" disabled>
                Donated
              </button>

              {request?.type == "BloodRequestDonor" &&
                request?.gratitude_msg !== "" && (
                  <button
                    className="accepted-donors-btn"
                    onClick={() => openModal(request)}
                  >
                    View Gratitude Message
                  </button>
                )}
              {request?.type == "CampDonor" &&
                request?.gratitude_msg !== "" && (
                  <button
                    className="accepted-donors-btn"
                    onClick={() => openModal(request)}
                  >
                    View TTI Report
                  </button>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <h2 className="text-center">Donation History</h2>
      <div className="blood-request-container">
        <div className="requests mt-5">
          {openRequests?.map(renderRequestCard)}
        </div>
      </div>
      <div>
        {openRequests?.length === 0 && (
          <h4 className="mx-auto mb-5">No Data available.</h4>
        )}
      </div>
      <div>
        <Pagination
          align="center"
          className="mb-4 mt-5"
          current={currentPage}
          total={totalRequests}
          pageSize={perPage}
          onChange={(page) => {
            setCurrentPage(page);
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
        {selectedDonor && (
          <div className="d-flex flex-column align-items-center ">
            <h2>
              {selectedDonor?.type == "BloodRequestDonor"
                ? "Gratitude Message"
                : "TTI Report"}
            </h2>
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

            {selectedDonor.media.endsWith("pdf") && (
              <div className="pdf-container">
                <p>{selectedDonor.message}</p>
                <iframe
                  src={selectedDonor.media}
                  title="PDF Preview"
                  className="pdf-preview rounded mb-4"
                ></iframe>
              </div>
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
    </div>
  );
}

export default DonationHistory;
