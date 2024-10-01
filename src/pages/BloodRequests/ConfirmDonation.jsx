import { useNavigate } from "react-router";

export default function ConfirmDonation() {
  const navigate = useNavigate();

  return (
    <div className="">
      <h2>Confirm Donation</h2>
      <div
        className="card col-lg-8 col-md-8  col-sm-8 mx-auto align-items-start mt-5 mb-5 gap-3"
        style={{ color: "#097E14" }}
      >
        <div className="">Name:</div>
        <div>Request ID:</div>
        <div>Blood Type:</div>
        <div>Quantity Needed:</div>
        <div>Location:</div>
        <div>Donation Date:</div>
        <div>Quantity Donated:</div>
      </div>
      <h5 style={{ color: "blue" }}>
        Please confirm that the donation for this request has been fulfilled
      </h5>

      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5 mb-5 d-flex">
        <button
          className="btn  flex-fill me-2 fw-bold"
          style={{ padding: "10px", background: "#D9D9D9", color: "gray" }}
          onClick={() => {
            navigate("/donarlist");
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary flex-fill ms-2 fw-bold"
          // style={{ padding: "20px" }}
          onClick={() => navigate("/donarlist")}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
