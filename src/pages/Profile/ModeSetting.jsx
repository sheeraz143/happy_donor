import { useDispatch, useSelector } from "react-redux";
import { toggleLightMode, toggleDarkMode } from "../../redux/themeSlice";

export default function ModeSetting() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const toggleMode = (selectedMode) => {
    if (selectedMode === "Light") {
      dispatch(toggleLightMode());
    } else if (selectedMode === "Dark") {
      dispatch(toggleDarkMode());
    }
  };

  return (
    <div className="form-container mb-5">
      <h3>Mode Setting</h3>
      <div className="switch-container">
        <label className="switch-label">Light Mode</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={!darkMode}
            onChange={() => toggleMode("Light")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="switch-container">
        <label className="switch-label">Dark Mode</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => toggleMode("Dark")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}
