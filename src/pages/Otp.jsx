import { useState } from "react";
import "../css/OTPVerificationComponent.css"; // Import the CSS file
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoader, verifytOTP } from "../redux/product";

const OTPVerificationComponent = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const phoneNum = location.state?.inputValue || {};

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Restrict to numbers only
    if (value.length > 1) return; // Prevent more than one digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus on next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleResend = () => {
    alert("Resend code");
  };

  const handleVerify = () => {
    dispatch(setLoader(true));
    const otpString = otp.join("");

    const data = {
      phone_number: phoneNum,
      otp_code: otpString,
    };

    // console.log("data: ", data);
    // return;
    try {
      dispatch(
        verifytOTP(data, (res) => {
          console.log("res: ", res);
          if (res.code === 403) {
            const errorMessage = res.error.otp_code;
            console.log("errorMessage: ", errorMessage[0]);
            toast.error(errorMessage[0]);
          } else {
            // Handle success
            toast.success(res.message);
            navigate("/profile");
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
            className="otp-input"
          />
        ))}
      </div>

      <button className="verify-button" onClick={handleVerify}>
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
