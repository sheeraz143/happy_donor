import Helper from "../Helper/axiosHelper";
import { createSlice } from "@reduxjs/toolkit";

const baseUrl = Helper.baseUrl();

export const counterSlice = createSlice({
  name: "product",
  initialState: {
    loader: false,
  },
  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { setLoader } = counterSlice.actions;

export default counterSlice.reducer;

export const requestOTP =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + "auth/request-otp",
        data
      );

      // Construct the result object including the response code
      const result = {
        ...response.data,
        code: response.status, // Use response.status or response.data.code if the code is part of response.data
      };

      callback(result);
    } catch (err) {
      // Handle network or other unexpected errors
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500, // Default to 500 if status is not available
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const verifytOTP =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(baseUrl + "auth/verify-otp", data);

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Verify OTP error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message:
          err.response?.response?.data?.message ||
          "An unexpected error occurred.",
      });
    }
  };
export const OrgLogin =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postDataOrg(baseUrl + "auth/login", data);

      // If response is 200, send the data
      if (response.status === 200) {
        callback({
          status: true,
          code: response.status,
          data: response.data,
        });
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.response.status,
          message: response.response.data.message,
        });
      }
    } catch (err) {
      console.error("Verify OTP error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message:
          err.response?.response?.data?.message ||
          "An unexpected error occurred.",
      });
    }
  };
export const ForgotPassword =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postDataOrg(
        baseUrl + "auth/forget-organization",
        data
      );
      // If response is 200, send the data
      if (response.status === 200) {
        callback({
          status: true,
          code: response.status,
          data: response.data,
        });
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.response.status,
          message: response.response.data.message,
        });
      }
    } catch (err) {
      console.error("Verify OTP error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message:
          err.response?.response?.data?.message ||
          "An unexpected error occurred.",
      });
    }
  };

export const updateProfile =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.patchData(
        baseUrl + "app/profile/update",
        data
      );

      // Handle success response
      if (response.status === 200) {
        callback({
          status: true,
          code: response.status,
          data: response.data.user,
          message: response.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);

      // Check if err.response exists to avoid accessing undefined
      if (err.response && err.response.data && err.response.data.errors) {
        // Extract the first error message for each field
        const errorMessages = Object.entries(err.response.data.errors).map(
          ([field, messages]) => `${field}: ${messages[0]}`
        );

        callback({
          status: false,
          code: err.response.status,
          message: errorMessages.length
            ? errorMessages.join(", ") // Join messages for display
            : "An unexpected error occurred.",
        });
      } else {
        // Handle unexpected errors
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

export const registerOrg =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `auth/register-organization`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message || "An error occurred.",
          error: response?.response?.data.errors,
        });
      }
    } catch (err) {
      console.error("Request failed: ", err);

      let errorMessage = "An unexpected error occurred.";
      if (err.response) {
        if (err.response.status === 422) {
          errorMessage = err.response.data.message || "Validation error.";
        } else {
          errorMessage = err.response.data.message || errorMessage;
        }
      }

      callback({
        status: false,
        code: err.response?.status || 500,
        message: errorMessage,
      });
    }
  };

