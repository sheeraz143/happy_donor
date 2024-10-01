import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Tost() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}

export default Tost;
