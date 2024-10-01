import { Steps } from "antd";
import "../../css/BloodrequestDetailPage.css";
import { useLocation, useNavigate } from "react-router";

import bloodGroupImg from "../../assets/bloodimage.png";
import MapComponent from "../../components/map/MapComponent";
import { Link } from "react-router-dom";

export default function BloodrequestDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { request } = location.state || {}; // Retrieve the passed request object
  console.log("data: ", request);

  if (!request) {
    return <p>No data found!</p>;
  }

  return (
    <>
      <div className="mb-5 mt-5">
        <MapComponent path={request.path} />

        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5">
          <div className="request-card" key={request.id}>
            <div className="request-header d-flex align-items-center">
              <div className="align-content-center">
                <img src={request.profilePic} alt="Profile" />
              </div>
              <div className="request-details ms-3">
                <div className="text-start">Request ID: {request.id}</div>
                <div className="text-start">Date:{request.date}</div>
                <div className="text-start">Units: {request.units}</div>
                <div className="text-start">Address: {request.address}</div>
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
            current={1}
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
                title: "In-progress state",
                description: "",
              },
              {
                title: "Completed state",
                description: "",
              },
            ]}
          />
          <div
            className="d-flex  form-control "
            style={{
              background: "#D9D9D9",
              padding: " 15px",
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
            className="btn  flex-fill me-2 fw-bold"
            style={{ padding: "20px", background: "#D9D9D9", color: "black" }}
            onClick={() => navigate("/bloodrequest")}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-fill ms-2 fw-bold"
            style={{ padding: "20px" }}
          >
            Accept Donors
          </button>
        </div>
      </div>
    </>
  );
}
