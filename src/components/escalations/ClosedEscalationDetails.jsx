import React, { useState, useEffect, useRef } from "react";
import axios from "./utils/apiclient";
import { Base64 } from "js-base64";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserType from "../UserType";
import "./Navigationbar.css";

const Accordion = () => {
  const UserTypes = UserType();

  const navigate = useNavigate();
  const { id } = useParams(); //this is the esaclation id
  const { id1 } = useParams(); //this is the type of escalation i.e normal closed or closed with penalty
  const decodedId = Base64.decode(id);
  const PassingData = JSON.parse(decodedId);
  const [userRole, setUserRole] = useState("");
   const chatContainerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.type);
    }
  }, []);

  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [ids, setIds] = useState();
  const [waiverRequestAmount, setWaiverRequestAmount] = useState("");

  const decodedId1 = Base64.decode(id1);
  const PassingData1 = JSON.parse(decodedId1);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escalationData, setEscalationData] = useState({});
  const [visibleMessages, setVisibleMessages] = useState(10);
  const [closingData, setClosingData] = useState({});
  const [approvedAmount, setApprovedAmount] = useState(
    closingData.waiver_approved || 0
  );
  const hasMounted = useRef(false);

  const getToken = () => localStorage.getItem("token");
  const handleToggle = (index, escalation_id) => {
    const isNULL = activeIndex === index ? null : index;
    console.log(decodedId1);
    if (isNULL >= 1) {
      setIds(escalation_id);
      getClosedEscalationDetails(escalation_id);
    }
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    setApprovedAmount(closingData.waiver_approved || 0);
  }, [closingData]);

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      getEscalationDetails();
      hasMounted.current = true;
    }
  }, [id]);

   useEffect(() => {
     const handleScroll = () => {
       if (chatContainerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } =
           chatContainerRef.current;
         if (scrollHeight - scrollTop <= clientHeight + 1) {
           // Adjusted condition
           loadMoreMessages();
         }
       }
     };

     if (chatContainerRef.current) {
       chatContainerRef.current.addEventListener("scroll", handleScroll);
     }

     return () => {
       if (chatContainerRef.current) {
         chatContainerRef.current.removeEventListener("scroll", handleScroll);
       }
     };
   });
  const getEscalationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/escalation/getEscalationByAgencyId",
        {
          agency_id: PassingData,
          status: PassingData1,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setEscalationData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClosedEscalationDetails = async (escalation_id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/escalation/getClosedEscalationById",
        {
          escalation_id: escalation_id,
          status: 0,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setClosingData(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    updateApprovalStatus(1, "approved");
  };

  const handleReject = () => {
    setApprovedAmount(0);
    updateApprovalStatus(2, "rejected");
  };

  useEffect(() => {
    if (closingData.waiverStatus === 1) {
      setApproved(true);
      setRejected(false);
    } else if (closingData.waiverStatus === 2) {
      setApproved(false);
      setRejected(true);
    } else if (closingData.waiverStatus === 0) {
      setApproved(false);
      setRejected(false);
    }
  }, [closingData.waiverStatus, id]);

  const updateApprovalStatus = (statusID, status) => {
    const data = {
      escalation_id: ids,
      statusID: statusID,
      waiver: approvedAmount ? approvedAmount : 0,
    };

    axios
      .post("/api/escalation/escalationWaiverApprove", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Approval status updated successfully:", response);
        if (status === "approved") {
          setApproved(true);
          setRejected(false);
        } else if (status === "rejected") {
          setApproved(false);
          setRejected(true);
        }
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.error("Error updating approval status:", error);
      });
  };

  const escalationWaiverRequest = () => {
    const data = {
      escalation_id: ids,
      waiver: waiverRequestAmount,
    };
    axios
      .post("/api/escalation/escalationWaiverRequest", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Approval status updated successfully:", response);
        toast.success("Waiver request submitted successfully!");
      })
      .catch((error) => {
        console.error("Error updating approval status:", error);
      });
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
    }
  };

  const formatDate = (dateString) => {
    const [datePart, timePart, period] = dateString.split(" ");

    const [day, month, year] = datePart.split("-");
    let [hours, minutes, seconds] = timePart.split(":");

    return `${day}/${month}/${year}
    ${timePart} ${period}`;
  };
  return (
    <>
      <div id="accordion-collapse" data-accordion="collapse">
        {Object.keys(escalationData).map((key, index) => (
          <div key={index} className="mb-4">
            <h2 id={`accordion-collapse-heading-${index + 1}`}>
              <button
                type="button"
                className="flex items-center justify-between w-full p-4 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                onClick={() =>
                  handleToggle(index + 1, escalationData[key][0].escalation_id)
                }
                aria-expanded={activeIndex === index + 1}
                aria-controls={`accordion-collapse-body-${index + 1}`}
              >
                {key}
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 ${
                    activeIndex === index + 1 ? "rotate-180" : ""
                  } shrink-0`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-collapse-body-${index + 1}`}
              className={`${activeIndex === index + 1 ? "block" : "hidden"}`}
              aria-labelledby={`accordion-collapse-heading-${index + 1}`}
            >
              <main className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-gray-200">
                {PassingData1 == 0 && (
                  <>
                    <div className="text-black-500 rounded flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col gap-6 mb-8 bg-gray-50 p-8 shadow-xl rounded-lg w-full md:w-1/2">
                        <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-2 md:space-y-0">
                          <label
                            className="font-medium w-full md:w-32"
                            htmlFor="final_comments"
                          >
                            Final Comments:
                          </label>
                          <textarea
                            disabled
                            value={closingData.final_comments}
                            name="final_comments"
                            id="final_comments"
                            className="border p-2 rounded w-full md:flex-grow"
                          >
                            {closingData.final_comments}
                          </textarea>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                          <label
                            className="font-medium w-full md:w-32"
                            htmlFor="penalty_type"
                          >
                            Penalty Type:
                          </label>
                          <input
                            disabled
                            type="text"
                            id="penalty_type"
                            className="border p-2 rounded w-full md:flex-grow"
                            value={
                              closingData.penalty_type == 2
                                ? "Percentage"
                                : "Fixed"
                            }
                          />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                          <label
                            className="font-medium w-full md:w-32"
                            htmlFor="penalty"
                          >
                            Penalty:
                          </label>
                          <input
                            disabled
                            type="text"
                            id="penalty"
                            value={
                              closingData.penalty +
                              (closingData.penalty_type == 2 ? "%" : "₹")
                            }
                            className="border p-2 rounded w-full md:flex-grow"
                          />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                          <label
                            className="font-medium w-full md:w-32 mb-2 md:mb-0"
                            htmlFor="duration_from"
                          >
                            Duration:
                          </label>
                          <div className="flex flex-col md:flex-row md:items-center w-full space-y-2 md:space-y-0 md:space-x-2">
                            <input
                              disabled
                              type="text"
                              id="duration_from"
                              value={closingData.fromDate}
                              className="border p-2 rounded w-full md:flex-grow"
                            />
                            <span className="mx-0 md:mx-2">to</span>
                            <input
                              disabled
                              type="text"
                              id="duration_to"
                              value={closingData.toDate}
                              className="border p-2 rounded w-full md:flex-grow"
                            />
                          </div>
                        </div>
                      </div>

                      {closingData.waiver_request > 0 && userRole == "nbfc" && (
                        <div className="flex flex-col gap-6 mb-8 bg-gray-50 p-8 shadow-xl rounded-lg w-full md:w-1/2">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <label className="font-medium">
                              Request{" "}
                              {closingData.penalty_type === "1"
                                ? "Amount"
                                : "Percentage"}
                            </label>
                            <input
                              type="text"
                              value={closingData.waiver_request}
                              disabled
                              className="border p-1 rounded w-full sm:w-auto"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                            <label className="font-medium w-full md:w-auto mb-1 md:mb-0">
                              Approved{" "}
                              {closingData.penalty_type === "1"
                                ? "Amount"
                                : "Percentage"}
                            </label>
                            <input
                              type="text"
                              value={approvedAmount}
                              onChange={(e) =>
                                setApprovedAmount(e.target.value)
                              }
                              className="border p-1 rounded w-full md:flex-grow"
                            />
                          </div>

                          <div className="flex justify-between items-center mt-2 p-2 bg-gray-300 rounded-md shadow-md">
                            <div className="flex items-center space-x-2">
                              <h2 className="text-sm font-medium text-black truncate">
                                {closingData.penalty_type == 1
                                  ? `Final Penalty: ${
                                      parseFloat(closingData.penalty) -
                                      parseFloat(approvedAmount || 0)
                                    }₹`
                                  : `Final Penalty: ${parseFloat(
                                      approvedAmount || 0
                                    )}%`}
                              </h2>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 items-end mb-4">
                            {!approved && !rejected && (
                              <>
                                <button
                                  className="px-4 py-2 bg-green-600 text-black rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                  onClick={handleApprove}
                                >
                                  Approve
                                </button>
                                <button
                                  className="px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                  onClick={handleReject}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {approved && !rejected && (
                              <button
                                className="px-8 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                onClick={handleReject}
                              >
                                Reject
                              </button>
                            )}
                            {!approved && rejected && (
                              <button
                                className="px-8 py-2 bg-green-600 text-black rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                onClick={handleApprove}
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {userRole === "agency" && (
                        <div className="flex flex-col gap-6 mb-8 bg-gray-50 p-8 shadow-xl rounded-lg w-full md:w-1/2">
                          {closingData.waiverStatus === 0 ? (
                            <div className="flex flex-col items-center space-y-2">
                              <label className="block mb-2">
                                Waiver Request Amount:
                              </label>
                              <input
                                type="number"
                                value={waiverRequestAmount}
                                onChange={(e) =>
                                  setWaiverRequestAmount(e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded"
                              />
                              <button
                                onClick={escalationWaiverRequest}
                                className="bg-indigo-500 hover:bg-blue-600 text-white px-8 py-2 rounded"
                              >
                                Submit
                              </button>
                            </div>
                          ) : (
                            <div className="mt-4">
                              {closingData.waiverStatus === 1 ? (
                                <div className="p-4 bg-green-600 text-white rounded-md">
                                  Waiver Approved! <br />
                                  {closingData.penalty_type == 1
                                    ? `Final Penalty: ${approvedAmount}₹`
                                    : `Final Penalty: ${approvedAmount}%`}
                                </div>
                              ) : (
                                <div className="p-4 bg-red-600 text-white rounded-md">
                                  Waiver Rejected. <br />
                                  {closingData.penalty_type == 1
                                    ? `Final Penalty: ${closingData.penalty}₹`
                                    : `Final Penalty: ${closingData.penalty}%`}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="container mx-auto p-0">
                  <div className="shadow-lg rounded-lg overflow-hidden bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-0">
                      <div className="col-span-3">
                        <div className="relative">
                          <div
                            className="chat-messages hide-scrollbar overflow-y-auto h-96 bg-white p-4 rounded-lg"
                            key={index}
                            ref={chatContainerRef}
                          >
                            {escalationData[key]
                              .slice(0, visibleMessages)
                              .map((item, itemIndex) => (
                                <div
                                  className={`flex justify-${
                                    item.isAgency === 0 &&
                                    UserTypes?.type === "nbfc"
                                      ? "end"
                                      : item.isAgency === 1 &&
                                        UserTypes?.type !== "nbfc"
                                      ? "end"
                                      : "start"
                                  } mb-4`}
                                  key={itemIndex}
                                >
                                  <div className="bg-gray-200 rounded-lg py-2 px-3 ml-3">
                                    <div className="font-semibold mb-1 text-right">
                                      {item.created_by}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div
                                        className="message-content"
                                        style={{
                                          whiteSpace: "pre-line",
                                          wordWrap: "break-word",
                                          wordBreak: "break-all",
                                        }}
                                      >
                                        {item.comments}
                                      </div>

                                      {item.attachments && (
                                        <p>
                                          <FaDownload
                                            onClick={() =>
                                              downloadFile(item.attachments)
                                            }
                                            className="ml-2 cursor-pointer"
                                          />
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end ml-2">
                                    <img
                                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                      className="rounded-full mb-1"
                                      alt="User Avatar"
                                      width="40"
                                      height="40"
                                    />
                                    <div className="text-black-500 text-xs mt-2">
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
                  </div>
                </div>
              </main>
            </div>
          </div>
        ))}
        <ToastContainer />
      </div>
    </>
  );
};

export default Accordion;
