import { useForm } from "react-hook-form";
import logo from "../assets/logo.png";
import "../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { registerOrg, setLoader } from "../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
// import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterOrg = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phoneNumber1, setPhoneNumber1] = useState("+91");
  const [phoneNumber2, setPhoneNumber2] = useState("+91");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [showSpecifyInput, setShowSpecifyInput] = useState(false);

  const handleCollaborationChange = (event) => {
    // Clear errors for both fields whenever a new selection is made
    clearErrors("collaborate_as");
    clearErrors("specify_others");
    setShowSpecifyInput(event.target.value === "Others");
  };

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
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
        organisation_name: data?.organisation_name,
        contact1_first_name: data?.contact1_first_name,
        contact1_last_name: data?.contact1_last_name,
        contact2_first_name: data?.contact2_first_name,
        contact2_last_name: data?.contact2_last_name,
        email1: data?.email1,
        email2: data?.email2,
        contact_number1: data?.phoneNumber1,
        contact_number2: data?.phoneNumber2,
        landline: data?.landline,
        location: data?.location,
        lat: data?.lat,
        lon: data?.lat,
        terms: true,
        password: data?.password,
        password_confirmation: data?.password,
        user_type_id: 5,
        collaborate_as: data?.collaborate_as,
        other_collaborate_as: data?.specify_others,
      };

      // console.log("payload: ", payload);
      // return;

      dispatch(
        registerOrg(payload, (res) => {
          if (res.code === 201) {
            // Handle success
            toast.success(res.message);
            navigate("/login/organisation");
          } else {
            // Check if there are validation errors
            if (res.error) {
              const errorMessages = Object.values(res.error).flat().join(", "); // Flatten the array of error messages and join them
              toast.error(errorMessages); // Show all errors in a single toast
            } else {
              toast.error(res.message); // Fallback error message
            }
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
    <>
      <div className="d-flex align-items-center flex-column">
        <img src={logo} alt="Happy Donors" className="donar-logo mt-3" />
        <form
          className="form-container"
          onSubmit={handleSubmit(onSubmit)}
          // style={{ margin: "3rem auto" }}
        >
          <h2 className="welcomeText mx-2">Organisation Registration</h2>
          {/* Back Button */}
          {/* <div>
            <div className="d-flex justify-content-start">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
              >
                <FaArrowLeft style={{ fontSize: "15px", marginRight: "8px" }} />
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-around">
              <h3>Register</h3>
            </div>
          </div> */}

          <div className="form-group">
            <label>
              Name of the Organisation
              <span className="required-asterisk">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              {...register("organisation_name", { required: true })}
            />
            {errors.organisation_name && (
              <p className="error-message">Organisation Name is required</p>
            )}
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
              Contact Name 1 (First Name){" "}
              <span className="required-asterisk">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              {...register("contact1_first_name", { required: true })}
            />
            {errors.contact1_first_name && (
              <p className="error-message">Contact Name is required</p>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>
              Contact Name 1 (Last Name)
              <span className="required-asterisk">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              {...register("contact1_last_name", { required: true })}
            />
            {errors.contact1_last_name && (
              <p className="error-message">Contact Name is required</p>
            )}
          </div>
          {/* First Name */}
          <div className="form-group">
            <label>Contact Name 2 (First Name)</label>
            <input
              className="form-input"
              type="text"
              {...register("contact2_first_name", { required: false })}
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
              {...register("contact2_last_name", { required: false })}
            />
            {/* {errors.CNameLN2 && (
          <p className="error-message">Last Name is required</p>
        )} */}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email ID 1 <span className="required-asterisk">*</span>
            </label>
            <input
              className="form-input"
              type="email"
              {...register("email1", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
            />
            {errors.email1 && (
              <p className="error-message"> Email is required</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group password-group">
            <label>
              Password <span className="required-asterisk">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Email2 */}
          <div className="form-group">
            <label>Email ID 2</label>
            <input
              className="form-input"
              type="email"
              {...register("email2", {
                required: false,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
            />
            {errors.email2 && (
              <p className="error-message"> Email is required</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>
              Contact Number 1 <span className="required-asterisk">*</span>
            </label>
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
            <label>
              Contact Number 2 <span className="required-asterisk">*</span>
            </label>
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

          {/* Landline Number */}
          <div className="form-group">
            <label>Landline Number</label>
            <input
              className="form-input"
              type="tel"
              {...register("landline", {
                required: false,
                // pattern: {
                //   value: /^[0-9]{10}$/,
                //   message: "Please enter a valid 10-digit landline number",
                // },
              })}
            />
            {/* {errors.landline && (
            <p className="error-message">{errors.landline.message}</p>
          )} */}
          </div>

          <div className="form-group">
            <label>Location</label>

            <Autocomplete
              apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
              className="form-input"
              // defaultValue={location}
              onPlaceSelected={(place) => {
                if (place.geometry) {
                  setValue("location", place.formatted_address, {
                    shouldValidate: true,
                  });
                  setValue("lat", String(place.geometry.location.lat()), {
                    shouldValidate: true,
                  });
                  setValue("lon", String(place.geometry.location.lng()), {
                    shouldValidate: true,
                  });
                  trigger(["location", "lat", "lon"]); // Manually trigger validation
                }
              }}
              options={{
                types: ["establishment"],
                componentRestrictions: { country: "IN" },
              }}
              {...register("location", { required: true })}
            />

            {errors.location && (
              <p className="error-message">Location is required</p>
            )}
          </div>
          <input type="hidden" {...register("lat", { required: false })} />
          <input type="hidden" {...register("lon", { required: false })} />

          {/* Collaborate as */}
          <div className="form-group">
            <label>
              Collaborate as <span className="required-asterisk">*</span>
            </label>
            <select
              className="form-input"
              {...register("collaborate_as", { required: true })}
              onChange={handleCollaborationChange}
            >
              <option value="">Select</option>
              <option value="CSR Partners">CSR Partners</option>
              <option value="Hospital Support">Hospital Support</option>
              <option value="NGO and Local Associations">
                NGO and Local Associations
              </option>
              <option value="Society">Society</option>
              <option value="Others">Others</option>
            </select>
            {errors.collaborate_as && !showSpecifyInput && (
              <p className="error-message">Collaborate as is required</p>
            )}

            {showSpecifyInput && (
              <div className="form-group mt-2">
                <label>
                  Please Specify <span className="required-asterisk">*</span>
                </label>
                <textarea
                  className="form-input"
                  {...register("specify_others", {
                    required: showSpecifyInput, // Required only when "Others" is selected
                  })}
                />
                {errors.specify_others && (
                  <p className="error-message">
                    Please specify your collaboration
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="text-start">
            <input
              type="checkbox"
              {...register("terms", { required: true })}
              className="form-checkbox"
            />
            <label>
              I have read and agree to the{" "}
              <Link to="/terms-and-conditions.html" target="_blank">
                terms of service {" "}
              </Link>
              and {" "}
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
          <p className="login-option text-center">
            Already have an account?{" "}
            <Link to="/login/organisation" className="login-link">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default RegisterOrg;
