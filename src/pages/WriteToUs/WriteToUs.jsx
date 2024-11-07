import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getProfile, setLoader, writeToUs } from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function WriteToUs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const handleInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Ensure +91 prefix
    if (!value.startsWith("91")) {
      value = `91${value}`; // Keep 91 prefix
    }

    if (value.startsWith("91")) {
      value = `+91${value.slice(2, 12)}`; // Format as +91 XXXXXXXXXX
    }

    // Limit to 10 digits after +91
    if (value.length > 13) {
      setError("mobile", {
        type: "manual",
        message: "Phone Number must be 10 digits",
      });
    } else {
      clearErrors("mobile");
    }

    // Update the state to keep the input controlled
    e.target.value = value; // Reflect the value in the input
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setLoader(true)); // Start loading
    try {
      dispatch(
        getProfile((res) => {
          const user = res?.user;
          setValue("title", user?.title);
          setValue("first_name", user?.first_name);
          setValue("last_name", user?.last_name);
          setValue("mobile", user?.phone_number);
          setValue("email", user?.email);

          // setOriginalData(user);

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

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    dispatch(setLoader(true));
    try {
      dispatch(
        writeToUs(data, (res) => {
          dispatch(setLoader(false));

          // Check for response status
          if (res.code === 201) {
            toast.success(res.message);
            navigate("/home");
          } else {
            const errorMessages = res.message || "An error occurred.";
            toast.error(errorMessages);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false)); // Stop loading
    }
  };

  return (
    <form
      className="form-container mt-5 mb-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Title */}
      <div className="d-flex align-items-center justify-content-around">
        <h3>Write to us</h3>
      </div>
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

      {/* Contact Number */}
      <div className="form-group">
        <label>Contact Number</label>
        <input
          className="form-input"
          type="tel"
          onInput={handleInput}
          {...register("mobile", {
            required: "Phone Number is required",
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              message: "Phone Number must be 10 digits",
            },
            validate: (value) => {
              if (!value.startsWith("+91") || value.length !== 13) {
                return "Phone Number must start with +91 and be 10 digits long";
              }
            },
          })}
        />
        {errors.mobile && (
          <p className="error-message">{errors.mobile.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>Topic</label>
        <select
          className="form-input"
          {...register("topic", { required: true })}
        >
          <option value="">Select</option>
          <option value="Query">Query</option>
          <option value="Feedbacks">Feedbacks</option>
          <option value="Suggestions">Suggestions</option>
          <option value="Experience">Experience</option>
          <option value="Others">Others</option>
        </select>
        {errors.topic && <p className="error-message">Topic is required</p>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Comments if any</label>
        <textarea
          className="form-input"
          type="text"
          {...register("comments", { required: false })}
        />
        {/* {errors.address && <p className="error-message">Address is required</p>} */}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Submit Feedback
      </button>
    </form>
  );
}
