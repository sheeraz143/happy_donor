import { useEffect, useState } from "react";
import uploadIcon from "../assets/Image-upload.png";
import micIcon from "../assets/Microphone.png";
import calendarIcon from "../assets/Clapperboard.png";
import { useLocation, useNavigate } from "react-router";
import {
  SendGratitudeMessage,
  setLoader,
  ViewBloodRequest,
} from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function PostGratitudeCampMesage() {
  const [media, setMedia] = useState(null); // Single media file state
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");
  const donorId = queryParams.get("donorId");
  const [data, setData] = useState({});
  const { donorData } = location.state || {};
  console.log("donorData: ", donorData);

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequest(requestId, (res) => {
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
  }, []);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0]; // Get only the first selected file
    setMedia(file); // Set the single media file in state
  };

  const handleCalendarClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*"; // Accept video files only
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      setMedia(file); // Replace any previous media with the new video
    };
    fileInput.click();
  };

  const handleSubmit = () => {
    if (!textMessage) {
      toast.error("Message cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("request_id", requestId);
    formData.append("donor_id", donorId);
    formData.append("message", textMessage);

    if (media) {
      formData.append("media[]", media); // Append only the current media file
    }

    dispatch(setLoader(true));
    try {
      dispatch(
        SendGratitudeMessage(formData, (res) => {
          dispatch(setLoader(false));

          if (res.code === 422) {
            if (res.errors) {
              for (const [key, value] of Object.entries(res.errors)) {
                if (key.startsWith("media.")) {
                  value.forEach((error) => {
                    toast.error(error);
                  });
                }
              }
            } else {
              toast.error("The media must not be greater than 25mb.");
            }
          } else if (res.errors) {
            toast.error(res.errors);
          } else if (res.code === 404) {
            toast.error(res.message);
          } else if (res.code === 200) {
            navigate(`/donarlist/${requestId}`);
            toast.success(res.message);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error sending gratitude message");
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="d-flex flex-column">
      <h2 className="mt-4 text-center">Post Gratitude Message</h2>
      <div
        className="card col-lg-8 col-md-8 col-sm-8 mx-auto align-items-start mt-5 mb-5 gap-3"
        style={{ color: "#097E14" }}
      >
        <h5>Donor Info</h5>
        <div>{donorData?.donor_name}</div>
        <div>Blood Type: {data?.blood_group}</div>
        <div>Status: {donorData?.donation_status}</div>
        {/* <div>Dono{donorData?.phone_number}</div> */}
        <div>{data?.location}</div>
      </div>
      <h5
        style={{ color: "blue" }}
        className="col-lg-8 col-md-8 col-sm-8 mx-auto text-start"
      >
        Dear Donors,
      </h5>
      <div className="col-lg-7 col-md-8 col-sm-8 mx-auto mt-4">
        <div className="border p-3 rounded shadow-sm bg-white d-flex flex-column">
          <input
            className="col-lg-8 col-md-8 col-sm-8 mb-4"
            placeholder=" Thank you for your donation! Your generosity has saved lives."
            style={{ border: "none", outline: "none" }}
            onChange={(e) => setTextMessage(e.target.value)}
          />
          <div
            style={{ borderBottom: "1px solid #ccc" }}
            className="mb-3"
          ></div>
          <div className="d-flex justify-content-end align-items-center mb-3 mt-3">
            <label htmlFor="file-upload" className="me-3">
              <img
                src={uploadIcon}
                alt="Upload Icon"
                className="icon"
                style={{ cursor: "pointer" }}
              />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,audio/*" // Accept images and audio files
              style={{ display: "none" }}
              onChange={handleMediaUpload}
            />
            <label htmlFor="audio-upload" className="me-3">
              <img
                src={micIcon}
                alt="Microphone Icon"
                className="icon"
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("audio-upload").click()} // Trigger file input
              />
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={handleMediaUpload}
            />
            <img
              src={calendarIcon}
              alt="Calendar Icon"
              className="icon"
              style={{ cursor: "pointer" }}
              onClick={handleCalendarClick}
            />
          </div>
          {media && (
            <div className="text-center mt-3">
              {media.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Uploaded Preview"
                  className="img-fluid rounded"
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                    height: "100px",
                  }}
                />
              ) : media.type.startsWith("audio/") ? (
                <audio controls>
                  <source src={URL.createObjectURL(media)} type="audio/*" />
                  Your browser does not support the audio tag.
                </audio>
              ) : media.type.startsWith("video/") ? (
                <video width="200" controls>
                  <source src={URL.createObjectURL(media)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5 mb-5 d-flex">
        <button
          className="btn flex-fill me-2 fw-bold"
          style={{ padding: "15px", background: "#D9D9D9", color: "gray" }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary flex-fill ms-2 fw-bold"
          style={{ padding: "15px" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
