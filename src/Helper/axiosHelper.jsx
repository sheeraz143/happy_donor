import axios from "axios";

const helper = {
  baseUrl: function () {
    return import.meta.env.VITE_BASE_URL;
  },
  razorPayKey: function () {
<<<<<<< HEAD
    const key = "rzp_test_xMw7fbS5jks9Ye";
   // const key = "rzp_live_koTSgNVBozLvcc";

    return key;
=======
    return import.meta.env.VITE_RAZORPAY_KEY_LIVE;
>>>>>>> bc05944b80153db5caba8d53751adeac8b87b2b6
  },
  googleMapsApiKey: function () {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  },
  // baseUrl: function () {
  //   const URL = "https://happydonorsdev.devdemo.tech/api/";

  //   return URL;
  // },
  // razorPayKey: function () {
  //   // const key = "rzp_test_xMw7fbS5jks9Ye";
  //   const key = "rzp_live_koTSgNVBozLvcc";

  //   return key;
  // },
  // googleMapsApiKey: function () {
  //   const apiKey = "AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0";

  //   return apiKey;
  // },

  postData: async function (url, data) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: localStorage.getItem("oAuth"),
        // Authorization: `Bearer ${this.token}`,
      },
    };

    return await axios
      .post(url, data, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },
  postDataOrg: async function (url, data) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        // Authorization: localStorage.getItem("oAuth"),
      },
    };

    return await axios
      .post(url, data, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },

  putData: async function (url, data) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        // Authorization: `Bearer ${this.token}`,
        Authorization: localStorage.getItem("oAuth"),
      },
    };

    return await axios
      .put(url, data, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },

  deleteData: async function (url, data) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        // "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("oAuth"),
      },
    };

    return await axios
      .delete(url, data, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },

  deleteDataNew: async function (url) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: localStorage.getItem("oAuth"),
      },
    };

    return await axios
      .delete(url, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },

  // patchData: async function (url, data) {
  //   let axiosConfig = {
  //     headers: {
  //       "Content-Type": "application/json;charset=UTF-8",
  //       Authorization: localStorage.getItem("oAuth"),
  //     },
  //   };

  //   return await axios
  //     .patch(url, data, axiosConfig)
  //     .then((res) => {
  //       console.log("res: ", res);
  //       return res;
  //     })
  //     .catch((err) => {
  //       console.log("err: ", err);
  //       return err;
  //     });
  // },
  patchData: async function (url, data) {
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: localStorage.getItem("oAuth"),
      },
    };

    try {
      const res = await axios.patch(url, data, axiosConfig);
      return res; // Return the response directly if successful
    } catch (err) {
      console.error("Axios error: ", err); // Log the error for debugging
      throw err; // Throw the error to be handled later
    }
  },

  formData: async function (url, data) {
    let axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("oAuth"),
      },
    };

    return await axios
      .post(url, data, axiosConfig)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  },
  getData: async function (url) {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: localStorage.getItem("oAuth"),
        Accept: "application/json",
      },
    };
    // console.log('localStorage.getItem("oAuth"): ', localStorage.getItem("oAuth"));
    return await axios.get(url, axiosConfig).then((res) => {
      if (res) {
        return res;
      }
    });
  },
  queryData: async function (url, query) {
    return await axios.get(url, query).then((res) => {
      if (res) {
        return res;
      }
    });
  },
};

export default helper;
