import { useState } from "react";
import logo from "../assets/logo.png";
import "../css/LoginComponent.css";
// import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoader, ForgotPassword } from "../redux/product";
import { useParams } from "react-router";

const Forgotpassword = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { type } = useParams();
  console.log("type: ", type);

  // useEffect(() => {
  //   const auth = localStorage.getItem("oAuth");
  //   if (auth) {
  //     navigate("/home");
  //   } else {
  //     navigate("/login/organisation");
  //   }
  // }, []);

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

    // Organization login API call
    dispatch(setLoader(true));
    const orgData = {
      email,
      user_type: type == "organisation" ? 5 : 4,
    };
    // console.log("orgData: ", orgData);
    // return;
    try {
      dispatch(
        ForgotPassword(orgData, (res) => {
          if (res.code === 200) {
            // navigate("/resetpassword");
            toast.success(res.data?.message);
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

      <div className="inputContainer flex-column col-lg-4">
        <h5 className="">Forgot password</h5>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />

        <button className="button" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Forgotpassword;
