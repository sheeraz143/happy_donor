import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css";
import { useNavigate } from "react-router";
import logo from "../../assets/prof_img.png";
import cameraIcon from "../../assets/cameraImg.png";
import { useEffect, useState, useCallback } from "react"; // Add useCallback
import { useDispatch } from "react-redux";
import {
  getProfile,
  profilePicUpdate,
  setLoader,
  updateProfile,
} from "../../redux/product";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(logo);
  const [location, setLocation] = useState("");

  const [today] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [originalData, setOriginalData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const fetchAddress = useCallback(
    async (lat, lon) => {
      if (lat !== null) {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setLocation(address);
          setValue("location", address);
        }
      }
    },
    [setValue]
  ); // Add dependencies if any

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          console.log("res: ", res.user);
          const user = res?.user;
          setProfileImage(res?.user?.profile_picture || logo);
          setValue("title", res?.user?.title);
          setValue("first_name", res?.user?.first_name);
          setValue("last_name", res?.user?.last_name);
          setValue("phone_number", res?.user?.phone_number);
          setValue("email", res?.user?.email);
          setValue("blood_group", res?.user?.blood_group);
          setValue("date_of_birth", res?.user?.date_of_birth);
          setValue("gender", res?.user?.gender);
          setValue("address", res?.user?.address);
          setValue("location", res?.user?.location);
          setValue(
            "last_blood_donation_date",
            res?.user?.last_blood_donation_date
          );
          fetchAddress(res?.user?.lat, res?.user?.lon);

          setOriginalData(user);
          if (res.errors) {
            toast.error(res.errors);
          } else {
            // Handle success
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error);
      dispatch(setLoader(false));
    }
  }, [dispatch, fetchAddress, setValue]);
  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      setValue("location", place.formatted_address);
      setValue("lat", place.geometry.location.lat());
      setValue("lon", place.geometry.location.lng());
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        dispatch(
          profilePicUpdate(formData, (res) => {
            console.log("res: ", res);
            if (res.errors) {
              toast.error(res.errors);
            } else {
              setProfileImage(res.profile_picture); // Update the profile image state
              toast.success(res.message);
            }
            dispatch(setLoader(false));
          })
        );
      } catch (error) {
        // Handle unexpected errors
        toast.error(error);
        dispatch(setLoader(false));
      }
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    dispatch(setLoader(true)); // Start loading
    try {
      const formData = new FormData();

      // Create a map for changed data
      const changedData = {};

      // Append fields to formData if they have changed and are not undefined
      Object.keys(data).forEach((key) => {
        if (data[key] !== originalData[key] && data[key] !== undefined) {
          // Handle lat and lon separately
          if (key === "lat" || key === "lon") return;

          // Handle boolean values
          if (key === "availability" || key === "termsAccepted") {
            formData.append(key, Boolean(data[key]).toString());
          } else {
            formData.append(key, data[key]);
          }

          // Add to changed data
          changedData[key] = data[key];
        }
      });

      // Convert lat and lon to string if they exist and are changed
      if (data.lat !== originalData.lat && data.lat !== undefined) {
        formData.append("lat", data.lat.toString());
        changedData.lat = data.lat.toString();
      }
      if (data.lon !== originalData.lon && data.lon !== undefined) {
        formData.append("lon", data.lon.toString());
        changedData.lon = data.lon.toString();
      }

      // Log to ensure formData is correct
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${typeof value} - ${value}`);
      }

      // Log changedData to ensure only changed fields are being sent
      console.log("changedData: ", changedData);

      // Dispatch the action to update profile
      dispatch(
        updateProfile(formData, (res) => {
          console.log("res: ", res);
          if (res.errors) {
            // Handle error response
            const errorMessages = Object.values(res.errors).flat().join(", ");
            toast.error(errorMessages); // Show error messages
          } else {
            // Handle success
            toast.success(res.message);

            navigate("/viewprofile");
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  return (
    <form className="form-container mb-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Profile Image with Camera Icon */}

      <div className="profile-image-container">
        <img
          src={profileImage}
          alt="Profile"
          className="profile-image"
          onClick={() => document.getElementById("fileInput").click()} // Trigger file input on click
          style={{ border: "1px solid gray", borderRadius: "50%" }}
        />
        <img
          src={cameraIcon}
          alt="Camera Icon"
          className="camera-icon"
          onClick={() => document.getElementById("fileInput").click()} // Trigger file input on click
        />
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }} // Hide the file input
          onChange={handleImageChange} // Handle image change
        />
      </div>
      {/* Title */}
      <div className="form-group">
        <label>Title</label>
        <select
          className="form-input"
          {...register("title", { required: true })}
        >
          <option value="">Select</option>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
          <option value="Mrs">Mrs</option>
        </select>
        {errors.title && <p className="error-message">Title is required</p>}
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>First Name</label>
        <input
          className="form-input"
          type="text"
          {...register("first_name", { required: true })}
        />
        {errors.first_name && (
          <p className="error-message">First Name is required</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Last Name</label>
        <input
          className="form-input"
          type="text"
          {...register("last_name", { required: true })}
        />
        {errors.last_name && (
          <p className="error-message">Last Name is required</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Phone Number</label>
        <input
          className="form-input"
          type="tel"
          readOnly
          {...register("phone_number", {
            required: true,
            // pattern: /^[0-9]{10}$/,
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.phone_number && (
          <p className="error-message">Phone Number is required</p>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-input"
          type="email"
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          })}
        />
        {errors.email && <p className="error-message"> Email is required</p>}
      </div>

      {/* Blood Group */}
      <div className="form-group">
        <label>Blood Group</label>
        <select
          className="form-input"
          {...register("blood_group", { required: true })}
        >
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        {errors.blood_group && (
          <p className="error-message">Blood Group is required</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          className="form-input"
          type="date"
          max={today}
          {...register("date_of_birth", { required: true })}
        />
        {errors.date_of_birth && (
          <p className="error-message">Date of Birth is required</p>
        )}
      </div>

      {/* Gender */}
      <div className="form-group">
        <label>Gender</label>
        <select
          className="form-input"
          {...register("gender", { required: true })}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        {errors.gender && <p className="error-message">Gender is required</p>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address</label>
        <textarea
          className="form-input"
          type="text"
          {...register("address", { required: true })}
        />
        {errors.address && <p className="error-message">Address is required</p>}
      </div>

      {/* Location */}
      <div className="form-group">
        <label>Location</label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          onPlaceSelected={handlePlaceSelected}
          className="form-input"
          types={["geocode"]}
          defaultValue={location} // Set the default value for the input
          // value={location} // Control the input value
          onChange={(e) => setLocation(e.target.value)} // Handle input change
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: true })} />
      <input type="hidden" {...register("lon", { required: true })} />

      {/* Last Blood Donation Date */}
      <div className="form-group">
        <label>Last Blood Donation Date</label>
        <input
          className="form-input"
          type="date"
          max={today}
          {...register("last_blood_donation_date", { required: true })}
        />
        {errors.last_blood_donation_date && (
          <p className="error-message">Last Donation Date is required</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfilePage;