export const toggleAvailability =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.patchData(
        baseUrl + "app/profile/availability"
      );

      // const result = {
      //   ...response.data,
      //   code: response.status,
      // };

      // Handle success response
      if (response.status === 200) {
        callback({
          status: true,
          code: response.status,
          data: response.data.user,
          message: response.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);

      // Check if err.response exists to avoid accessing undefined
      if (err.response && err.response.data && err.response.data.errors) {
        // Extract the first error message for each field
        const errorMessages = Object.entries(err.response.data.errors).map(
          ([field, messages]) => `${field}: ${messages[0]}`
        );

        callback({
          status: false,
          code: err.response.status,
          message: errorMessages.length
            ? errorMessages.join(", ") // Join messages for display
            : "An unexpected error occurred.",
        });
      } else {
        // Handle unexpected errors
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

export const getProfile =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(baseUrl + "app/profile");

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const profilePicUpdate =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.formData(
        baseUrl + "app/profile-picture/update",
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500, // Default to 500 if status is not available
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const dashboardData =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(baseUrl + "app/dashboard");

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const requestBlood =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + "app/blood-requests/create",
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500, // Default to 500 if status is not available
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const CreateCamp =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.formData(
        baseUrl + "app/blood-camps/create",
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const donateBloods = (type, page, callback) => async () => {
  try {
    const response = await Helper.getData(
      baseUrl + `app/blood-requests/${type}?page=${page}&limit=${10}`
    );

    const result = {
      ...response.data,
      code: response.status,
    };

    if (typeof callback === "function") {
      callback(result);
    }
  } catch (err) {
    console.error("Update profile error: ", err);

    if (typeof callback === "function") {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  }
};

export const CampsLists =
  (type, page, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/${type}?page=${page}&limit=${10}`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const donateApprove =
  (type, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-donor/${type}`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const BloodDonateList =
  (type, page, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-donate/${type}?page=${page}&limit=${10}`
      );
      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const CampsList =
  (type, callback = () => {}) =>
  async () => {
    try {
      var url;
      if (type == "matched") {
        url = baseUrl + `app/blood-camps/matched`;
      } else {
        url = baseUrl + `app/events/matched`;
      }
      const response = await Helper.getData(url);

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
// export const CampsList =
//   (type, callback = () => {}) =>
//   async () => {
//     try {
//       const url =
//         type === "matched"
//           ? `${baseUrl}/app/blood-camps/matched`
//           : `${baseUrl}/app/events/matched`;
//       const response = await Helper.get(url);

//       const result = {
//         ...response.data,
//         code: response.status,
//       };

//       callback(result);
//     } catch (err) {
//       console.error("Update profile error: ", err);
//       callback({
//         status: false,
//         code: err.response?.status || 500,
//         message: err.response?.data?.message || "An unexpected error occurred.",
//       });
//     }
//   };

export const AcceptedDonors =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-requests/${id}/accepted-donors`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const AcceptedCamps =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/${id}/accepted-donors`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const MarkCampDonated =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/confirm-donation`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const MarkDonated =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        // baseUrl + `app/blood-donate/${id}/accept`
        baseUrl + `app/blood-requests/confirm-donation`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const DonateAccept =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-donate/${id}/accept`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const DonateAcceptCamp =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/${id}/accept`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ParticipateAccept =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/events/${id}/participate`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const CancelCamp =
  (id, data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/${id}/cancel`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const CancelBloodRequest =
  (id, data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-requests/${id}/cancel`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const CancelBloodCamp =
  (id, data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/${id}/cancel`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const SendGratitudeMessage =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.formData(
        baseUrl + `app/blood-requests/gratitude`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const SendGratitudeCampMessage =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.formData(
        baseUrl + `app/blood-camps/gratitude`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          data: response?.response?.data,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const ViewBloodRequest =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-requests/${id}/view`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ViewBloodRequestUser =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-requests/${id}/view/user`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      callback(result);
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const ViewCampsRequest =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/matched/${id}/view`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ViewCampsRequestUser =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/${id}/view/user`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ViewNotifications =
  (page, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/notifications?page=${page}&limit=${10}`
      );
      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const deleteAllNotifications =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.deleteDataNew(
        baseUrl + `app/notifications`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
// Define markAllAsRead function
export const markAllAsRead =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.putData(
        baseUrl + `app/notifications/mark-all-as-read`
      );
      const result = {
        code: response.status,
        data: response.data,
      };

      if (response.status === 200) {
        callback({ status: true, data: result });
      } else {
        callback({ status: false, message: response.data.message });
      }
    } catch (err) {
      console.error("Mark all as read error: ", err);
      callback({
        status: false,
        message: err.response?.data?.message || "An error occurred.",
      });
    }
  };

// Define deleteNotification function
export const deleteNotification =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.deleteDataNew(
        baseUrl + `app/notifications/${id}`
      );
      const result = {
        code: response.status,
        data: response.data,
      };

      if (response.status === 200) {
        callback({ status: true, data: result });
      } else {
        callback({ status: false, message: response.response.data.message });
      }
    } catch (err) {
      console.error("Delete notification error: ", err);
      callback({
        status: false,
        message: err.response?.data?.message || "An error occurred.",
      });
    }
  };

export const ViewSinglecamp =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/${id}/view`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ViewEventRequest =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/events/matched/${id}/view`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const ViewEventRequestUser =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/events/${id}/view/user`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const ApproveAdminBloodRequest =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-requests/${id}/approve/admin`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const ApproveAdminBloodDonor =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-donor/approve/admin`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const RejectBloodDonorByAdmin =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-donor/cancel/admin`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.response?.data.message,
        });
      }
    } catch (err) {
      console.error("Update profile error: ", err);
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const DonateHistory =
  (
    page,
    callback = () => {} // Default callback as empty function
  ) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-donors/history?page=${page}&limit=${10}`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, execute the callback with the result
      if (response.status === 200) {
        if (typeof callback === "function") {
          // Ensure callback is a function
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

export const writeToUs =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(baseUrl + `app/submissions`, data);

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const addEmergency =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/emergency-contacts`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const updateEmergency =
  (data, id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.patchData(
        baseUrl + `app/emergency-contacts/${id}`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const sendSOS =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(baseUrl + `app/send-sos`, data);

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const paymentInitiate =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/payment/initiate`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 201) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const paymentStatus =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/payment/update-status`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const fundInitiate =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/fund-donation/initiate`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else if (response.status == 422) {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data?.message,
          data: response.response?.data, // Passing the entire response data if it's not a success
        });
      }
    } catch (err) {
      console.log("err: ", err);
      // For other errors, send a generic message
      callback({
        status: false,
        code: err.response?.status || 500,
        // message: err.response?.data?.message || "An unexpected error occurred.",
        data: err.response?.data, // Passing the entire response data if it's not a success
      });
    }
  };

export const fundStatus =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/fund-donation/update-status`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
          data: response?.data,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
export const viewEmergency =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(baseUrl + `app/emergency-contacts`);

      const result = {
        ...response.data,
        code: response.status,
      };

      // If response is 200, send the data
      if (response.status === 200) {
        callback(result);
      } else {
        // If not 200, send an error message
        callback({
          status: false,
          code: response.status,
          message: response?.data.message,
        });
      }
    } catch (err) {
      callback({
        status: false,
        code: err.response?.status || 500,
        message: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

export const PendingApprovals =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(baseUrl + `app/pending-approvals`);

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
export const PendingApprovalsView =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/pending-approvals/${id}`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
export const PendingApprovalsAccept =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.putData(
        baseUrl + `app/pending-approvals/${id}/approve`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
export const DeletePendingApprovals =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.deleteDataNew(
        baseUrl + `app/pending-approvals/${id}/reject`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

export const AdminCampsList =
  (callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-camps/all/admin`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };

export const CampApproved =
  (id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/${id}/approve/admin`
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
export const CampReject =
  (data, id, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.postData(
        baseUrl + `app/blood-camps/${id}/reject/admin`,
        data
      );

      const result = {
        ...response.data,
        code: response.status,
      };

      if (response.status === 200) {
        if (typeof callback === "function") {
          callback(result);
        }
      } else {
        // If not 200, send an error message
        if (typeof callback === "function") {
          callback({
            status: false,
            code: response.status,
            message: response?.response?.data.message,
          });
        }
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback({
          status: false,
          code: err.response?.status || 500,
          message:
            err.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
