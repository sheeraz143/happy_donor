import { useLocation, useNavigate, useParams } from "react-router";
import { MarkDonated, setLoader, ViewBloodRequest } from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function ConfirmDonation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});

  const location = useLocation();

  const donorId = location?.state?.donor?.donor_id || {};

  // const location = useLocation();
  // const request = location.state.donor || {}; // Retrieve the passed request object

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequest(id, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setData(res);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, []);

  const confirmDonated = () => {
    dispatch(setLoader(true));

    const dataToSend = {
      request_id: data?.request_id,
      donor_id: donorId,
      units_donated: "1",
    };

    try {
      dispatch(
        // MarkDonated({ request_id: requestId, donor_id: donorId }, (res) => {
        MarkDonated(dataToSend, (res) => {
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else if (res.code === 400) {
            toast.error(res.message);
            navigate(`/donarlist/${id}`);
          } else if (res.code === 200) {
            toast.success(res.message);
            navigate(`/donarlist/${id}`);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error marking as donated");
      dispatch(setLoader(false));
    }
  };
  return (
    <div className="">
      <h2>Confirm Donation</h2>
      <div
        className="card col-lg-8 col-md-8  col-sm-8 mx-auto align-items-start mt-5 mb-5 gap-3"
        style={{ color: "#097E14" }}
      >
        <div className="">Name: {data?.name}</div>
        <div>Request ID:{data?.request_id}</div>
        <div>Blood Type:{data?.blood_group}</div>
        <div>Quantity Needed: {data?.units_required}</div>
        <div>Location: {data?.location}</div>
        <div>Donation Date:{data?.date}</div>
        <div>Quantity Donated: {data?.units_required}</div>
      </div>
      <h5 style={{ color: "blue" }}>
        Please confirm that the donation for this request has been fulfilled
      </h5>

      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5 mb-5 d-flex">
        <button
          className="btn  flex-fill me-2 fw-bold"
          style={{ padding: "10px", background: "#D9D9D9", color: "gray" }}
          onClick={() => {
            navigate(`/donarlist/${id}`);
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary flex-fill ms-2 fw-bold"
          // style={{ padding: "20px" }}
          onClick={() => {
            confirmDonated();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
