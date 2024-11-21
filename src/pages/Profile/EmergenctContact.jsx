import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  addEmergency,
  setLoader,
  updateEmergency,
  viewEmergency,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function EmergenctContact() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("+91");
  const [id, setId] = useState(-1);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const handleInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    // Ensure +91 prefix
    if (!value.startsWith("91")) {
      value = `91${value}`; // Keep 91 prefix
    }

    if (value.startsWith("91")) {
      value = `+91${value.slice(2, 12)}`; // Format as +91 XXXXXXXXXX
    }

    // Limit to 10 digits after +91
    if (value.length > 13) {
      setError("phone", {
        type: "manual",
        message: "Phone Number must be 10 digits",
      });
    } else {
      clearErrors("phone");
    }

    // Update the state to keep the input controlled
    setInputValue(value); // Reflect the value in the input
  };

  useEffect(() => {
    dispatch(setLoader(true));
    try {
      dispatch(
        viewEmergency((res) => {
          dispatch(setLoader(false));

          // Check for response status
          if (res.code === 200) {
            console.log("res", res?.contacts);
            if (res?.contacts?.length > 0) {
              const contact = res.contacts[0];
              setValue("name", contact.name);
              setValue("phone", contact.phone);
              setInputValue(contact.phone); // Set initial phone value
              setId(contact.id);
            }
          } else {
            const errorMessages = res.message || "An error occurred.";
            toast.error(errorMessages);
          }
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false)); // Stop loading
    }
  }, [dispatch, setValue]);
  // Function to handle form submission
  const onSubmit = (data) => {
    // console.log(data);
    dispatch(setLoader(true));
    try {
      if (id !== -1) {
        dispatch(
          updateEmergency(data, id, (res) => {
            dispatch(setLoader(false));

            // Check for response status
            if (res.code === 200) {
              toast.success(res.message);
              navigate("#");
            } else {
              const errorMessages = res.message || "An error occurred.";
              toast.error(errorMessages);
            }
          })
        );
      } else
        dispatch(
          addEmergency(data, (res) => {
            dispatch(setLoader(false));

            // Check for response status
            if (res.code === 201) {
              toast.success(res.message);
              navigate("#");
            } else {
              const errorMessages = res.message || "An error occurred.";
              toast.error(errorMessages);
            }
          })
        );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false)); // Stop loading
    }
  };

  return (
    <form
      className="form-container mb-5 mt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Title */}
      <div className="d-flex align-items-center justify-content-around">
        <h3>Emergency Contact</h3>
      </div>

      {/* First Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-input"
          type="text"
          {...register("name", { required: true })}
        />
        {errors.name && <p className="error-message">Name is required</p>}
      </div>

      {/* Contact Number */}
      <div className="form-group">
        <label>Contact Details</label>
        <input
          className="form-input"
          type="tel"
          onInput={handleInput}
          value={inputValue}
          {...register("phone", {
            required: "Phone Number is required",
            pattern: {
              value: /^(?:\+91[-\s]?)?[0]?[123456789]\d{9}$/,
              message: "Phone Number must be 10 digits",
            },
            validate: (value) => {
              if (!value.startsWith("+91") || value.length !== 13) {
                return "Phone Number must start with +91 and be 10 digits long";
              }
            },
          })}
        />
        {errors.phone && (
          <p className="error-message">{errors.phone.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Save Changes
      </button>
    </form>
  );
}
