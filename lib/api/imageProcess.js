const axios = require("axios").default;
const { createNotes } = require("./textProcess.js");

const api = axios.create({
  baseURL: "http://192.168.0.10:5000",
  proxy: false,
  timeout: 2000,
});

// test connection
const con_test = () => {
  api
    .post("/api/ping")
    .then(function (response) {
      // handle success
      return response;
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

// extract the text from an image
const uploadPhoto = async (imageData) => {
  console.log(imageData);
  formData = new FormData();
  formData.append("image", {
    uri: imageData.uri,
    type: "image/jpeg",
    name: "image.jpeg",
  });

  api
    .post("/api/extract_text", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(async function (response) {
      text = await response.data["text"];
      createNotes(text);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

module.exports = {
  con_test,
  uploadPhoto,
};
