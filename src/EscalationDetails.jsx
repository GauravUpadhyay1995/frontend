import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Base64 } from "js-base64";
import { useParams, useNavigate } from "react-router-dom";
import SweetAlert2 from "./SweetAlert2";
import { FaDownload } from "react-icons/fa";
import { CgAttachment } from "react-icons/cg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ModalComponent from "./Modal";
import UserType from "./UserType";

const Accordion = () => {
  const UserTypes = UserType();
  const navigate = useNavigate();
  const { id } = useParams();
  const decodedId = Base64.decode(id);
  const PassingData = JSON.parse(decodedId);

  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escalationData, setEscalationData] = useState({});
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [visibleMessages, setVisibleMessages] = useState(10);
  const hasMounted = useRef(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [escalationId, setEscalationId] = useState(0);

  const openModal = (escalation_id) => {
    setEscalationId(escalation_id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getToken = () => localStorage.getItem("token");

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const showAlert = (data) => {
    SweetAlert2(data);
  };

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      getEscalationDetails();
      hasMounted.current = true;
    }
  }, [id]);

  const getEscalationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/escalation/getEscalationByAgencyId",
        {
          agency_id: PassingData,
          status: 1,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setEscalationData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Failed to fetch escalation data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(new Blob([blob]));
      const filename = url.split("/").pop();
      const aTag = document.createElement("a");
      aTag.href = blobUrl;
      aTag.setAttribute("download", filename);
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
      window.URL.revokeObjectURL(blobUrl); // Clean up the object URL
    } catch (error) {
      console.error("Error downloading file:", error);
      showAlert("Failed to download the file.");
    }
  };

  const handleSend = async (escalation_id) => {
    console.log("Message:", message);
    if (file) {
      console.log("Attached File:", file);
    }

    const formData = new FormData();
    formData.append("escalation_id", escalation_id);
    formData.append("comments", message);
    if (file) {
      formData.append("attachment", file);
    }

    try {
      const response = await axios.post(
        "/api/escalation/replyEscalation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      getEscalationDetails();
      console.log("Response:", response.data);
      showAlert("Reply sent successfully.");
    } catch (error) {
      console.error("Error sending reply:", error);
      showAlert("Failed to send reply.");
    }

    // Clear the input fields after sending
    setMessage("");
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const loadMoreMessages = () => {
    setVisibleMessages((prevVisibleMessages) => prevVisibleMessages + 10);
  };
  const formatDate = (dateString) => {
    // Convert dateString to Date object
    const date = new Date(dateString);

    // Get current date and yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Function to format time
    const formatTime = (date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Function to format date
    const formatDate = (date) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString(undefined, options);
    };

    // Check if the date is today
    if (isSameDay(date, today)) {
      return formatTime(date);
    }

    // Check if the date is yesterday
    if (isSameDay(date, yesterday)) {
      return "Yesterday " + formatTime(date);
    }

    // Otherwise, return full date and time
    return formatDate(date);
  };

  // Function to check if two dates are on the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <>
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        data={escalationId}
      />

      <div id="accordion-collapse" data-accordion="collapse">
        {Object.keys(escalationData).map((key, index) => (
          <div key={index} className="mb-4">
            <h2 id={`accordion-collapse-heading-${index + 1}`}>
              <button
                type="button"
                className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-500 bg-gray-100 border border-gray-200 rounded-t-lg focus:outline-none"
                onClick={() => handleToggle(index + 1)}
                aria-expanded={activeIndex === index + 1}
                aria-controls={`accordion-collapse-body-${index + 1}`}
              >
                {key}
                <svg
                  data-accordion-icon
                  className={`w-4 h-4 transition-transform transform ${
                    activeIndex === index + 1 ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-collapse-body-${index + 1}`}
              className={`${
                activeIndex === index + 1 ? "block" : "hidden"
              } border border-gray-200 rounded-b-lg pt-0`}
              aria-labelledby={`accordion-collapse-heading-${index + 1}`}
            >
              <main className="shadow-md rounded-lg p-4  bg-gray-100">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <div className="chat-messages overflow-auto h-80 bg-white p-4 border border-gray-200 rounded-lg">
                        {escalationData[key]
                          .slice(0, visibleMessages)
                          .map((item, itemIndex) => (
                            <div
                              className={`flex ${
                                item.isAgency === 0 &&
                                UserTypes?.type === "nbfc"
                                  ? "justify-end"
                                  : item.isAgency === 1 &&
                                    UserTypes?.type !== "nbfc"
                                  ? "justify-end"
                                  : "justify-start"
                              } mb-4`}
                              key={itemIndex}
                            >
                              <div className="max-w-xs bg-gray-200 rounded-lg p-3">
                                <div className="font-semibold text-sm mb-1 text-right">
                                  {item.created_by}
                                </div>
                                <div className="text-sm">
                                  <div
                                    className="message-content break-words"
                                    style={{
                                      whiteSpace: "pre-line",
                                    }}
                                  >
                                    {item.comments}
                                  </div>
                                  {item.attachments && (
                                    <FaDownload
                                      onClick={() =>
                                        downloadFile(item.attachments)
                                      }
                                      className="mt-2 cursor-pointer text-blue-500"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-center ml-2">
                                <img
                                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                  className="rounded-full mb-1"
                                  alt="User Avatar"
                                  width="40"
                                  height="40"
                                />
                                <div className="text-gray-500 text-xs mt-2">
                                  {item.created_date}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {escalationData[key].length > visibleMessages && (
                        <div className="flex justify-center my-4">
                          <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={loadMoreMessages}
                          >
                            Load More
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </main>
              <div className="p-4 bg-white rounded-b-lg border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <textarea
                    rows="1"
                    className="flex-1 border rounded-l-lg p-2"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file"
                    className="bg-blue-500 text-white p-3 cursor-pointer rounded-l-lg flex items-center justify-center"
                  >
                    <CgAttachment size={20} />
                  </label>
                  <button
                    className="bg-blue-500 text-white px-6 py-3"
                    onClick={() => {
                      handleSend(escalationData[key][0].escalation_id);
                    }}
                  >
                    Send
                  </button>
                  <label
                    title="Close this escalation"
                    className="bg-red-500 cursor-pointer text-white rounded-r-lg p-3 flex items-center justify-center"
                    onClick={() => {
                      openModal(escalationData[key][0].escalation_id);
                    }}
                  >
                    <AiOutlineCloseCircle size={20} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Accordion;
