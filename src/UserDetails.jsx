import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "./utils/apiclient";

const UserDetails = () => {
  const getToken = () => localStorage.getItem("token");
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const getDetails = async (userid) => {
      try {
        const response = await axios.post(
          "/api/users/getUserProfile",
          { userId: userid },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        console.log("API response:", response.data);
        setUserDetails(response.data.data); // Update this based on the structure of the response
      } catch (error) {
        console.log(error);
      }
    };

    getDetails(id);
  }, [id]);

  console.log("userDetails state:", userDetails);

  return (
    <div className="max-w-1xl flex items-center h-auto lg:max-h-full hide-scrollbar overflow-y-auto flex-wrap mx-auto my-0 lg:my-0">
      {/* Main Col */}
      <div
        id="profile"
        className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-0 lg:mx-0"
      >
        <div className="p-4 md:p-10 text-center lg:text-left">
          {/* Image for mobile view */}
          <div
            className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://source.unsplash.com/MP0IUfwrn0A')`,
            }}
          ></div>

          <h1 className="text-3xl font-bold pt-8 lg:pt-0">{userDetails.nbfc_name}</h1>
          <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
          <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
            <svg
              className="h-4 fill-current text-green-700 pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
            </svg>
            What you do
          </p>
          <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
            <svg
              className="h-4 fill-current text-green-700 pr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z" />
            </svg>
            Your Location - 25.0000° N, 71.0000° W
          </p>
          <p className="pt-8 text-sm">
            Totally optional short description about yourself, what you do and
            so on.
          </p>

          <div className="pt-12 pb-8">
            <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full">
              Get In Touch
            </button>
          </div>

          <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
            <a className="link" href="#" data-tippy-content="@facebook_handle">
              <svg
                className="h-6 fill-current text-gray-600 hover:text-green-700"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Facebook</title>
                <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0" />
              </svg>
            </a>
            <a className="link" href="#" data-tippy-content="@twitter_handle">
              <svg
                className="h-6 fill-current text-gray-600 hover:text-green-700"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Twitter</title>
                <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.11-.849.17-1.296.17-.314 0-.623-.03-.924-.086.631 1.956 2.445 3.379 4.6 3.419-1.68 1.316-3.8 2.102-6.102 2.102-.395 0-.787-.023-1.175-.067 2.189 1.404 4.768 2.221 7.557 2.221 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.634.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
              </svg>
            </a>
            <a className="link" href="#" data-tippy-content="@instagram_handle">
              <svg
                className="h-6 fill-current text-gray-600 hover:text-green-700"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Instagram</title>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.057 1.646-.068 4.85-.068zm0-2.163C8.756 0 8.326.013 7.053.072 5.78.131 4.663.425 3.678 1.41 2.693 2.395 2.4 3.512 2.341 4.785.282 5.053.27 7.195.27 12s.013 6.947.072 8.22c.059 1.273.353 2.39 1.338 3.375.985.985 2.102 1.279 3.375 1.338 1.273.059 1.703.072 4.915.072s3.643-.013 4.915-.072c1.273-.059 2.39-.353 3.375-1.338.985-.985 1.279-2.102 1.338-3.375.059-1.273.072-1.703.072-4.915s-.013-3.643-.072-4.915c-.059-1.273-.353-2.39-1.338-3.375-.985-.985-2.102-1.279-3.375-1.338-1.273-.059-1.703-.072-4.915-.072zm0 5.838a6.163 6.163 0 1 0 0 12.327 6.163 6.163 0 0 0 0-12.327zm0 10.164a4.001 4.001 0 1 1 0-8.002 4.001 4.001 0 0 1 0 8.002zm6.406-11.845a1.44 1.44 0 1 0 0-2.881 1.44 1.44 0 0 0 0 2.881z" />
              </svg>
            </a>
            <a className="link" href="#" data-tippy-content="@linkedin_handle">
              <svg
                className="h-6 fill-current text-gray-600 hover:text-green-700"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>LinkedIn</title>
                <path d="M22.23 0H1.77C.792 0 0 .774 0 1.732v20.536C0 23.226.792 24 1.77 24h20.46c.978 0 1.77-.774 1.77-1.732V1.732C24 .774 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.595a2.07 2.07 0 1 1 0-4.142 2.07 2.07 0 0 1 0 4.142zm15.112 12.857h-3.56v-5.57c0-1.327-.026-3.036-1.85-3.036-1.852 0-2.135 1.445-2.135 2.94v5.666h-3.56V9h3.42v1.561h.049c.476-.9 1.637-1.85 3.366-1.85 3.597 0 4.26 2.368 4.26 5.448v6.294z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Image Col */}
      <div
        className="w-full lg:w-2/5"
        style={{
          backgroundImage: `url('https://source.unsplash.com/MP0IUfwrn0A')`,
        }}
      ></div>
    </div>
  );
};

export default UserDetails;
