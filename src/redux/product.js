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

// export const updateProfile =
//   (data, callback = () => {}) =>
//   async () => {
//     try {
//       var result = await Helper.patchData(
//         baseUrl + "app/profile/update",

//         data
//       )
//         .then((response) => {
//           if (response.data) {
//             return response.data;
//           } else {
//             return {
//               status: false,
//               code: 401,
//               message:
//                 response.response.data.message + " Please login and proceed",
//             };
//           }
//         })
//         .catch((err) => err);
//       callback(result);
//     } catch (err) {
//       console.log("err: ", err);
//     }
//   };

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
      console.log("response: ", response);

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

export const updateProfile =
  (data, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.patchData(
        baseUrl + "app/profile/update",
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

export const donateBloods =
  (type, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-requests/${type}`
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
  (type, callback = () => {}) =>
  async () => {
    try {
      const response = await Helper.getData(
        baseUrl + `app/blood-donate/${type}`
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

export const MarkDonated =
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
