import { useForm } from "react-hook-form";
import "../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getProfile, setLoader, updateProfile } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");

  const [today] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Calculate the date 18 years ago from today
  const todayDate = new Date();
  const eighteenYearsAgo = new Date(
    todayDate.getFullYear() - 18,
    todayDate.getMonth(),
    todayDate.getDate()
  );
  const formattedDate = eighteenYearsAgo.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: { availability: true },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          console.log("res: ", res);
          // const user = res?.user;
          setValue("title", res?.user?.title);
          setValue("firstName", res?.user?.first_name);
          setValue("lastName", res?.user?.last_name);
          setValue("phoneNumber", res?.user?.phone_number);
          setValue("email", res?.user?.email);
          setValue("bloodGroup", res?.user?.blood_group);
          setValue("dateOfBirth", res?.user?.date_of_birth);
          setValue("gender", res?.user?.gender);
          // setValue("address", res?.user?.address);
          // setValue("location", res?.user?.location);
          setValue("address", res?.user?.location);
          setLocation(res?.user?.address);
          setValue("lastDonationDate", res?.user?.last_blood_donation_date);
          // setValue("availability", res?.user?.availability);
          setValue("availability", res?.user?.availability ?? true);
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

  const handleInput = (e) => {
    let value = e.target.value.replace(/[^0-9+\s]/g, ""); // Remove non-numeric characters except + and spaces
    const maxDigits = 10;

    if (value.startsWith("+91")) {
      value = "+91 " + value.slice(4, 4 + maxDigits); // Allow 10 digits after +91
    } else if (value.startsWith("0")) {
      value = "0" + value.slice(1, 1 + maxDigits); // Allow 10 digits after 0
    } else {
      value = value.slice(0, maxDigits); // Allow only 10 digits
    }

    e.target.value = value;
  };

  // Function to handle form submission
  const onSubmit = (data) => {
    // console.log("data: ", data);
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
        last_blood_donation_date: data?.lastDonationDate
          ? data?.lastDonationDate
          : "",
        lat: data?.lat,
        lon: data?.lon,
        // availability: data?.availability !== null ? data.availability : false,
        availability: data?.availability == true ? 1 : 0,
        // availability: true,
        terms_accepted: data?.terms,
        // aadhar_id: data?.aadhar_id,
        // abhid: data?.abhid,
      };

      // console.log("payload: ", payload);
      // return;

      dispatch(
        updateProfile(payload, (res) => {
          if (res.code === 200) {
            // Handle success
            toast.success(res.message);
            localStorage.setItem("is_profile_update", "1");
            navigate("/home");
          } else {
            toast.error(res.message);
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
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between">
        <h3>Complete profile</h3>
        <Link to="/home" className="skip">
          Skip
        </Link>
      </div>
      {/* Title */}
      <div className="form-group">
        <label>
          Title <span className="required-asterisk">*</span>
        </label>

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
        <label>
          First Name <span className="required-asterisk">*</span>
        </label>
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
        <label>
          Last Name <span className="required-asterisk">*</span>
        </label>
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
        <label>
          Phone Number <span className="required-asterisk">*</span>
        </label>
        <input
          className="form-input"
          type="tel"
          readOnly
          onInput={handleInput}
          {...register("phoneNumber", {
            required: true,
            pattern: {
              // value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
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
        <label>
          Email <span className="required-asterisk">*</span>
        </label>
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
        <label>
          Blood Group <span className="required-asterisk">*</span>
        </label>
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
          <option value="A1+ve">A1+ve</option>
          <option value="A1-ve">A1-ve</option>
          <option value="A1B+ve">A1B+ve</option>
          <option value="A1B-ve">A1B-ve</option>
          <option value="A2+ve">A2+ve</option>
          <option value="A2-ve">A2-ve</option>
          <option value="A2B+ve">A2B+ve</option>
          <option value="A2B-ve">A2B-ve</option>
          <option value="Bombay Blood Group">Bombay Blood Group</option>
          <option value="INRA">INRA</option>
        </select>
        {errors.bloodGroup && (
          <p className="error-message">Blood Group is required</p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>
          Date of Birth <span className="required-asterisk">*</span>
        </label>
        <input
          className="form-input"
          type="date"
          max={formattedDate}
          onFocus={(e) => {
            e.target.showPicker();
          }}
          {...register("dateOfBirth", { required: true })}
        />
        {errors.dateOfBirth && (
          <p className="error-message">Date of Birth is required</p>
        )}
      </div>

      {/* Gender */}
      <div className="form-group">
        <label>
          Gender <span className="required-asterisk">*</span>
        </label>
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

      <div className="form-group">
        <label>
          Location <span className="required-asterisk">*</span>
        </label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          className="form-input"
          defaultValue={location}
          onPlaceSelected={(place) => {
            if (place.geometry) {
              setValue("address", place.formatted_address, {
                shouldValidate: true,
              });
              setValue("lat", String(place.geometry.location.lat()), {
                shouldValidate: true,
              });
              setValue("lon", String(place.geometry.location.lng()), {
                shouldValidate: true,
              });
              trigger(["address", "lat", "lon"]); // Manually trigger validation
            }
          }}
          options={{
            types: ["establishment"],
            componentRestrictions: { country: "IN" },
          }}
          {...register("address", { required: true })}
        />

        {errors.address && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: false })} />
      <input type="hidden" {...register("lon", { required: false })} />
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
          onFocus={(e) => {
            e.target.showPicker();
          }}
          {...register("lastDonationDate", { required: false })}
        />
        {errors.lastDonationDate && (
          <p className="error-message">Last Donation Date is required</p>
        )}
      </div>

      {/* Interested to donate blood ? */}
      <div className="form-group">
        {/* <label>Interested to donate blood ?</label> */}
        <div className=" switch-container justify-content-none gap-3">
          <label className="switch-label">Interested to donate blood ?</label>
          <label className="switch">
            <input
              type="checkbox"
              {...register("availability", { required: false })}
              className="switch-input"
            />
            <span className="slider round"></span>
          </label>
          {errors.availability && (
            <p className="error-message">{errors.availability.message}</p>
          )}
        </div>
      </div>

      {/* Aadhar Number */}
      {/* <div className="form-group">
        <label>Aadhar ID </label>
        <input
          className="form-input"
          type="text"
          inputMode="numeric"
          maxLength="12"
          {...register("aadhar_id", {
            required: false,
            pattern: {
              value: /^\d{12}$/,
              message: "Aadhar Number must be exactly 12 digits",
            },
          })}
        />
        {errors.aadhar_id && (
          <p className="error-message">{errors.aadhar_id.message}</p>
        )}
      </div> */}
      {/* Aadhar Number */}
      {/* <div className="form-group">
        <label>Abha ID </label>
        <input
          className="form-input"
          type="text"
          inputMode="numeric"
          maxLength="14"
          {...register("abhid", {
            required: false,
            // pattern: {
            //   value: /^\d{1,14}$/,
            //   message: "Abha Number must be exactly 14 digits",
            // },
          })}
        />
        {errors.abhid && (
          <p className="error-message">{errors.abhid.message}</p>
        )}
      </div> */}

      {/* Terms and Conditions */}
      <div className="text-start">
        <input
          type="checkbox"
          {...register("terms", { required: true })}
          className="form-checkbox"
        />
        <label>
          I have read and agree to the
          <Link to="/terms-and-conditions.html" target="_blank">
            terms of service
          </Link>
          and
          <Link to="/privacy-policy.html" target="_blank">
            privacy policy
          </Link>
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
