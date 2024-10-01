import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bloodGroupImg from "../../assets/bloodimage.png";
import profPicImg from "../../assets/profpic.png";
import { useNavigate } from "react-router";

function DonationHistory() {
  const navigate = useNavigate();

  const openRequests = [
    {
      id: 12345,
      name: "sheeraz",
      date: "2024-07-16",
      profilePic: profPicImg,
      bloodGroupImage: bloodGroupImg,
      requestType: "gratitude",
    },
    {
      id: 45645,
      date: "2024-07-16",
      name: "virat",
      profilePic: profPicImg,
      bloodGroupImage: bloodGroupImg,
      requestType: "report",
    },
    {
      id: 34512,
      date: "2024-07-16",
      name: "shariq",
      profilePic: profPicImg,
      bloodGroupImage: bloodGroupImg,
      requestType: "gratitude",
    },
  ];

  const handleButtonClick = (request) => {
    if (request?.requestType === "gratitude") {
      navigate("/gratitude", { state: { request } });
    } else {
      navigate("/report", { state: { request } });
    }
  };

  const renderRequestCard = (request) => (
    <div className="request-card" key={request.id}>
      <div className="request-header d-flex align-items-center">
        <div className="align-content-center">
          <img src={request.profilePic} alt="Profile" />
        </div>
        <div className="request-details ms-3">
          {/* Bootstrap's `ms-3` adds left margin */}
          <div className="request-id text-start">Request ID: {request.id}</div>
          <div className="request-date text-start">
            Patient Name: {request.name}
          </div>
          <div className="request-date text-start">Date: {request.date}</div>
        </div>
        <div className="blood-group ms-auto">
          <img src={request.bloodGroupImage} alt="Blood Group" />
        </div>
      </div>

      <div className="accept-donar-button d-flex align-items-center mt-3 justify-content-end">
        <button
          className="accepted-donors-btn btn btn-primary"
          onClick={() => handleButtonClick(request)}
        >
          {request.requestType === "gratitude"
            ? "Gratitude Message"
            : "ITI Report"}
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
    </div>
  );
}

export default DonationHistory;
