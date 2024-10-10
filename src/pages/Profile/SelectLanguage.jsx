import { useForm } from "react-hook-form";
import "../../css/ProfilePage.css"; // Import the CSS file
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function SelectLanguage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top of the page on component mount
    window.scrollTo(0, 0);

    // Translation initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: "ta,te,ml,hi,kn,en",
        },
        "google_translate_element"
      );
    };

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component is unmounted
      document.head.removeChild(script);
    };
  }, []);

  const { register, handleSubmit } = useForm();

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log(data);
    navigate("/viewprofile"); // Navigate after form submission
  };

  return (
    <form className="form-container mb-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Availability Toggle Switch */}
      <h3>Choose Your Language</h3>
      <div className="switch-container">
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
      <div className="switch-container">
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
      <div className="switch-container">
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
      <div className="switch-container">
        <label className="switch-label">Kannada</label>
        <label className="switch">
          <input
            type="radio"
            value="Kannada"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="switch-container">
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
      <div className="switch-container">
        <label className="switch-label">Hindi</label>
        <label className="switch">
          <input
            type="radio"
            value="Hindi"
            {...register("language")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="switch-container">
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

      <div id="google_translate_element"></div>
    </form>
  );
}