import { useForm } from "react-hook-form";
import "../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { CreateCamp, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";

function Camps() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [today] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // const handleFileChange = (event) => {
  //   setImageFile(event.target.files[0]);
  //   console.log("event.target.files[0]: ", event.target.files[0]);
  // };

  const onSubmit = (data) => {
    console.log("data: ", data);
    const formData = new FormData();

     // Append each field to FormData
  for (const key in data) {
    if (key === "camp_image") {
      // Check if there's a file selected
      if (data.camp_image.length > 0) {
        // Append only the first file in case of multiple selections
        formData.append("camp_image", data.camp_image[0]);
        console.log("Uploaded image file: ", data.camp_image[0]);
      } else {
        console.error("No file selected for camp_image.");
      }
    } else {
      formData.append(key, data[key]);
    }
  }
    // console.log("data.camp_image[0]: ", data.camp_image[0]);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // return;

    dispatch(setLoader(true));
    dispatch(
      CreateCamp(formData, (res) => {
        console.log("res: ", res);
        if (res.code === 201) {
          toast.success(res.message);
          navigate("/camps/list");
        } else {
          toast.error(res.message);
        }
        dispatch(setLoader(false));
      })
    );
  };

  return (
    <form className="form-container mb-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <h3 style={{ color: "black", textAlign: "center" }}>Create a new camp</h3>
      <div className="form-group">
        <label>Camp Title</label>
        <input
          className="form-input"
          {...register("title", { required: true })}
        />
        {errors.title && <p className="error-message">Title is required</p>}
      </div>

      {/* Date */}
      <div className="form-group">
        <label>Date</label>
        <input
          className="form-input"
          type="date"
          min={today}
          onFocus={(e) => {
            e.target.showPicker();
          }}
          style={{ cursor: "pointer" }}
          {...register("date", { required: true })}
        />
        {errors.date && <p className="error-message">Date is required</p>}
      </div>

      {/* Start Time */}
      <div className="form-group">
        <label>Start Time</label>
        <input
          className="form-input"
          type="time"
          onFocus={(e) => {
            e.target.showPicker();
          }}
          style={{ cursor: "pointer" }}
          {...register("start_time", { required: true })}
        />
        {errors.start_time && (
          <p className="error-message">Start Time is required</p>
        )}
      </div>

      {/* End Time */}
      <div className="form-group">
        <label>End Time</label>
        <input
          className="form-input"
          type="time"
          onFocus={(e) => {
            e.target.showPicker();
          }}
          style={{ cursor: "pointer" }}
          {...register("end_time", { required: true })}
        />
        {errors.end_time && (
          <p className="error-message">End Time is required</p>
        )}
      </div>

      {/* Expected Participants */}
      <div className="form-group">
        <label>Expected Participants</label>
        <input
          className="form-input"
          type="number"
          {...register("expected_participants", { required: false })}
        />
        {errors.expected_participants && (
          <p className="error-message">Expected Participants is required</p>
        )}
      </div>

      {/* Expected Blood Units */}
      <div className="form-group">
        <label>Expected Blood Units</label>
        <input
          className="form-input"
          type="number"
          {...register("expected_units", { required: false })}
        />
        {errors.expected_units && (
          <p className="error-message">Expected Blood Units is required</p>
        )}
      </div>

      {/* Image Upload Field */}
      {/* Image Upload Field */}
      
      {/* Location */}
      <div className="form-group">
        <label>Location</label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          onPlaceSelected={(place) => {
            console.log(place);
            if (place.geometry) {
              setValue("location", place.formatted_address);
              setValue("lat", String(place.geometry.location.lat())); // Convert to string
              setValue("lon", String(place.geometry.location.lng())); // Convert to string
            }
          }}
          className="form-input"
          options={{
            componentRestrictions: { country: "IN" },
            types: ["establishment"],
          }}
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: true })} />
      <input type="hidden" {...register("lon", { required: true })} />

      {/* Description */}
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-input"
          {...register("description", { required: false })}
        />
        {errors.description && (
          <p className="error-message">Description is required</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="text-start">
        <input
          type="checkbox"
          className="form-checkbox"
          {...register("terms", { required: true })}
        />
        <label>
          I have read and agree to terms of service and privacy policy
        </label>
        {errors.terms && (
          <p className="error-message">You must agree to the terms</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="d-flex justify-content-evenly">
        <button
          type="button"
          className="submit-button"
          style={{ backgroundColor: "grey", color: "white", width: "100px" }}
          onClick={() => navigate("/home")}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="submit-button"
          style={{ color: "white", width: "100px" }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default Camps;
