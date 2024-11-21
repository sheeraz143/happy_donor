import { useState } from "react";
// import { useDispatch } from "react-redux";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
// import { setLoader } from "../redux/product"; // Update with your actual actions
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  // const [resetToken, setResetToken] = useState(""); // Token provided by the reset email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  // const dispatch = useDispatch();

  const handleSubmit = () => {
    // if (!resetToken) {
    //   toast.error("Reset token is required");
    //   return;
    // }

    if (!newPassword || !confirmPassword) {
      toast.error("Password fields cannot be empty");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // const data = {
    //   token: resetToken,
    //   password: newPassword,
    // };

    // dispatch(setLoader(true));
    // try {
    //   dispatch(
    //     resetPassword(data, (res) => {
    //       if (res.code === 200) {
    //         toast.success("Password reset successfully");
    //       } else {
    //         toast.error(res.message);
    //       }
    //       dispatch(setLoader(false));
    //     })
    //   );
    // } catch (error) {
    //   toast.error(error.message || "Something went wrong");
    //   dispatch(setLoader(false));
    // }
  };

  return (
    <div className="container">
      <img src={logo} alt="Happy Donors" className="donar-logo" />
      <div className="inputContainer flex-column col-lg-4 mx-auto">
        <h4 className="text-center">Reset Password</h4>
        {/* Reset Token */}
        {/* <input
          type="text"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Enter your reset token"
          className="input mt-3"
        /> */}

        {/* New Password */}
        <div className="passwordContainer w-100">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="input"
          />
          <span
            className="eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="passwordContainer w-100">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input"
          />
          <span
            className="eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Submit Button */}
        <button className="button mt-3" onClick={handleSubmit}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
