import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function SelectLanguage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    navigate("#");
  };
  return (
    <form className="form-container mb-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Availability Toggle Switch */}
      <h3>Choose Your language</h3>
      <div className=" switch-container">
        <label className="switch-label">English</label>
        <label className="switch">
          <input
            type="radio"
            value="English"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Tamil</label>
        <label className="switch">
          <input
            type="radio"
            value="Tamil"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Telugu</label>
        <label className="switch">
          <input
            type="radio"
            value="Telugu"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">kanada</label>
        <label className="switch">
          <input
            type="radio"
            value="kanada"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Gujarati</label>
        <label className="switch">
          <input
            type="radio"
            value="Gujarati"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Hindhi</label>
        <label className="switch">
          <input
            type="radio"
            value="Hindhi"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Marathi</label>
        <label className="switch">
          <input
            type="radio"
            value="Marathi"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save Changes
      </button>
    </form>
  );
}
