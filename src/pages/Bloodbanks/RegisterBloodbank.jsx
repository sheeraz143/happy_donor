import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { setLoader, updateProfile } from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";

const Registerbloodbank = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phoneNumber1, setPhoneNumber1] = useState("+91");
  const [phoneNumber2, setPhoneNumber2] = useState("+91");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Set default values when the component mounts
    setPhoneNumber1("+91");
    setPhoneNumber2("+91");
  }, []);

  const handleInput1 = (e) => {
    handleInput(e, setPhoneNumber1);
  };

  const handleInput2 = (e) => {
    handleInput(e, setPhoneNumber2);
  };

  const handleInput = (e, setPhoneNumber) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Restore +91 if the user tries to delete it
    if (!value.startsWith("91")) {
      value = `91${value}`; // Keep +91 prefix
    }

    if (value.startsWith("91")) {
      value = `+91${value.slice(2, 12)}`; // Format as +91XXXXXXXXXX
    }

    // Limit to 10 digits after +91
    if (value.length > 12) {
      value = value.slice(0, 14); // +91 followed by 10 digits
    }

    // Update the state to keep the input controlled
    setPhoneNumber(value);
    e.target.value = value; // Reflect the value in the input
  };

  const handleBlur = (phoneNumber, setPhoneNumber) => {
    // Ensure the value is always in the correct format on blur
    if (!phoneNumber.startsWith("+91")) {
      setPhoneNumber("+91" + phoneNumber.replace(/^\D+/g, "").slice(0, 10)); // Ensure it starts with +91
    }
  };

  // Function to handle form submission
  const onSubmit = (data) => {
    // dispatch(setLoader(true)); // Start loading
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
        lat: "93.1232",
        lon: "92.32323",
        // availability: data?.availability !== null ? data.availability : false,
        availability: true,
        terms_accepted: data?.terms,
      };

      dispatch(
        updateProfile(payload, (res) => {
          console.log("res: ", res);
          if (res.code === 200) {
            // Handle success
            toast.success(res.message);
            navigate("/login/bloodbank");
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
    <form
      className="form-container"
      onSubmit={handleSubmit(onSubmit)}
      // style={{ margin: "3rem auto" }}
    >
      {/* Back Button */}
      <div>
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")} // Navigate back to the previous page
          >
            &larr; Back
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-around">
          <h3>Register</h3>
        </div>
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
        <label>Name of the Organisation</label>
        <input
          className="form-input"
          type="text"
          {...register("OrganisationtName", { required: true })}
        />
        {errors.OrganisationtName && (
          <p className="error-message">Organisation Name is required</p>
        )}
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>Contact Name 1 (First Name)</label>
        <input
          className="form-input"
          type="text"
          {...register("CNameFN", { required: true })}
        />
        {errors.CNameFN && (
          <p className="error-message">Contact Name is required</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Contact Name 1 (Last Name)</label>
        <input
          className="form-input"
          type="text"
          {...register("CNameLN", { required: true })}
        />
        {errors.CNameLN && (
          <p className="error-message">Contact Name is required</p>
        )}
      </div>
      {/* First Name */}
      <div className="form-group">
        <label>Contact Name 2 (First Name)</label>
        <input
          className="form-input"
          type="text"
          {...register("CNameFN2", { required: false })}
        />
        {/* {errors.lastName && (
          <p className="error-message">Last Name is required</p>
        )} */}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Contact Name 2 (Last Name)</label>
        <input
          className="form-input"
          type="text"
          {...register("CNameLN2", { required: false })}
        />
        {/* {errors.CNameLN2 && (
          <p className="error-message">Last Name is required</p>
        )} */}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email ID 1</label>
        <input
          className="form-input"
          type="email"
          {...register("emailID1", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          })}
        />
        {errors.emailID1 && <p className="error-message"> Email is required</p>}
      </div>

      {/* Email2 */}
      <div className="form-group">
        <label>Email ID 2</label>
        <input
          className="form-input"
          type="email"
          {...register("emailID2", {
            required: false,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          })}
        />
        {errors.emailID2 && <p className="error-message"> Email is required</p>}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Contact Number 1</label>
        <input
          className="form-input"
          type="tel"
          value={phoneNumber1} // Use controlled input for Phone Number 1
          onInput={handleInput1}
          onBlur={() => handleBlur(phoneNumber1, setPhoneNumber1)} // Ensure correct format on blur
          {...register("phoneNumber1", {
            required: true,
            pattern: {
              value: /^(?:\+91)[123456789]\d{9}$/, // Adjust regex for validation
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.phoneNumber1 && (
          <p className="error-message">Contact Number 1 is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Contact Number 2</label>
        <input
          className="form-input"
          type="tel"
          value={phoneNumber2} // Use controlled input for Phone Number 2
          onInput={handleInput2}
          onBlur={() => handleBlur(phoneNumber2, setPhoneNumber2)} // Ensure correct format on blur
          {...register("phoneNumber2", {
            required: true,
            pattern: {
              value: /^(?:\+91)[123456789]\d{9}$/, // Adjust regex for validation
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.phoneNumber2 && (
          <p className="error-message">Contact Number 2 is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Location</label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          className="form-input"
          // defaultValue={location}
          onPlaceSelected={(place) => {
            if (place.geometry) {
              setValue("address", place.formatted_address);
              setValue("lat", String(place.geometry.location.lat())); // Convert to string
              setValue("lon", String(place.geometry.location.lng())); // Convert to string
            }
          }}
          options={{
            types: ["establishment"],
            componentRestrictions: { country: "IN" },
          }}
        />

        {errors.address && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: false })} />
      <input type="hidden" {...register("lon", { required: false })} />

      {/* Terms and Conditions */}
      <div className="text-start">
        <input
          type="checkbox"
          {...register("terms", { required: true })}
          className="form-checkbox"
        />
        <label>
          I have read and agree to the <Link to="/terms">terms of service</Link>
          and <Link to="/privacypolicy">privacy policy</Link>
        </label>
        {errors.terms && (
          <p className="error-message">You must agree to the terms</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save
      </button>
      <p className="login-option text-center">
        Already have an account?
        <Link to="/login/bloodbank" className="login-link">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Registerbloodbank;
