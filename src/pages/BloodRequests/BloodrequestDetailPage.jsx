import { Steps } from "antd";
import "../../css/BloodrequestDetailPage.css";
import { useNavigate, useParams } from "react-router";

import bloodGroupImg from "../../assets/bloodimage.png";
import MapComponent from "../../components/map/MapComponent";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoader, ViewBloodRequest } from "../../redux/product";
import { toast } from "react-toastify";

export default function BloodrequestDetailPage() {
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequest(id, (res) => {
          console.log("res: ", res);
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
  }, [dispatch, id]);

  const statusToStep = {
    Initiated: 0,
    Active: 1,
    "In Process": 2,
    Completed: 3,
  };

  const currentStep = statusToStep[data.status] || 0;

  if (!data.request_id) {
    return <p>No data found!</p>;
  }

  return (
    <>
      <div className="mb-5 mt-5">
        <MapComponent path={[{ lat: data.lat, lon: data.lon }]} />

        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5">
          <div className="request-card" key={data.request_id}>
            <div className="request-header d-flex align-items-center">
              <div className="align-content-center">
                <img
                  src={data.profile_picture}
                  alt="Profile"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <div className="request-details ms-3">
                <div className="text-start">Request ID: {data.request_id}</div>
                <div className="text-start">Date: {data.date}</div>
                <div className="text-start">Units: {data.units_required}</div>
                <div className="text-start">Address: {data.address}</div>
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
            current={currentStep}
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
                title: "In Process",
                description: "",
              },
              {
                title: "Completed",
                description: "",
              },
            ]}
          />
          <div
            className="d-flex form-control"
            style={{
              background: "#D9D9D9",
              padding: "15px",
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
            className="btn flex-fill me-2 fw-bold"
            style={{ padding: "15px", background: "#D9D9D9", color: "black" }}
            onClick={() => navigate("/bloodrequest")}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-fill ms-2 fw-bold"
            style={{ padding: "15px" }}
            onClick={() => navigate(`/donarlist/${id}`)}
          >
            Accept Donors
          </button>
        </div>
      </div>
    </>
  );
}
