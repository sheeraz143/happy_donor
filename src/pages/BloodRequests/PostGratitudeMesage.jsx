import { useEffect, useState } from "react";
import uploadIcon from "../../assets/Image-upload.png";
import micIcon from "../../assets/Microphone.png";
import calendarIcon from "../../assets/Clapperboard.png";
import { useLocation, useNavigate } from "react-router";
import {
  SendGratitudeMessage,
  setLoader,
  ViewBloodRequest,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function PostGratitudeMessage() {
  const [image, setImage] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImage(files); // Store the array of files
  };

  const handleMicClick = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Set to true if you want to keep recognizing speech
    recognition.interimResults = false; // Set to true to get interim results

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleCalendarClick = () => {
    alert("Calendar button clicked");
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("request_id", requestId);
    formData.append("donor_id", donorId);
    formData.append("message", textMessage);

    image.forEach((image) => {
      formData.append("media[]", image);
    });
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    dispatch(setLoader(true));
    try {
      dispatch(
        SendGratitudeMessage(formData, (res) => {
          dispatch(setLoader(false));
          if (res.errors) {
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
    <div>
      <h2 className="mt-4">Post Gratitude Message</h2>
      <div
        className="card col-lg-8 col-md-8  col-sm-8 mx-auto align-items-start mt-5 mb-5 gap-3"
        style={{ color: "#097E14" }}
      >
        <div className="">Name: {data?.name}</div>
        <div>Request ID:{data?.request_id}</div>
        <div>Blood Type: {data?.blood_group}</div>
        <div>Quantity Needed: {data?.units_required}</div>
        <div>Location: {data?.location}</div>
      </div>
      <h5
        style={{ color: "blue" }}
        className="col-lg-8 col-md-8  col-sm-8 mx-auto text-start"
      >
        Dear Donors,
      </h5>

      <div className="col-lg-7 col-md-8 mx-auto mt-4">
        <div className="border p-3 rounded shadow-sm bg-white">
          <input
            className=" col-lg-8 col-md-8  col-sm-8 mb-4"
            placeholder=" Thank you for your donation! Your generosity has saved lives."
            style={{ border: "none", outline: "none" }}
            onChange={(e) => setTextMessage(e.target.value)}
          />
          {/* <p className="text-center text-muted mb-4">
            Thank you for your donation!
            <br />
            Your generosity has saved lives.
          </p> */}
          <div
            style={{ borderBottom: "1px solid #ccc" }}
            className="mb-3"
          ></div>
          <div className="d-flex justify-content-end mb-3 mt-3">
            {/* File Upload Icon */}
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
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            {/* Mic Icon */}
            <img
              src={micIcon}
              alt="Microphone Icon"
              className="icon me-3"
              style={{ cursor: "pointer" }}
              onClick={handleMicClick}
            />
            {/* Calendar Icon */}
            <img
              src={calendarIcon}
              alt="Calendar Icon"
              className="icon"
              style={{ cursor: "pointer" }}
              onClick={handleCalendarClick}
            />
          </div>
          {isRecording && (
            <p className="text-center text-danger">Recording...</p>
          )}
          {transcript && (
            <div className="text-center mt-3">
              <p className="transcript">{transcript}</p>
            </div>
          )}
          {image.length > 0 && (
            <div className="text-center mt-3">
              {image.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded Preview ${index + 1}`}
                  className="img-fluid rounded"
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                    height: "100px",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5 mb-5 d-flex">
        <button
          className="btn  flex-fill me-2 fw-bold"
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
