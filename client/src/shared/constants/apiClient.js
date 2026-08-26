import axios from "axios";


const apiClient = axios.create({

  baseURL:
    "http://localhost:3464",

  headers: {
    "Content-Type": "application/json",
  },

});


export default apiClient;