// import { Steps } from "antd";
import "../../css/BloodrequestDetailPage.css";
import { useParams } from "react-router";
// import bloodGroupImg from "../../assets/bloodgroup.png";
import profPicImg from "../../assets/prof_img.png";
import { formatDate } from "../../utils/dateUtils";

import MapComponent from "../../components/map/MapComponent";
// import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoader, ViewBloodRequestUser } from "../../redux/product";
import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

export default function ViewrequestDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const decodedRequest = decodeURIComponent(atob(id)); // Decode the request

  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequestUser(decodedRequest, (res) => {
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

  if (!data.request_id) {
    return <h4 className="mt-4 mb-4">No data found!</h4>;
  }

  return (
    <>
      <div
        className="mb-5 mt-5 d-flex res_mobile mx-5"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          className="col-lg-7 col-md-8 col-sm-10 d-flex flex-column"
          style={{ flex: "0 0 60%" }}
        >
          <div className="col-lg-10 col-md-10 col-sm-10">
            <div
              className="request-card"
              key={data.request_id}
              style={{ position: "relative" }}
            >
              <div className="request-header d-flex align-items-center">
                <div className="align-content-center">
                  <img
                    className="prof_img"
                    src={data?.profile_picture || profPicImg}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = profPicImg;
                    }}
                  />
                </div>
                <div className="request-details ms-3">
                  <div className="text-start">{data.name}</div>
                  <div className="text-start">
                    Date: {formatDate(data.date)}
                  </div>
                  <div className="text-start">Units: {data.units_required}</div>
                  <div className="text-start">Address: {data.address}</div>
                </div>
                <div className="blood-group">
                  <h3 className="blood-group" style={{ color: "red" }}>
                    {data.blood_group || "Unknown"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {/* <p className="text-center mt-5">
            Visit{" "}
            <Link to="https://app.happydonors.ngo/login">Happy Donors</Link> for
            more details.
          </p> */}
          <p className="text-center mt-5">
            Visit
            <a
              href="https://app.happydonors.ngo/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              Happy Donors
            </a>
            for more details.
          </p>
        </div>
        <div
          className="flex-shrink-0"
          style={{ flex: "0 0 40%", paddingRight: "20px" }}
        >
          <MapComponent
            path={[{ lat: parseFloat(data.lat), lng: parseFloat(data.lon) }]}
          />
        </div>
      </div>
    </>
  );
}
