import { useLocation, useNavigate, useParams } from "react-router";
import { MarkCampDonated, setLoader, ViewSinglecamp } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
// import { ViewCampsRequest } from "../redux/product";

export default function ConfirmCampDonation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});

  const location = useLocation();

  const donorId = location?.state?.donor?.donor_id || {};

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewSinglecamp(id, (res) => {
          if (res.code === 200) {
            setData(res);
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
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
      camp_id: data?.camp_id,
      donor_id: donorId,
      // units_donated: "1",
    };

    try {
      dispatch(
        MarkCampDonated(dataToSend, (res) => {
          if (res.code === 200) {
            toast.success(res.message);
            navigate(`/camplist/${id}`);
          } else {
            toast.error(res.message);
            navigate(`/camplist/${id}`);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "Error marking as donated");
      dispatch(setLoader(false));
    }
  };
  return (
    <div className="d-flex flex-column">
      <h2 className="text-center">Confirm Donation</h2>
      <div
        className="card col-lg-8 col-md-8  col-sm-8 mx-auto align-items-start mt-5 mb-5 gap-3"
        style={{ color: "#097E14" }}
      >
        <div className="">Title: {data?.title}</div>
        <div>Time:{data?.time}</div>
        {/* <div>Quantity Needed: {data?.units_required}</div> */}
        <div>{data?.date}</div>
        <div> {data?.location}</div>
        {/* <div>Quantity Donated: {data?.units_required}</div> */}
      </div>
      <h5 style={{ color: "blue" }} className="text-center">
        Please confirm that the donation for this request has been fulfilled
      </h5>

      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5 mb-5 d-flex">
        <button
          className="btn  flex-fill me-2 fw-bold"
          style={{ padding: "10px", background: "#D9D9D9", color: "gray" }}
          onClick={() => {
            navigate(`/camplist/${id}`);
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary flex-fill ms-2 fw-bold"
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
