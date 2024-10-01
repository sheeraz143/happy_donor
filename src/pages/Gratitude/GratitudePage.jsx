// import { useState } from "react";
// import { useLocation } from "react-router-dom";

// function GratitudePage() {
//   const location = useLocation();
//   const { request } = location.state;
//   const [image, setImage] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState("");

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setImage(URL.createObjectURL(file));
//   };

//   const startRecording = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.onresult = (event) => {
//       setTranscript(event.results[0][0].transcript);
//     };
//     recognition.start();
//     setIsRecording(true);
//   };

//   return (
//     <div className="gratitude-page">
//       <h2>Gratitude Message for {request.name}</h2>
//       <h2>View Gratitude Message</h2>
//       {/* <p>Thank you for your donation! Your generosity has saved lives.</p> */}

//       <div className="upload-section">
//         <input type="file" onChange={handleImageUpload} />
//       </div>

//       {image && <img src={image} alt="Uploaded" />}

//       <div className="voice-input-section">
//         <button onClick={startRecording} disabled={isRecording}>
//           {isRecording ? "Recording..." : "Start Voice Input"}
//         </button>
//         {transcript && <p>Voice Input: {transcript}</p>}
//       </div>
//     </div>
//   );
// }

// export default GratitudePage;

// import { useState } from "react";
// import uploadIcon from "../../assets/image-upload.png";
// import micIcon from "../../assets/Microphone.png";
// import calendarIcon from "../../assets/Clapperboard.png";
import "../../css/Gratitude.css";
import { useLocation } from "react-router";

function GratitudeMessageBox() {
  // const [image, setImage] = useState(null);
  // const [transcript, setTranscript] = useState("");
  // const [isRecording, setIsRecording] = useState(false);

  const location = useLocation();
  console.log("location: ", location);
  const request = location.state.donor || {}; // Retrieve the passed request object
  console.log("data: ", request);

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImage(URL.createObjectURL(file));
  //   }
  // };

  // const handleMicClick = () => {
  //   if (!window.webkitSpeechRecognition) {
  //     alert("Speech recognition is not supported in your browser.");
  //     return;
  //   }

  //   const recognition = new window.webkitSpeechRecognition();
  //   recognition.continuous = false; // Set to true if you want to keep recognizing speech
  //   recognition.interimResults = false; // Set to true to get interim results

  //   recognition.onstart = () => {
  //     setIsRecording(true);
  //   };

  //   recognition.onresult = (event) => {
  //     const speechToText = event.results[0][0].transcript;
  //     setTranscript(speechToText);
  //   };

  //   recognition.onend = () => {
  //     setIsRecording(false);
  //   };

  //   recognition.onerror = (event) => {
  //     console.error("Speech recognition error", event.error);
  //     setIsRecording(false);
  //   };

  //   recognition.start();
  // };

  // const handleCalendarClick = () => {
  //   alert("Calendar button clicked");
  // };

  return (
    <div className="my-4">
      <h2 className="mb-5">View gratitude Message</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="border p-3 rounded shadow-sm bg-white">
            <p className="text-center text-muted mb-4">
              {request?.gratitude_msg}
            </p>
            {/* <div
              style={{ borderBottom: "1px solid #ccc" }}
              className="mb-3"
            ></div> */}
            {/* <div className="d-flex justify-content-end mb-3 mt-3">
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
              <img
                src={micIcon}
                alt="Microphone Icon"
                className="icon me-3"
                style={{ cursor: "pointer" }}
                onClick={handleMicClick}
              />
              <img
                src={calendarIcon}
                alt="Calendar Icon"
                className="icon"
                style={{ cursor: "pointer" }}
                onClick={handleCalendarClick}
              />
            </div> */}
            {/* {isRecording && (
              <p className="text-center text-danger">Recording...</p>
            )}
            {transcript && (
              <div className="text-center mt-3">
                <p className="transcript">{transcript}</p>
              </div>
            )}
            {image && (
              <div className="text-center mt-3">
                <img
                  src={image}
                  alt="Uploaded Preview"
                  className="img-fluid rounded"
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GratitudeMessageBox;
