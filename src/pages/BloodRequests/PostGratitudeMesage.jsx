import { useEffect, useState } from "react";
import uploadIcon from "../../assets/Image-upload.png"; // Upload icon for PDF
import { useLocation, useNavigate } from "react-router";
import {
  SendGratitudeCampMessage,
  setLoader,
  ViewBloodRequest,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function PostGratitudeMessage() {
  const [media, setMedia] = useState(null); // State for single media file (only one PDF)
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAbnormal, setIsAbnormal] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsAbnormal(event.target.checked);
  };

  const location = useLocation();
  const donorData = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");
  const donorId = queryParams.get("donorId");

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        ViewBloodRequest(requestId, (res) => {
          dispatch(setLoader(false));
          if (res.errors) {
            toast.error(res.errors);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error fetching requests");
      dispatch(setLoader(false));
    }
  }, [dispatch, requestId]);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file); // Replace the previous file with the newly selected one
    }
  };

  // const handleSubmit = () => {
  //   if (!textMessage) {
  //     toast.error("The message field is required.");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("camp_id", requestId);
  //   formData.append("donor_id", donorId);
  //   formData.append("message", textMessage);
  //   formData.append("abnormal", isAbnormal == true ? "1" : "0");

  //   if (media) {
  //     formData.append("media[]", media); // Append the single media file
  //   }

  //   dispatch(setLoader(true));
  //   try {
  //     dispatch(
  //       SendGratitudeCampMessage(formData, (res) => {
  //         dispatch(setLoader(false));

  //         if (res.code === 422) {
  //           if (res.errors) {
  //             for (const [key, value] of Object.entries(res.errors)) {
  //               if (key.startsWith("media.")) {
  //                 value.forEach((error) => {
  //                   toast.error(error);
  //                 });
  //               }
  //             }
  //           } else {
  //             toast.error("The media must not be greater than 25mb.");
  //           }
  //         } else if (res.errors) {
  //           toast.error(res.errors);
  //         } else if (res.code === 404) {
  //           toast.error(res.message);
  //         } else if (res.code === 200) {
  //           navigate(`/camplist/${requestId}`);
  //           toast.success(res.message);
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     toast.error(error.message || "Error sending gratitude message");
  //     dispatch(setLoader(false));
  //   }
  // };
  const handleSubmit = () => {
    if (!textMessage) {
      toast.error("The message field is required.");
      return;
    }

    const formData = new FormData();
    formData.append("camp_id", requestId);
    formData.append("donor_id", donorId);
    formData.append("message", textMessage);
    formData.append("abnormal", isAbnormal);
    // formData.append("abnormal", isAbnormal == true ? "1" : "0");

    if (media) {
      formData.append("media[]", media); // Append the single media file
    }

    dispatch(setLoader(true));
    try {
      dispatch(
        SendGratitudeCampMessage(formData, (res) => {
          dispatch(setLoader(false));

          if (res.code === 422) {
            // Check if there are specific errors in the response
            if (res.data && res.data.errors) {
              for (const [messages] of Object.entries(res.data.errors)) {
                messages.forEach((message) => {
                  toast.error(message); // Display each error message
                });
              }
            } else {
              toast.error("The media must not be greater than 25mb.");
            }
          } else if (res.errors) {
            toast.error(res.errors);
          } else if (res.code === 404) {
            toast.error(res.message);
          } else if (res.code === 200) {
            navigate(`/camplist/${requestId}`);
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
        <div>{donorData?.donor_name}</div>
        <div>{donorData?.date}</div>
        <div>{donorData?.time}</div>
        <div>{donorData?.location}</div>
        <div>{donorData?.status}</div>
      </div>
      <h5
        style={{ color: "blue" }}
        className="col-lg-8 col-md-8 col-sm-8 mx-auto text-start"
      >
        Dear Donors,
      </h5>
      <div className="col-lg-7 col-md-8 col-sm-8 mx-auto mt-4">
        <div className="d-flex gap-1 mb-2">
          <input
            type="checkbox"
            checked={isAbnormal}
            onChange={handleCheckboxChange}
          />
          <label>abnormal</label>
        </div>
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
              accept=".pdf" // Accept PDF files only
              style={{ display: "none" }}
              onChange={handleMediaUpload}
            />
          </div>
          {media && (
            <div className="text-center mt-3">
              <div className="mb-2">
                <a
                  href={URL.createObjectURL(media)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {media.name} (PDF)
                </a>
              </div>
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
