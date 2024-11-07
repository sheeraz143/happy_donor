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
import { useLocation, useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";
import { useEffect, useState } from "react";
import helper from "../../Helper/axiosHelper";
import { paymentInitiate, paymentStatus, setLoader } from "../../redux/product";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function ContributeFund() {
  const razorKey = helper.razorPayKey();
  // console.log("razorKey: ", razorKey);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const eventData = location?.state?.request || {};
  console.log("eventData: ", eventData);
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
    const modifiedData = {
      ...data,
      event_id: eventData?.id,
    };

    dispatch(setLoader(true));

    try {
      dispatch(
        paymentInitiate(modifiedData, (res) => {
          console.log("res: ", res);
          if (res.code === 201) {
            const transaction_id = res.transaction_id;
            // console.log("transaction_id: ", transaction_id);
            const amountInPaise = Math.max(Math.round(data.amount * 100), 100); // Ensure amount in paise and minimum of ₹1

            const options = {
              key: razorKey,
              amount: amountInPaise,
              currency: "INR",
              name: "Happy Donors NGO",
              description: "Donation",
              order_id: res.order_id,
              handler: () => {
                // console.log("response handler: ", response);
                dispatch(setLoader(true));
                const paymentStatusData = {
                  transaction_id,
                  status: "success",
                };
                // console.log("paymentStatusData: ", paymentStatusData);
                dispatch(
                  paymentStatus(paymentStatusData, (statusRes) => {
                    if (statusRes.code === 200) {
                      toast.success(statusRes.message);
                      navigate("/bloodcamps");
                    } else {
                      toast.error(statusRes.message);
                    }
                    dispatch(setLoader(false));
                  })
                );
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
                  dispatch(setLoader(false));
                },
              },
              theme: {
                color: "#3399cc",
              },
            };

            if (Razorpay) {
              try {
                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();
              } catch (error) {
                console.error("Razorpay initialization error:", error);
                toast.error("Something went wrong while initiating payment.");
                dispatch(setLoader(false));
              }
            } else {
              toast.error("Razorpay SDK is not available");
              dispatch(setLoader(false));
            }
          } else {
            toast.error(res.message);
            dispatch(setLoader(false));
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "Error initiating payment");
      dispatch(setLoader(false));
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
          {...register("name", { required: true })}
        />
        {errors.name && <p className="error-message">First Name is required</p>}
      </div>

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
        {errors.gender && <p className="error-message">Title is required</p>}
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
          {...register("contact", {
            required: true,
            pattern: {
              // value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.contact && (
          <p className="error-message">Phone Number is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          {...register("amount", { required: true })}
          className="form-input"
        />
        {/* <select className="form-input">
          <option value="">Select</option>
          <option value="1">1 INR</option>
          <option value="500">500 INR</option>
          <option value="1000">1000 INR</option>
          <option value="2000">2000 INR</option>
        </select> */}
        {errors.amount && <p className="error-message">Amount is required</p>}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={loading || isLoading}
      >
        {loading ? "Loading Razorpay..." : "Pay Online"}
      </button>

      {error && (
        <p className="error-message">Error loading Razorpay: {error}</p>
      )}
    </form>
  );
}
