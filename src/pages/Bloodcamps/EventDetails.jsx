import { Link } from "react-router-dom";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";

export default function EventDetails() {
  return (
    <div className="mt-4 mb-5">
      <h2 className="mb-3">Event Details</h2>
      <div className="col-lg-8 col-md-8 col-sm-8 shadow-sm p-3 mb-4 border rounded-3 mx-auto">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 text-start" style={{ color: "green" }}>
              Event Title :
            </h5>
            <p className="mb-0">Location: City Park</p>
          </div>
          <div className="d-flex align-items-center">
            <Link to="#" className="me-2">
              <img
                src={shareIcon}
                alt="Share"
                className="img-fluid"
                style={{ width: "24px", height: "24px" }}
              />
            </Link>
            <Link to="#">
              <img
                src={locationIcon}
                alt="Location"
                className="img-fluid"
                style={{ width: "24px", height: "24px" }}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-8 col-sm-8 mx-auto  mb-4 p-3" style={{ color: "blue" }}>
        <h6 className="mb-1 text-start">Description:</h6>
      </div>

      <div className="col-lg-8 col-md-8 col-sm-8 mx-auto d-flex justify-content-between">
        <button
          className="btn btn-success flex-fill me-2 fw-bold"
          style={{ padding: "20px", background: "green" }}
        >
          Participate
        </button>
        <button
          className="btn btn-primary flex-fill ms-2 fw-bold"
          style={{ padding: "20px" }}
        >
          Contribute
        </button>
      </div>
    </div>
  );
}
