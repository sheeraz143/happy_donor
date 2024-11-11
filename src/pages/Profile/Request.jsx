import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { requestBlood, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { Link } from "react-router-dom";

function Request() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    trigger,
  } = useForm();

  const handleChange = (e) => {
    let value = e.target.value;

    // Remove non-digit characters and ensure it starts with "+91"
    if (!value.startsWith("+91")) {
      value = "+91" + value.replace(/^\+?91/, "");
    }

    // Extract digits after "+91" prefix
    const digits = value.slice(3).replace(/\D/g, "");

    // Limit to 10 digits after "+91"
    if (digits.length > 10) {
      value = "+91" + digits.slice(0, 10);
    } else {
      value = "+91" + digits;
    }

    // Update the value using setValue
    setValue("mobileNumber", value, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    dispatch(setLoader(true));
    try {
      const payload = {
        title: data?.title,
        patient_first_name: data?.firstName,
        patient_last_name: data?.lastName,
        blood_group: data?.bloodGroup,
        blood_component: data?.bloodComponent,
        quantity_units: data?.Quantity,
        required_date: data?.requiredDate,
        location: data?.address,
        lat: data?.lat,
        lon: data?.lon,
        is_critical: Boolean(data?.critical),
        attender_first_name: data?.attenderFirstName,
        attender_last_name: data?.attenderLasttName,
        mobile_number: data?.mobileNumber,
        willing_to_arrange_transport: Boolean(data?.willing),
        terms_agreed: data?.terms,
      };

      dispatch(
        requestBlood(payload, (res) => {
          if (res.errors) {
            toast.error(res.errors);
          } else {
            // Handle success
            toast.success(res.message);
            navigate("/bloodrequest");
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error);
      dispatch(setLoader(false));
    }
    // navigate("/bloodrequest");
  };
  return (
    <form className="form-container mb-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <h3 style={{ color: "black" }}>Request for blood</h3>
      <div className="form-group">
        <label>Title <span className="required-asterisk">*</span></label>
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
        <label>Patient First Name <span className="required-asterisk">*</span></label>
        <input
          className="form-input"
          type="text"
          // placeholder="Enter Patient First Name"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && (
          <p className="error-message">First Name is required</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Patient Last Name <span className="required-asterisk">*</span></label>
        <input
          className="form-input"
          type="text"
          // placeholder="Enter Patient Last Name"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && (
          <p className="error-message">Last Name is required</p>
        )}
      </div>

      {/* Blood Group */}
      <div className="form-group">
        <label>Blood Group <span className="required-asterisk">*</span></label>
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
          <option value="Any">Any</option>
        </select>
        {errors.bloodGroup && (
          <p className="error-message">Blood Group is required</p>
        )}
      </div>

      {/* Blood Component */}
      <div className="form-group">
        <label>Blood Component <span className="required-asterisk">*</span></label>
        <select
          className="form-input"
          {...register("bloodComponent", { required: true })}
        >
          <option value="">Select</option>
          <option value="WholeBlood">Whole Blood</option>
          <option value="Red Blood Cells">Red Blood Cells</option>
          <option value="Plasma">Plasma</option>
          <option value="Platelets">Platelets</option>
          <option value="Cryoprecipitate">Cryoprecipitate</option>
        </select>
        {errors.bloodComponent && (
          <p className="error-message">Blood Component is required</p>
        )}
      </div>

      {/* Quantity*/}
      <div className="form-group">
        <label>Quantity (Units) <span className="required-asterisk">*</span></label>
        <select
          className="form-input"
          {...register("Quantity", { required: true })}
        >
          <option value="">Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        {errors.Quantity && (
          <p className="error-message">Quantity is required</p>
        )}
      </div>

      {/* Required Date */}
      <div className="form-group">
        <label>Required Date <span className="required-asterisk">*</span></label>
        <input
          className="form-input"
          type="date"
          min={today}
          onFocus={(e) => {
            e.target.showPicker();
          }}
          style={{ cursor: "pointer" }}
          {...register("requiredDate", { required: true })}
        />
        {errors.requiredDate && (
          <p className="error-message">Date is required</p>
        )}
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
      <div className="form-group">
        <label>Location <span className="required-asterisk">*</span></label>
        <Autocomplete
          apiKey="AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0"
          onPlaceSelected={(place) => {
            console.log(place);
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
              trigger(["address", "lat", "lon"]); // Manually trigger validation for these fields
            }
          }}
          className="form-input"
          options={{
            componentRestrictions: { country: "IN" },
            types: ["establishment"],
          }}
          {...register("address", { required: true })}
        />
        {errors.address && (
          <p className="error-message">Location is required</p>
        )}
      </div>
      <input type="hidden" {...register("lat", { required: true })} />
      <input type="hidden" {...register("lon", { required: true })} />

      {/* Critical*/}
      <div className="form-group">
        <label>Emergency?</label>
        <select
          className="form-input"
          {...register("critical", { required: true })}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {errors.critical && <p className="error-message">Field is required</p>}
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>Attender First Name <span className="required-asterisk">*</span></label>
        <input
          className="form-input"
          type="text"
          // placeholder="Enter Attender First Name"
          {...register("attenderFirstName", { required: true })}
        />
        {errors.attenderFirstName && (
          <p className="error-message">First Name is required</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Attender Last Name <span className="required-asterisk">*</span></label>
        <input
          className="form-input"
          type="text"
          // placeholder="Enter Attender Last Name"
          {...register("attenderLasttName", { required: true })}
        />
        {errors.attenderLasttName && (
          <p className="error-message">Last Name is required</p>
        )}
      </div>

      {/* mobile number */}
      <div className="form-group">
        <label>Mobile Number <span className="required-asterisk">*</span></label>
        {/* <input
          className="form-input"
          type="tel"
          // placeholder="Enter Mobile Number"
          {...register("mobileNumber", {
            required: true,
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        /> */}
        <input
          className="form-input"
          type="tel"
          defaultValue="+91"
          {...register("mobileNumber", {
            required: "Mobile Number is required",
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              message: "Invalid phone number format",
            },
            validate: (value) => {
              const digitsOnly = value.replace(/\D/g, "");
              return (
                digitsOnly.length === 12 || "Mobile number must be  10 digits "
              );
            },
          })}
          onChange={handleChange}
        />
        {errors.mobileNumber && (
          <p className="error-message">Mobile Number is required</p>
        )}
      </div>

      {/* Wiiling to transport*/}
      <div className="form-group">
        <label>Wiiling to arrange the transport to the donor? <span className="required-asterisk">*</span></label>
        <select
          className="form-input"
          {...register("willing", { required: true })}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.willing && <p className="error-message">Field is required </p>}
      </div>

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

export default Request;
