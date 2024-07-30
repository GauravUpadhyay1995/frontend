import axios from "axios";

// axios.interceptors.request.use((config) => {});

// axios.interceptors.response.use(
//   (res) => {},
//   (res) => {
//     console.log(res);
//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";

//       alert("token expire");
//     }
//     return res;
//   }
// );

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response: { status } = {} } = error;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
export default axios;
