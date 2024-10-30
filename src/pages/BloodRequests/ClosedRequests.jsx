import "../../css/BloodrequestDetailPage.css";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import bloodGroupImg from "../../assets/bloodimage.png";
import { formatDate } from "../../utils/dateUtils";


export default function ClosedRequests() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const { request } = location.state || {}; // Retrieve the passed request object
 
  if (!request) {
    return <p>No data found!</p>;
  }

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="mb-5 mt-5">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5">
          <div className="request-card" key={request.id}>
            <div className="request-header d-flex align-items-center">
              <div className="align-content-center">
                <img src={request.profilePic} alt="Profile" />
              </div>
              <div className="request-details ms-3">
               
                <div className="text-start">Date:{formatDate(request.date)}</div>
                <div className="text-start">Units: {request.units}</div>
                <div className="text-start">Address: {request.address}</div>
              </div>
              <div className="blood-group ms-auto">
                <img src={bloodGroupImg} alt="Blood Group" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-3">
          {/* <div>Reason For Closing The Request</div> */}
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Reason For Closing The Request</label>
              <select
                className="form-input"
                {...register("reason", { required: true })}
              >
                <option value="">Select</option>
                <option value="Request fulfilled">Request fulfilled</option>
                <option value="Request cancelled">Request cancelled</option>
                <option value="Found On alternative solution">
                  Found On alternative solution
                </option>
                <option value="Others">Others</option>
              </select>
              {errors.reason && (
                <p className="error-message">Reason is required</p>
              )}
            </div>

            <div className="form-group">
              <label>Additional Comments</label>
              <textarea className="form-input" {...register("additional")} />
            </div>
          </form>
        </div>

        <div className="col-lg-5 col-md-8 col-sm-10 mx-auto mt-5 d-flex">
          <button
            className="btn  flex-fill me-2 fw-bold"
            style={{ padding: "20px", background: "#D9D9D9", color: "black" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-fill ms-2 fw-bold"
            style={{ padding: "20px" }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
