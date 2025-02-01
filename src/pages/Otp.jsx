import { useState } from "react";
import "../css/OTPVerificationComponent.css"; // Import the CSS file
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { requestOTP, setLoader, verifytOTP } from "../redux/product";

const OTPVerificationComponent = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const phoneNum = location.state?.inputValue || {};
  const fcmToken = localStorage.getItem("fcmToken");

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Restrict to numbers only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if there is a value
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // const handleBackspace = (e, index) => {
  //   if (e.key === "Backspace" && !otp[index] && index > 0) {
  //     // Move focus to the previous input if it's empty
  //     document.getElementById(`otp-input-${index - 1}`).focus();
  //   }
  // };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input if it's empty
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (e.key === "Delete") {
      // Clear the current input field on Delete key press
      let newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleResend = () => {
    // Clear the OTP fields
    setOtp(new Array(4).fill(""));

    const data = {
      phone_number: phoneNum,
    };
    try {
      dispatch(
        requestOTP(data, (res) => {
          if (res.errors) {
            toast.error(res.errors);
          } else {
            toast.success(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message);
      dispatch(setLoader(false));
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");

    if (otp.some((digit) => digit === "")) {
      toast.error("All OTP fields must be filled");
      return;
    }

    if (otpString.length !== 4) {
      toast.error("OTP must be 4 digits");
      return;
    }

    dispatch(setLoader(true));
    const data = {
      phone_number: phoneNum,
      otp_code: otpString,
      fcm_token: fcmToken,
    };

    try {
      dispatch(
        verifytOTP(data, (res) => {
          if (res.code === 200) {
            localStorage.setItem("user_type", res.user_type);
            localStorage.setItem("is_profile_update", res.is_profile_update);
            localStorage.setItem("oAuth", `Bearer ${res.token}`);
            toast.success("OTP verified successfully");
            if (res.is_profile_update === 0) {
              navigate("/profile");
            } else {
              navigate("/home");
            }
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="container">
      <h2 className="title">OTP Verification</h2>
      <p className="subtitle">
        Enter the verification code we just sent on your Registered Mobile
        Number.
      </p>

      {/* OTP Input Fields */}
      <div className="otp-container">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            id={`otp-input-${index}`}
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => {
              handleKeyDown(e); // Handle Enter key to submit
              handleBackspace(e, index); // Handle Backspace for moving focus
            }}
            className="otp-input"
          />
        ))}
      </div>

      <button className="verify-button" type="submit" onClick={handleVerify}>
        Verify
      </button>

      <p className="resend-text">
        Didn’t receive code?{" "}
        <span className="resend-link" onClick={handleResend}>
          Resend
        </span>
      </p>
    </div>
  );
};

export default OTPVerificationComponent;
