import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function NotificationSettings() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = () => {
    // const formattedData = {
    //   newdonation: !!data.newdonation,
    //   newcampalert: !!data.newcampalert,
    //   adminnotification: !!data.adminnotification,
    //   newdonationSMS: !!data.newdonationSMS,
    //   newcampalertSMS: !!data.newcampalertSMS,
    //   adminnotificationSMS: !!data.adminnotificationSMS,
    // };

    navigate("#");
  };

  return (
    <form className="form-container mb-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Availability Toggle Switch */}
      <h3>Notification Settings</h3>
      <h5 className="text-start">Push Notifications</h5>
      <div className=" switch-container">
        <label className="switch-label">New Donation Request</label>
        <label className="switch">
          <input
            type="checkbox"
            value="newdonation"
            {...register("newdonation")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">New Camp Alert</label>
        <label className="switch">
          <input
            type="checkbox"
            value="newcampalert"
            {...register("newcampalert")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Admin Notifications</label>
        <label className="switch">
          <input
            type="checkbox"
            value="adminnotification"
            {...register("adminnotification")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      {/* <h5 className="text-start">SMS Notifications</h5>
      <div className=" switch-container">
        <label className="switch-label">New Donation Request</label>
        <label className="switch">
          <input
            type="checkbox"
            value="newdonationSMS"
            {...register("newdonationSMS")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">New Camp Alert</label>
        <label className="switch">
          <input
            type="checkbox"
            value="newcampalertSMS"
            {...register("newcampalertSMS")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className=" switch-container">
        <label className="switch-label">Admin Notifications</label>
        <label className="switch">
          <input
            type="checkbox"
            value="adminnotificationSMS"
            {...register("adminnotificationSMS")}
            className="switch-input"
          />
          <span className="slider round"></span>
        </label>
      </div> */}

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save Changes
      </button>
    </form>
  );
}
