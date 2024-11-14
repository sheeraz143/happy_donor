import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  fundInitiate,
  fundStatus,
  getProfile,
  setLoader,
} from "../../redux/product";
import { useDispatch } from "react-redux";
import helper from "../../Helper/axiosHelper";
import { useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";

export default function FundDonation() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("+91 "); // Default value with +91
  const razorKey = helper.razorPayKey();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
          setValue("gender", user?.gender);
          setPhoneNumber(user?.phone_number);

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

  const onSubmit = (data) => {
    dispatch(setLoader(true));
    try {
      dispatch(
        fundInitiate(data, (res) => {
          if (res.code === 200) {
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
              handler: (res) => {
                dispatch(setLoader(true));
                const paymentStatusData = {
                  transaction_id: transaction_id,
                  razorpay_payment_id: res?.razorpay_payment_id,
                  razorpay_order_id: res?.razorpay_order_id,
                  razorpay_signature: res?.razorpay_signature,
                  response: res,
                  status: "success",
                };

                dispatch(
                  fundStatus(paymentStatusData, (statusRes) => {
                    if (statusRes.code === 200) {
                      toast.success(statusRes.message);
                      navigate("/home");
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
                  // setLoading(false);
                  dispatch(setLoader(false));
                  dispatch(setLoader(true));
                  const paymentStatusData = {
                    transaction_id,
                    status: "failed",
                  };
                  dispatch(
                    fundStatus(paymentStatusData, (statusRes) => {
                      if (statusRes.code === 200) {
                        toast.success(statusRes.message);
                        navigate("/home");
                      } else {
                        toast.error(statusRes.message);
                      }
                      dispatch(setLoader(false));
                    })
                  );
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
      {/* Title */}
      <div className="d-flex align-items-center justify-content-around">
        <h3>
          Fund Donation <span className="required-asterisk">*</span>
        </h3>
      </div>
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
          {...register("first_name", { required: true })}
        />
        {errors.first_name && (
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
          {...register("last_name", { required: true })}
        />
        {errors.last_name && (
          <p className="error-message">Last Name is required</p>
        )}
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
        {errors.gender && <p className="error-message">Gender is required</p>}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          className="form-input"
          type="tel"
          value={phoneNumber} // Use controlled input
          onInput={handleInput}
          onBlur={handleBlur}
          {...register("mobile", {
            required: true,
            pattern: {
              // value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              message: "Invalid phone number format",
            },
          })}
        />
        {errors.mobile && (
          <p className="error-message">Phone Number is required</p>
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

      {/* Amount */}
      <div className="form-group">
        <label>
          Donate For <span className="required-asterisk">*</span>
        </label>
        <select
          className="form-input"
          {...register("donate_for", { required: true })}
        >
          <option value="">Select</option>
          <option value="Happy Donors Trust">Happy Donar Trust</option>
          <option value="Recent Series">Recent Series</option>
          <option value="Camps/Events">Camps/Events</option>
          <option value="CSR Contribution">CSR Contribution</option>
        </select>
        {errors.donate_for && (
          <p className="error-message">Donate For is required</p>
        )}
      </div>

      {/* Donate for */}
      <div className="form-group">
        <label>
          Amount <span className="required-asterisk">*</span>
        </label>
        <input
          className="form-input"
          type="text"
          {...register("amount", { required: true })}
        />
        {errors.amount && <p className="error-message">Amount is required</p>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Comments if any</label>
        <textarea
          className="form-input"
          type="text"
          {...register("comments")}
        />
        {/* {errors.comments && <p className="error-message">Address is required</p>} */}
      </div>

      {/*pan*/}
      <div className="form-group">
        <label>
          PAN[For 80G] <span className="required-asterisk">*</span>
        </label>
        <input
          className="form-input"
          type="text"
          {...register("pan", { required: true })}
        />
        {errors.pan && <p className="error-message">PAN is required</p>}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Pay Online
      </button>
    </form>
  );
}
