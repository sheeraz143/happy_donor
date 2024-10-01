import "../../css/BloodRequest.css";
import bloodGroupImg from "../../assets/bloodimage.png";
import profPicImg from "../../assets/profpic.png";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AcceptedDonors, MarkDonated, setLoader } from "../../redux/product";
import { toast } from "react-toastify";

const AcceptDonorList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [donors, setDonors] = useState([]);
  const [requestId, setRequestId] = useState({});
  const [donationStatus, setDonationStatus] = useState({});

  console.log("id: ", id);

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        AcceptedDonors(id, (res) => {
          console.log("res: ", res);
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else {
            setDonors(res.donors || []);

            setRequestId(res.request_id);
            const initialStatus = res.donors.reduce((acc, donor) => {
              acc[donor.donor_id] = donor.donation_status === "Completed";
              return acc;
            }, {});
            setDonationStatus(initialStatus);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, id]);

  const markAsDonated = (donorId) => {
    console.log("donorId: ", donorId);
    dispatch(setLoader(true));
    try {
      dispatch(
        // MarkDonated({ request_id: requestId, donor_id: donorId }, (res) => {
        MarkDonated(requestId, (res) => {
          console.log("res: ", res);
          dispatch(setLoader(false));

          if (res.errors) {
            toast.error(res.errors);
          } else if (res.code === 400) {
            toast.error("You have already accepted this blood request.");
          } else if (res.code === 200) {
            toast.success("Marked as donated successfully");
            setDonationStatus((prevStatus) => ({
              ...prevStatus,
              [donorId]: true,
            }));
            navigate("/confirmdonation");
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error marking as donated");
      dispatch(setLoader(false));
    }
  };

  const navigateToGratitude = (requestId, donorId) => {
    navigate(`/postgratitudemesage?requestId=${requestId}&donorId=${donorId}`);
  };

  const renderRequestCard = (donor) => (
    <div className="request-card" key={donor.donor_id}>
      <div className="request-header">
        <div className="align-content-center">
          <img
            src={donor.profile_picture || profPicImg}
            alt="Profile"
            style={{ width: "100px" }}
          />
        </div>
        <div className="request-details">
          <div className="request-id">Name: {donor.name}</div>
          <div className="request-date">Location: {donor.location}</div>
          <div className="request-address">Address: {donor.address}</div>
          <div className="request-units">Date: {donor.date}</div>
        </div>
        <div className="blood-group">
          <img src={bloodGroupImg} alt="Blood Group" />
        </div>
      </div>

      <div className="accept-donar-button justify-content-end gap-3">
        {donationStatus[donor.donor_id] ? (
          <>
            <button className="accepted-donors-btn btn-secondary" disabled>
              Donated
            </button>
            {donor.gratitude_msg ? (
              // <div className="accepted-donors-btn">
              <button
                className="accepted-donors-btn"
                onClick={() => navigate(`/gratitude`, { state: { donor } })}
              >
                View Gratitude Message
              </button>
            ) : (
              <button
                className="accepted-donors-btn"
                onClick={() => navigateToGratitude(requestId, donor.donor_id)}
              >
                Post Gratitude Message
              </button>
            )}
          </>
        ) : (
          <button
            className="accepted-donors-btn"
            onClick={() => markAsDonated(donor.donor_id)}
          >
            Mark As Donated
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <h3 className="mt-3">Accepted Donors</h3>
      <div className="blood-request-container">
        <div className="requests mb-5 mt-5">
          {donors.length > 0 ? (
            donors.map(renderRequestCard)
          ) : (
            <h4>No accepted donors available.</h4>
          )}
        </div>
      </div>
    </>
  );
};

export default AcceptDonorList;
