import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css";
import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import cameraIcon from "../../assets/cameraImg.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getProfile,
  profilePicUpdate,
  setLoader,
  updateProfile,
} from "../../redux/product";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(logo);
  // const [originalData, setOriginalData] = useState({});

  // const [getData, setData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          console.log("res: ", res.user);
          // const user = res?.user;
          setProfileImage(res?.user?.profile_picture || logo);
          setValue("title", res?.user?.title);
          setValue("firstName", res?.user?.first_name);
          setValue("lastName", res?.user?.last_name);
          setValue("phoneNumber", res?.user?.phone_number);
          setValue("email", res?.user?.email);
          setValue("bloodGroup", res?.user?.blood_group);
          setValue("dateOfBirth", res?.user?.date_of_birth);
          setValue("gender", res?.user?.gender);
          setValue("address", res?.user?.address);
          setValue("location", res?.user?.location);
          setValue("lastDonationDate", res?.user?.last_blood_donation_date);
          // setOriginalData(user);
          // setData(res?.user);
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
  }, [dispatch, setValue]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setProfileImage(reader.result); // Display the selected image
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    dispatch(setLoader(true)); // Start loading
    try {
      const dataToSend = {
        title: data?.title || "",
        first_name: data?.firstName || "",
        last_name: data?.lastName || "",
        phone_number: data?.phoneNumber || "",
        email: data?.email || "",
        blood_group: data?.bloodGroup || "",
        date_of_birth: data?.dateOfBirth || "",
        gender: data?.gender || "",
        address: data?.address || "",
        location: data?.location || "",
        last_blood_donation_date: data?.lastDonationDate || "",
        // lat: "93.1232",
        // lon: "92.32323",
        lat: data?.lat || "",
        lon: data?.lon || "",
        availability:
          data?.availability !== undefined ? Boolean(data.availability) : true,
        terms_accepted:
          data?.termsAccepted !== undefined
            ? Boolean(data.termsAccepted)
            : true,
      };

      // Log to ensure values are correct
      console.log("dataToSend", dataToSend);

      const formData = new FormData();
      // Append fields to formData
      formData.append("title", data?.title || "");
      formData.append("first_name", data?.firstName || "");
      formData.append("last_name", data?.lastName || "");
      formData.append("phone_number", data?.phoneNumber || "");
      formData.append("email", data?.email || "");
      formData.append("blood_group", data?.bloodGroup || "");
      formData.append("date_of_birth", data?.dateOfBirth || "");
      formData.append("gender", data?.gender || "");
      formData.append("address", data?.address || "");
      formData.append("location", data?.location || "");
      formData.append("last_blood_donation_date", data?.lastDonationDate || "");
      formData.append("lat", "93.1232"); // Static value, change as needed
      formData.append("lon", "92.32323"); // Static value, change as needed
      // formData.append("terms_accepted", Boolean(true));
      const availabilityBool =
        data?.availability !== undefined ? Boolean(data.availability) : true;
      const termsAcceptedBool =
        data?.termsAccepted !== undefined ? Boolean(data.termsAccepted) : true;
      console.log("availabilityBool: ", typeof availabilityBool);
      console.log("termsAcceptedBool: ", typeof termsAcceptedBool);

      // Append boolean values as strings "true" or "false"
      formData.append("availability", availabilityBool);
      formData.append("terms_accepted", termsAcceptedBool);

      // Append profile image file if a new file was selected
      // const fileInput = document.getElementById("fileInput");
      // if (fileInput.files[0]) {
      //   formData.append("profileImage", fileInput.files[0]);
      // }

      // Object.keys(data).forEach((key) => {
      //   if (data[key] !== originalData[key] && data[key]) {
      //     formData.append(key, data[key]);
      //   }
      // });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${typeof value}`);
      }

      // return;
      dispatch(
        updateProfile(dataToSend, (res) => {
          console.log("res: ", res);
          if (res.errors) {
            toast.error(res.errors);

            // Handle validation errors
            // for (const [field, messages] of Object.entries(res.errors)) {
            //   messages.forEach((message) =>
            //     toast.error(`${field}: ${message}`)
            //   );
            // }
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
      toast.error(error);
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
          <option value="mr">mr</option>
          <option value="ms">ms</option>
          <option value="mrs">Mrs</option>
        </select>
        {errors.title && <p className="error-message">Title is required</p>}
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>First Name</label>
        <input
          className="form-input"
          type="text"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && (
          <p className="error-message">First Name is required</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Last Name</label>
        <input
          className="form-input"
          type="text"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && (
          <p className="error-message">Last Name is required</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Phone Number</label>
        <input
          className="form-input"
          type="tel"
          {...register("phoneNumber", {
            required: true,
            // pattern: /^[0-9]{10}$/,
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.phoneNumber && (
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
          {...register("bloodGroup", { required: true })}
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
        {errors.bloodGroup && (
          <p className="error-message">Blood Group is required</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          className="form-input"
          type="date"
          {...register("dateOfBirth", { required: true })}
        />
        {errors.dateOfBirth && (
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
        <input
          className="form-input"
          type="text"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="error-message">Location is required</p>
        )}
      </div>

      {/* Last Blood Donation Date */}
      <div className="form-group">
        <label>Last Blood Donation Date</label>
        <input
          className="form-input"
          type="date"
          {...register("lastDonationDate", { required: true })}
        />
        {errors.lastDonationDate && (
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
