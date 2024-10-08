import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function WriteToUs() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    navigate("#");
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
          type="number"
          {...register("phoneNumber", {
            required: true,
            pattern: /^[0-9]{10}$/,
          })}
        />
        {errors.phoneNumber && (
          <p className="error-message">Contact Number is required</p>
        )}
      </div>

      {/* Location */}
      <div className="form-group">
        <label>Topic</label>
        <select
          className="form-input"
          {...register("topic", { required: true })}
        >
          <option value="">Select</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
        {errors.topic && <p className="error-message">Topic is required</p>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Comments if any</label>
        <textarea
          className="form-input"
          type="text"
          {...register("comments")}
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
