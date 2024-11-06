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
  const [media, setMedia] = useState([]); // State for all media types
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");
  const donorId = queryParams.get("donorId");
  const [data, setData] = useState({});

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
    const files = Array.from(event.target.files);
    setMedia((prev) => [...prev, ...files]); // Add new files to existing media
  };

  const handleCalendarClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*"; // Accept video files only
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      setMedia((prev) => [...prev, ...files]); // Add video files to media
    };
    fileInput.click();
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("request_id", requestId);
    formData.append("donor_id", donorId);
    formData.append("message", textMessage);

    media.forEach((file) => {
      formData.append("media[]", file); // Append all media files
    });

    dispatch(setLoader(true));
    try {
      dispatch(
        SendGratitudeMessage(formData, (res) => {
          dispatch(setLoader(false));

          // Check for 422 status code
          if (res.code === 422) {
            // Check if errors exist
            if (res.errors) {
              // Extract specific media error messages
              for (const [key, value] of Object.entries(res.errors)) {
                // Show the specific error message for media
                if (key.startsWith("media.")) {
                  value.forEach((error) => {
                    toast.error(error); // Show each error message
                  });
                }
              }
            } else {
              toast.error("The media must not be greater than 5120 kilobytes.");
            }
          } else if (res.errors) {
            // Handle other types of errors
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
        <div>{data?.name}</div>
        <div>Blood Type: {data?.blood_group}</div>
        <div>Quantity Needed: {data?.units_required}</div>
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
          {media.length > 0 && (
            <div className="text-center mt-3">
              {media.map((file, index) => {
                const fileURL = URL.createObjectURL(file);
                return file.type.startsWith("image/") ? (
                  <img
                    key={index}
                    src={fileURL}
                    alt={`Uploaded Preview ${index + 1}`}
                    className="img-fluid rounded"
                    style={{
                      marginRight: "10px",
                      marginBottom: "10px",
                      height: "100px",
                    }}
                  />
                ) : file.type.startsWith("audio/") ? (
                  <audio key={index} controls>
                    <source src={fileURL} type="audio/*" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : file.type.startsWith("video/") ? (
                  <video key={index} width="200" controls>
                    <source src={fileURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null;
              })}
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
