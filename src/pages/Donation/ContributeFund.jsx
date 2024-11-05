// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router";

// export default function ContributeFund() {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   // Function to handle form submission
//   const onSubmit = (data) => {
//     console.log(data);
//     navigate("#");
//   };

//   return (
//     <form
//       className="form-container mt-5 mb-5"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       {/* Title */}
//       <div className="d-flex align-items-center justify-content-around">
//         <h3>Contribute Funds</h3>
//       </div>

//       {/* First Name */}
//       <div className="form-group">
//         <label>Name</label>
//         <input
//           className="form-input"
//           type="text"
//           {...register("firstName", { required: true })}
//         />
//         {errors.firstName && (
//           <p className="error-message">First Name is required</p>
//         )}
//       </div>

//       <div className="form-group">
//         <label>Gender</label>
//         <select
//           className="form-input"
//           {...register("title", { required: true })}
//         >
//           <option value="">Select</option>
//           <option value="Male">Male</option>
//           <option value="FeMale">FeMale</option>
//           <option value="Others">Others</option>
//         </select>
//         {errors.title && <p className="error-message">Title is required</p>}
//       </div>

//       {/* Email */}
//       <div className="form-group">
//         <label>Email</label>
//         <input
//           className="form-input"
//           type="email"
//           {...register("email", {
//             required: true,
//             pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//           })}
//         />
//         {errors.email && <p className="error-message"> Email is required</p>}
//       </div>

//       {/* Contact Number */}
//       <div className="form-group">
//         <label>Contact Details</label>
//         <input
//           className="form-input"
//           type="tel"
//           {...register("phoneNumber", {
//             required: true,
//             pattern: /^[0-9]{10}$/,
//           })}
//         />
//         {errors.phoneNumber && (
//           <p className="error-message">Valid Phone Number is required</p>
//         )}
//       </div>

//       {/* Amount */}
//       <div className="form-group">
//         <label>Amount</label>
//         <select
//           className="form-input"
//           {...register("Amount", { required: true })}
//         >
//           <option value="">Select</option>
//           <option value="HappyDonarTrust">Happy Donar Trust</option>
//         </select>
//         {errors.title && <p className="error-message">Topic is required</p>}
//       </div>

//       {/* Submit Button */}
//       <button type="submit" className="submit-button">
//         Pay Online
//       </button>
//     </form>
//   );
// }

// import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";
import { useEffect, useState } from "react";

export default function ContributeFund() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { error, isLoading, Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("+91 "); // Default value with +91

  useEffect(() => {
    // Set default value when the component mounts
    setPhoneNumber("+91 ");
  }, []);

  const handleInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Restore +91 if the user tries to delete it
    if (!value.startsWith("91")) {
      value = `91${value}`; // Keep +91 prefix
    }

    if (value.startsWith("91")) {
      value = `+91${value.slice(2, 12)}`; // Format as +91 XXXXXXXXXX
      console.log('value: ', value);
    }

    // Limit to 10 digits after +91
    if (value.length > 13) {
      value = value.slice(0, 14); // +91 followed by 10 digits
    }

    // Update the state to keep the input controlled
    setPhoneNumber(value);
    e.target.value = value; // Reflect the value in the input
  };

  const handleBlur = () => {
    // Ensure the value is always in the correct format on blur
    if (!phoneNumber.startsWith("+91")) {
      setPhoneNumber("+91 " + phoneNumber.replace(/^\D+/g, "").slice(0, 10)); // Ensure it starts with +91
    }
  };
  // Function to handle form submission
  const onSubmit = async (data) => {
    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Replace with your test Key ID
      amount: data.amount * 100, // Amount in paisa
      currency: "INR",
      name: "Happy Donors NGO",
      description: "Donation",
      // order_id: "order_9A33XWu170gUtm", // This should come from your server
      handler: (response) => {
        console.log("Payment successful", response);
        alert("Payment Successful!");
        setLoading(false); // Stop loading
        navigate("#");
      },
      prefill: {
        name: data.firstName,
        email: data.email,
        contact: data.phoneNumber,
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal closed");
          setLoading(false);
        },
      },
      theme: {
        color: "#3399cc",
      },
    };

    if (Razorpay) {
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } else {
      setLoading(false); // Reset loading if Razorpay is not available
    }
  };

  return (
    <form
      className="form-container mt-5 mb-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="d-flex align-items-center justify-content-around">
        <h3>Contribute Funds</h3>
      </div>

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
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        {errors.title && <p className="error-message">Title is required</p>}
      </div>

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
        {errors.email && <p className="error-message">Email is required</p>}
      </div>

      {/* <div className="form-group">
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
      </div> */}
      <div className="form-group">
        <label>Phone Number</label>
        <input
          className="form-input"
          type="tel"
          value={phoneNumber} // Use controlled input
          onInput={handleInput}
          onBlur={handleBlur}
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

      <div className="form-group">
        <label>Amount</label>
        <select
          className="form-input"
          {...register("amount", { required: true })}
        >
          <option value="">Select</option>
          <option value="1">1 INR</option>
          <option value="500">500 INR</option>
          <option value="1000">1000 INR</option>
          <option value="2000">2000 INR</option>
        </select>
        {errors.amount && <p className="error-message">Amount is required</p>}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={loading || isLoading}
      >
        {loading  ? "Loading Razorpay..." : "Pay Online"}
      </button>

      {error && (
        <p className="error-message">Error loading Razorpay: {error}</p>
      )}
    </form>
  );
}
