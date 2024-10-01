import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function ContributeFund() {
  const navigate = useNavigate();
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
        <h3>Contribute Funds</h3>
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

      <div className="form-group">
        <label>Gender</label>
        <select
          className="form-input"
          {...register("title", { required: true })}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="FeMale">FeMale</option>
          <option value="Others">Others</option>
        </select>
        {errors.title && <p className="error-message">Title is required</p>}
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

      {/* Amount */}
      <div className="form-group">
        <label>Amount</label>
        <select
          className="form-input"
          {...register("Amount", { required: true })}
        >
          <option value="">Select</option>
          <option value="HappyDonarTrust">Happy Donar Trust</option>
        </select>
        {errors.title && <p className="error-message">Topic is required</p>}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Pay Online
      </button>
    </form>
  );
}
