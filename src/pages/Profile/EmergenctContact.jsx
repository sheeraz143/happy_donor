import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function EmergenctContact() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    navigate("/home");
  };

  return (
    <form className="form-container mb-5 mt-3" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="d-flex align-items-center justify-content-around">
        <h3>Emergency Contact</h3>
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-input"
          type="text"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && (
          <p className="error-message">First Name is required</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Contact Details</label>
        <input
          className="form-input"
          type="tel"
          {...register("phoneNumber", {
            required: true,
            pattern: /^[0-9]{10}$/,
          })}
        />
        {errors.phoneNumber && (
          <p className="error-message">Valid Phone Number is required</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save Changes
      </button>
    </form>
  );
}
