import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DonateHistory, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { formatDate } from "../../utils/dateUtils";
import Modal from "react-modal";
import profPicImg from "../../assets/prof_img.png";

const ITEMS_PER_PAGE = 10; // Number of items per page

function DonationHistory() {
  const dispatch = useDispatch();
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const openModal = (donor) => {
    setSelectedDonor(donor);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDonor(null);
  };

  // Fetch donation history data based on the current page
  const fetchDonationHistory = (page = 1) => {
    dispatch(setLoader(true));
    try {
      dispatch(
        DonateHistory(page, (res) => {
          // Provide page directly
          if (res.code === 200 && res.donors && res.donors.length > 0) {
            setDonors(res.donors);
            setTotalRequests(res.pagination.total);
          } else {
            setDonors([]);
            toast.error(res.message || "No data found.");
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      setDonors([]);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    fetchDonationHistory(currentPage); // Fetch data for the current page
  }, [currentPage]); // Re-run on page change

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderRequestCard = (request) => (
    <div className="request-card" key={request?.request_id || request?.camp_id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img
            src={request?.profile_picture || profPicImg}
            alt="Profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = profPicImg;
            }}
          />
        </div>
        <div className="request-details ms-3">
          <div className="request-date text-start">
            {request?.patient_name ?? request?.donor_name}
          </div>
          <div className="request-date text-start">
            Donated on: {formatDate(request?.donated_date)}
          </div>
          <div className="request-date text-start">
            Status: {request?.status}
          </div>
          <div className="request-date text-start">{request?.location}</div>
          <div className="request-date text-start" style={{ color: "blue" }}>
            {request?.donation_status ??
              `Contributed amount: ${request?.contributed_amount ?? 0}`}
          </div>
        </div>
        <div className="blood-group ms-auto">
          <h3 className="blood-group" style={{ color: "red" }}>
            {request.blood_group || ""}
          </h3>
        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3 justify-content-end">
        <div className="accept-donar-button d-flex justify-content-end gap-3 mt-2">
          {(request.donation_status === "Completed" ||
            request.donation_status === "Donated" ||
            request.status === "completed") && (
            <>
              <button className="accepted-donors-btn btn-secondary" disabled>
                Donated
              </button>

              {request?.type === "BloodRequestDonor" &&
                request?.gratitude_msg && (
                  <button
                    className="accepted-donors-btn"
                    onClick={() => openModal(request)}
                  >
                    View Gratitude Message
                  </button>
                )}
              {request?.type === "CampDonor" && request?.gratitude_msg && (
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
        <div className="requests mt-5 mb-5">
          {donors.length > 0 ? (
            donors.map(renderRequestCard)
          ) : (
            <h4 className="mx-auto mb-5 text-center">No Data available.</h4>
          )}
        </div>
      </div>
      <Pagination
        align="center"
        className="mb-4"
        current={currentPage}
        total={totalRequests}
        pageSize={ITEMS_PER_PAGE}
        onChange={handlePageChange}
      />
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
              {selectedDonor?.type === "BloodRequestDonor"
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
