// import { Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

export default function SimpleBackdrop() {
  const loader = useSelector((state) => state.product.loader);

  return (
    <div>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column", // Center elements vertically
          alignItems: "center",
        }}
        open={loader}
      >
        {/* Larger circular progress with a custom color */}
        <CircularProgress color="primary" size={80} thickness={4.5} />
      </Backdrop>
    </div>
  );
}
