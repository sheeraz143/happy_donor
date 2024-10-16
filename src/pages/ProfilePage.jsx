import { useForm } from "react-hook-form";
import "../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getProfile, setLoader, updateProfile } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          // const user = res?.user;
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
          setValue("availability", res?.user?.availability);
          setValue("terms", res?.user?.terms_accepted);
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

  // Function to handle form submission
  const onSubmit = (data) => {
    dispatch(setLoader(true)); // Start loading
    try {
      const payload = {
        title: data?.title,
        first_name: data?.firstName,
        last_name: data?.lastName,
        phone_number: data?.phoneNumber,
        email: data?.email,
        blood_group: data?.bloodGroup,
        date_of_birth: data?.dateOfBirth,
        gender: data?.gender,
        address: data?.address,
        location: data?.location,
        last_blood_donation_date: data?.lastDonationDate,
        lat: "93.1232", // Consider using actual lat/lon values
        lon: "92.32323",
        availability: data?.availability,
        terms_accepted: data?.terms,
      };

      dispatch(
        updateProfile(payload, (res) => {
          if (res.errors) {
            toast.error(res.errors);
          } else {
            // Handle success
            toast.success(res.message);
            localStorage.setItem(
              "is_profile_update",
              res.user?.profile_verified
            );
            navigate("/home");
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error);
      dispatch(setLoader(false));
    }
    navigate("/home");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="d-flex align-items-center justify-content-around">
        <h3>Complete profile</h3>
        <Link to="/home" className="skip">
          Skip
        </Link>
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
          readOnly
          {...register("phoneNumber", {
            required: true,
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.phoneNumber && (
          <p className="error-message">Valid Phone Number is required</p>
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
          max={today}
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
      {/* <div className="form-group">
        <label>Location</label>
        <input
          className="form-input"
          type="text"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="error-message">Location is required</p>
        )}
      </div> */}

      {/* Last Blood Donation Date */}
      <div className="form-group">
        <label>Last Blood Donation Date</label>
        <input
          className="form-input"
          type="date"
          max={today}
          {...register("lastDonationDate", { required: true })}
        />
        {errors.lastDonationDate && (
          <p className="error-message">Last Donation Date is required</p>
        )}
      </div>

      {/* Availability Toggle Switch */}
      <div className=" switch-container">
        <label className="switch-label">Availability</label>
        <label className="switch">
          <input
            type="checkbox"
            {...register("availability")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Terms and Conditions */}
      <div className="text-start">
        <input
          type="checkbox"
          {...register("terms", { required: true })}
          className="form-checkbox"
        />
        <label>
          I have read and agree to terms of service and privacy policy
        </label>
        {errors.terms && (
          <p className="error-message">You must agree to the terms</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save
      </button>
    </form>
  );
};

export default Profile;
