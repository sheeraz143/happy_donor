import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bloodGroupImage from "../../assets/bloodimage.png";
// import profilePic from "../../assets/profpic.png";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DonateHistory, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { Pagination } from "antd";

function DonationHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRequests, setOpenRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;

  // const openRequests = [
  //   {
  //     id: 12345,
  //     name: "sheeraz",
  //     date: "2024-07-16",
  //     profilePic: profPicImg,
  //     bloodGroupImage: bloodGroupImg,
  //     requestType: "gratitude",
  //   },
  //   {
  //     id: 45645,
  //     date: "2024-07-16",
  //     name: "virat",
  //     profilePic: profPicImg,
  //     bloodGroupImage: bloodGroupImg,
  //     requestType: "report",
  //   },
  //   {
  //     id: 34512,
  //     date: "2024-07-16",
  //     name: "shariq",
  //     profilePic: profPicImg,
  //     bloodGroupImage: bloodGroupImg,
  //     requestType: "gratitude",
  //   },
  // ];

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        DonateHistory((res) => {
          if (res.code === 200) {
            console.log(res.requests);
            setOpenRequests(res.requests);
            setTotalRequests(res.pagination.total);
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

  const handleButtonClick = (request) => {
    if (request?.requestType === "gratitude") {
      navigate("/gratitude", { state: { request } });
    } else {
      navigate("/report", { state: { request } });
    }
  };

  const renderRequestCard = (request) => (
    <div className="request-card" key={request.request_id}>
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
          <div className="request-id text-start">
            Request ID: {request?.request_id}
          </div>
          <div className="request-date text-start">
            Patient Name: {request?.patient_name}
          </div>
          <div className="request-date text-start">Date: {request?.date}</div>
        </div>
        <div className="blood-group ms-auto">
          <img src={bloodGroupImage} alt="Blood Group" />
        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3 justify-content-end">
        <button
          className="accepted-donors-btn btn btn-primary"
          onClick={() => handleButtonClick(request)}
        >
          {request.requestType === "gratitude"
            ? "View Gratitude Message"
            : "TTI Report"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <h2>Donation History</h2>
      <div className="blood-request-container">
        <div className="requests mt-5">
          {openRequests.map(renderRequestCard)}
        </div>
      </div>
      <div>
        {openRequests.length === 0 && (
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
    </div>
  );
}

export default DonationHistory;
