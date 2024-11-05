import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "../css/LoginComponent.css";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoader, requestOTP } from "../redux/product";

const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("+91");

  useEffect(() => {
    const auth = localStorage.getItem("oAuth");

    if (auth) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    // If the input value doesn't start with +91, add it
    if (!value.startsWith("+91")) {
      value = "+91" + value.replace(/^\+?91/, "");
    }
    // Allow only numbers and limit to 13 characters (including +91)
    if (/^\+91\d{0,10}$/.test(value)) {
      setInputValue(value);
    }
  };

  const onSubmit = () => {
    if (inputValue.trim() === "+91") {
      toast.error("Phone number cannot be empty");
      return;
    }
    if (inputValue.length !== 13) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    dispatch(setLoader(true)); // Start loading
    const number = {
      phone_number: inputValue,
    };
    try {
      dispatch(
        requestOTP(number, (res) => {
          if (res.errors) {
            toast.error(res.errors);
          } else {
            // Handle success
            toast.success(res.message);
            navigate("/otp", { state: { inputValue } });
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      // Handle unexpected errors
      toast.error(error.message);
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Happy Donors" className="donar-logo" />
      <h2 className="welcomeText">Welcome Back! Saving Lives Starts Here</h2>

      <div className="inputContainer">
        <span className="icon">📞</span>
        <input
          className="input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter up to 10 digits"
          style={{ margin: "0", border: "unset", padding: "0" }}
        />
      </div>

      <button className="button" onClick={onSubmit}>
        Get OTP
      </button>
    </div>
  );
};

export default LoginComponent;
