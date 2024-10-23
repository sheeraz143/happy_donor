import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css";
import { useNavigate } from "react-router";
import logo from "../../assets/prof_img.png";
import cameraIcon from "../../assets/cameraImg.png";
import { useEffect, useState } from "react"; // Add useCallback
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

  // const fetchAddress = useCallback(
  //   async (lat, lon) => {
  //     if (lat !== null) {
  //       const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0`;
  //       const response = await fetch(geocodeUrl);
  //       const data = await response.json();

  //       if (data.results && data.results.length > 0) {
  //         const address = data.results[0].formatted_address;
  //         setLocation(address);
  //         setValue("location", address);
  //       }
  //     }
  //   },
  //   [setValue]
  // ); // Add dependencies if any

  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      setValue("address", place.formatted_address);
      setValue("lat", String(place.geometry.location.lat())); // Convert to string
      setValue("lon", String(place.geometry.location.lng())); // Convert to string
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          const user = res?.user;
          console.log('user: ', user);
          setProfileImage(res?.user?.profile_picture || logo);
          setValue("title", user?.title);
          setValue("first_name", user?.first_name);
          setValue("last_name", user?.last_name);
          setValue("phone_number", user?.phone_number);
          setValue("email", user?.email);
          setValue("blood_group", user?.blood_group);
          setValue("date_of_birth", user?.date_of_birth);
          setValue("gender", user?.gender);
          // setValue("address", user?.address);
          setValue("address", user?.location);
          setLocation(user?.address)
          setValue("last_blood_donation_date", user?.last_blood_donation_date);

          // Fetch latitude and longitude if they exist
          if (user?.lat && user?.lon) {
            setValue("lat", user.lat);
            setValue("lon", user.lon);
            // fetchAddress(user?.location);
          }

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
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  }, [dispatch, setValue]);

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
    // console.log("Received data: ", data); // Log the incoming data

    dispatch(setLoader(true)); // Start loading
    try {
      const formData = new FormData();
      const changedData = {};

      // Append fields to formData if they have changed and are not undefined
      Object.keys(data).forEach((key) => {
        if (data[key] !== originalData[key] && data[key] !== undefined) {
          // Handle boolean values separately
          if (key === "availability" || key === "termsAccepted") {
            formData.append(key, Boolean(data[key]).toString());
          } else {
            formData.append(key, data[key]);
          }

          // Add to changed data
          changedData[key] = data[key];
        }
      });
      // console.log("changedData: ", changedData);

      // // Log formData for verification
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${typeof value} - ${value}`);
      // }

      // Dispatch action to update profile
      dispatch(
        updateProfile(formData, (res) => {
          console.log("Response: ", res);
          dispatch(setLoader(false)); // Stop loading

          // Check for response status
          if (res.status === true) {
            toast.success(res.message); // Show success message
            navigate("/viewprofile"); // Navigate to view profile
          } else {
            const errorMessages = res.message || "An error occurred.";
            toast.error(errorMessages); // Show error messages
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false)); // Stop loading
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
          <option value="Dr">Dr</option>

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
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
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
          onFocus={(e) => {
            e.target.showPicker();
          }}
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
      {/* <div className="form-group">
        <label>Address</label>
        <textarea
          className="form-input"
          type="text"
          {...register("address", { required: true })}
        />
        {errors.address && <p className="error-message">Address is required</p>}
      </div> */}
      {/* Location */}
      <div className="form-group">
        <label>Address</label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          onPlaceSelected={handlePlaceSelected}
          className="form-input"
          types={["geocode"]}
          defaultValue={location} // Set the default value for the input
          // Controlled component (uncomment if necessary)
          // value={location}
          onChange={(e) => setLocation(e.target.value)} // Handle input change
          {...register("address", { required: false })} // Register location
        />
        {errors.address && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: false })} />
      <input type="hidden" {...register("lon", { required: false })} />

      {/* Last Blood Donation Date */}
      <div className="form-group">
        <label>Last Blood Donation Date</label>
        <input
          className="form-input"
          type="date"
          max={today}
          onFocus={(e) => {
            e.target.showPicker();
          }}
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
