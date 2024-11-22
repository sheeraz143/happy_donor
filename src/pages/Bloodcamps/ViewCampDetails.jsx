import BloodCamps from "../../assets/BloodCamps.png";

import { Link, useParams } from "react-router-dom";
import MapComponent from "../../components/map/MapComponent";
// import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import { setLoader, ViewCampsRequest } from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function ViewCampDetails() {
  const campId = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewCampsRequest(campId?.id, (res) => {
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

  const renderRequestCard = (camp) => {
    return (
      <div className="request-card mb-4" key={camp.camp_id}>
        <div className="d-flex align-items-start">
          <div className="request-details ms-3">
            <h4 className="text-start fw-bold" style={{ color: "green" }}>
              {camp.title || "Camp"}
            </h4>
            <div className="text-start">Date: {camp.date}</div>
            <div className="text-start">
              Time: {camp.time || "Not specified"}
            </div>
            <div className="text-start">Location: {camp.location}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="mt-3 mb-4 text-center">Camp Details</h3>
      <div className="d-flex justify-content-center ms-auto mb-4">
        <img
          src={data?.camp_image || BloodCamps}
          alt="Camp"
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-8 mx-auto">
        <div className="mb-2">
          {data ? renderRequestCard(data) : <p>No camp details available.</p>}
        </div>
        <div className="mb-5">
          {/* <MapComponent latitude={data?.latitude} longitude={data?.longitude} /> */}
          <MapComponent
            path={[
              {
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude),
              },
            ]}
          />
        </div>
      </div>
      <p className="text-center mt-5">
        Visit <Link to="https://www.happydonors.ngo">Happy Donors</Link> for
        more details.
      </p>
    </>
  );
}
