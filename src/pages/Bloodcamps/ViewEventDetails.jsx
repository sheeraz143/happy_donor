import { Link, useParams } from "react-router-dom";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";
// import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import { setLoader, ViewEventRequest } from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function ViewEventDetails() {
  const eventId = useParams();
  console.log("eventId: ", eventId.id);
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewEventRequest(eventId?.id, (res) => {
          console.log("res: ", res);
          if (res.code === 200) {
            // setData(res?.events[0]);
            setData(res);
            console.log("res?.events[0]: ", res);
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

  return (
    <div className="mt-4 mb-5">
      <h2 className="mb-3 text-center">Event Details</h2>
      <div className="col-lg-8 col-md-8 col-sm-8 shadow-sm p-3 mb-4 border rounded-3 mx-auto">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 text-start" style={{ color: "green" }}>
              Event Title : {data?.title}
            </h5>
            <p className="mb-0">Location: {data?.location}</p>
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

            <Link
              to={`https://www.google.com/maps?q=${data.lat},${data.lon}`}
              target="_blank"
              rel="noopener noreferrer"
            >
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
      <div
        className="col-lg-8 col-md-8 col-sm-8 mx-auto  mb-4 p-3"
        style={{ color: "blue" }}
      >
        <h6 className="mb-1 text-start">Description:</h6>
        <p className="mt-3" style={{ color: "#000" }}>
          {data?.description}
        </p>
      </div>
    </div>
  );
}
