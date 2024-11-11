import axios from "axios";

const helper = {
  
  baseUrl: function () {
    const URL = "https://happydonorsdev.devdemo.tech/api/";

    return URL;
  },
  razorPayKey: function () {
    const key = "rzp_test_xMw7fbS5jks9Ye";

    return key;
  },
  googleMapsApiKey: function () {
    const apiKey = "AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0";

    return apiKey;
  },

  // token:
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDQyNmFmOWNiOWVlZmEwOGNlOTA1YzdhZWM5NTA2NDE1ZmQyZTdhYjRmNzVmODc3Y2MxMTRmMzc2MWQ4MGVmZmNlMzYzNDQ4NjlmOTQyOGEiLCJpYXQiOjE3MjU4ODc5MzMuNTI2NDY1LCJuYmYiOjE3MjU4ODc5MzMuNTI2NDY4LCJleHAiOjE3NTc0MjM5MzMuNTI0OTg1LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.ZTeodqjB6OYrLvEtuEo0XKUZ41mp6ANMWFJ1B1UBvLxQ0rSwTtgShZSOJKZ4NODIO-PZdQkXeS4eCsWXCqDpotQdZHzvXiSEUV1N6WtMThezbqsy4iRSk6cRr8drBVRyiN2aMx_9W-XjIOvFKglnbLCTj-2uuN7x8zn-jc4a8yoy35Ye06DScoe0GW6gLLhugs-xafq74jw5CTjclDSxnZcHVk9RwlAZNRaBx83qi1LG04rE3e_xEy4G3m_DrVkekWe4QfAGOvtKIOgLbsrVvCRzRFN6wmTPqZbGQOMtdwTJK3NVIy6Z9HOHypDVc75nrWPqyTyWtfe7ZcMp3YGa2O6ulZqxUGqpNr-oWKgpRSgywkzKtkkeGaRflafIC0nmqnGOpAqil0K3D4F2lLgt6Ro9YWFR6lKSxTTr9AGYzGskbC8fOlRe2-13VHVv3HxFzC4cMcpHcdmzOjjtWB3L89CQ39XmEcP4QHNpZvfNIpkMmfv6AsMQ0VQuQvBwrO6S61bSe9pV0wggmDqpL1KdXIWXQbW5SKWewi_DfQxIR3p-7BLRxYOW-b2eQZt5RF9083RzOsEauDGIlp_ql2YOn818679jsa5QFLxvT07Ak_L5gGHgcnShl1HBrc8jke9vTR3_4rIzyPdaJX9uObhZD4xih0BNpNU7v3Hgge75dcg",
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
