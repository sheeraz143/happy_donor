import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "../../css/LoginComponent.css";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoader, OrgLogin } from "../../redux/product";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginBloodBank = ({ onRefreshNavbar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [inputValue, setInputValue] = useState("+91");
  // const [isOrganizationLogin, setIsOrganizationLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const auth = localStorage.getItem("oAuth");
    const token = localStorage.getItem("fcmToken");
    setFcmToken(token);
    if (auth) {
      navigate("/home");
    } else {
      navigate("/login/bloodbank");
    }
  }, []);

  const onSubmit = () => {
    if (!email) {
      toast.error("Email cannot be empty");
      return;
    }
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Organization login API call
    dispatch(setLoader(true));
    const orgData = {
      email,
      password,
      fcmToken,
    };
    try {
      dispatch(
        OrgLogin(orgData, (res) => {
          // return;
          if (res.code === 200) {
            localStorage.setItem("user_type", res.data?.user_type);
            localStorage.setItem(
              "is_profile_update",
              res?.data?.is_profile_update
            );
            localStorage.setItem("oAuth", `Bearer ${res?.data?.token}`);
            navigate("/home");
            toast.success(res.message);
            onRefreshNavbar();
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message);
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Happy Donors" className="donar-logo" />
      {/* <h2 className="welcomeText">Welcome Back! Saving Lives Starts Here</h2> */}

      <div className="inputContainer flex-column col-lg-4">
        <h2 className="welcomeText">Blood Bank Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <div className="passwordContainer w-100">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />
          <span
            className="eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p className="login-option align-self-end mt-2">
          <Link
            to="/forgotpassword/bloodbank"
            className="forgot-password-link"
          >
            Forgot Password?
          </Link>
        </p>
        <button className="button" onClick={onSubmit}>
          Login
        </button>
        <p className="login-option text-center mt-3">
          Dont have an account?
          <Link to="/register/bloodbank" className="login-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

LoginBloodBank.propTypes = {
  onRefreshNavbar: PropTypes.func.isRequired,
};
export default LoginBloodBank;
