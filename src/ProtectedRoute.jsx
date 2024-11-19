import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const auth = localStorage.getItem("oAuth");

  return auth ? <Outlet /> : <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
};

// ProtectedRoute.defaultProps = {
//   redirectPath: "/",
// };

export default ProtectedRoute;
