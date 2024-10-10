import { useNavigate } from "react-router";
import requestblood from "../../assets/requestblood.png";
import donateblood from "../../assets/donateblood.png";
import medicalcamps from "../../assets/medicalcamps.png";
import funddonation from "../../assets/funddonation.png";

export default function Approvals() {
  const navigate = useNavigate();

  return (
    <div className="cards-container mt-5 mb-5">
      <div
        className="card"
        onClick={() => {
          navigate("/approve-requests");
        }}
        style={{ cursor: "pointer" }}
      >
        <img src={requestblood} alt="Donate Blood" />
        <p>New Blood Requests</p>
      </div>
      <div className="card" style={{ cursor: "pointer" }}>
        <img src={donateblood} alt="Donate Blood" />
        <p>New Blood Donations</p>
      </div>
      <div className="card" style={{ cursor: "pointer" }}>
        <img src={medicalcamps} alt="Blood-Medical Camps/Events" />
        <p>New Blood Camps/Events</p>
      </div>
      <div className="card" style={{ cursor: "pointer" }}>
        <img src={funddonation} alt="Fund Donation" />
        <p>Change Requests</p>
      </div>
    </div>
  );
}
