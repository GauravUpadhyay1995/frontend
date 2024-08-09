import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Loader } from "../Loader";
import axios from "axios";
import SweetAlert2 from "../SweetAlert2";
import { Base64 } from "js-base64";
import { useParams, useNavigate } from "react-router-dom";
import Page404 from "../NotFound404";
import { BucketOptions } from "../StateOptions";
import ChangeDateFormate from "../ChangeDateFormate";

// WaiverDetails Component
const WaiverDetails = () => {
  const getBucketName = (values) => {
    if (typeof values === "string") {
      try {
        values = JSON.parse(values);
      } catch (e) {
        throw new TypeError("Invalid JSON string provided");
      }
    }

    if (!Array.isArray(values)) {
      throw new TypeError("Expected an array of strings");
    }

    const bucketMap = BucketOptions.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});

    return values.map((value) => bucketMap[value] + ` , `);
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const decodedId = Base64.decode(id);
  const PassingData = JSON.parse(decodedId); // Parse the string back into an object

  const [error, setError] = useState("");

  const [page404, setPage404] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatedPrincipal, setUpdatedPrincipal] = useState(0);
  const [updatedPenal, setUpdatedPenal] = useState(0);
  const [updatedIntrest, setUpdatedIntrest] = useState(0);
  const [principalReq, setPrincipalReq] = useState(0);
  const [penalReq, setPenalReq] = useState(0);
  const [intrestReq, setIntrestReq] = useState(0);
  const [principalRule, setPrincipalRule] = useState(0);
  const [penalRule, setPenalRule] = useState(0);
  const [intrestRule, setIntrestRule] = useState(0);
  const [waiverData, setWaiverData] = useState();
  const [penalPercentage, setPenalPercentage] = useState(0);
  const [principalPercentage, setPrincipalPercentage] = useState(0);
  const [intrestPercentage, setIntrestPercentage] = useState(0);
  const [reason, setReason] = useState("");

  const getToken = () => localStorage.getItem("token");

  const hasMounted = useRef(false);
  let customerData = {};
  let AgencyData = {};

  const showAlert = (data) => {
    SweetAlert2(data);
  };
  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      getWaiverDetails();
      hasMounted.current = true;
    }
  }, []);
  const getWaiverDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/users/waiverDetails", // Ensure the path starts with '/api'
        {
          id: PassingData.id,
          loanId: PassingData.loanId,
          isApproved: 1,
        }
      );
      customerData = response.data.data[0];

      setWaiverData(customerData);
      setUpdatedPrincipal(customerData.approved_principal);
      setUpdatedPenal(customerData.approved_penal);
      setUpdatedIntrest(customerData.approved_intrest);
      setPrincipalReq(customerData.principal_amt);
      setPenalReq(customerData.penal_amt);
      setIntrestReq(customerData.intrest_amt);
      setPrincipalRule(Number(customerData.WaiverRuleData.principal));
      setPenalRule(Number(customerData.WaiverRuleData.penal));
      setIntrestRule(Number(customerData.WaiverRuleData.intrest));
      setReason(customerData.reason);

      setPrincipalPercentage(
        customerData.principal_amt == 0
          ? 0
          : calculatePercentage(
              customerData.principal_amt,
              customerData.approved_principal
            )
      );

      setIntrestPercentage(
        customerData.intrest_amt == 0
          ? 0
          : calculatePercentage(
              customerData.intrest_amt,
              customerData.approved_intrest
            )
      );

      setPenalPercentage(
        customerData.penal_amt == 0
          ? 0
          : calculatePercentage(
              customerData.penal_amt,
              customerData.approved_penal
            )
      );

      if (response.data.success == false) {
        const timer = setTimeout(() => {
          setLoading(false);
          if (response.data.success) {
            showAlert({
              type: "error",
              title: response.data.message,
            });
          }
          setPage404(true);
        }, 1 * 1000); // x is the number of seconds
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (totalAmount, amount) => {
    return ((amount / totalAmount) * 100).toFixed(2);
  };
  const HandlePenal = async (e) => {
    setError(``);
    const value = Number(e.target.value);

    const regex = /^-?\d*\.?\d*$/;

    if (regex.test(value) && value <= penalReq && value > 0) {
      const convertedAmt = calculatePercentage(penalReq, value);
      if (convertedAmt > penalRule) {
        setError(`Max Allowed Penal  ${penalRule}%`);
      } else {
        setPenalPercentage(convertedAmt);
        setUpdatedPenal(value);
      }
    } else {
      setError(`Max Allowed Penal  ${penalRule}%`);
      setPenalPercentage(0);
      setUpdatedPenal(0);
    }
  };
  const HandlePrincipal = async (e) => {
    setError(``);
    const value = Number(e.target.value);
    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(value) && value <= principalReq && value > 0) {
      const convertedAmt = calculatePercentage(principalReq, value);
      if (convertedAmt > principalRule) {
        setError(`Max Allowed Principal  ${principalRule}%`);
        setUpdatedPrincipal(0);
        setPrincipalPercentage(0);
      } else {
        setUpdatedPrincipal(value);
        setPrincipalPercentage(convertedAmt);
      }
    } else {
      setError(`Max Allowed Principal  ${principalRule}%`);
      setUpdatedPrincipal(0);
      setPrincipalPercentage(0);
    }
  };
  const HandleIntrest = async (e) => {
    setError(``);
    const value = Number(e.target.value);

    const regex = /^-?\d*\.?\d*$/;

    if (regex.test(value) && value <= intrestReq && value > 0) {
      const convertedAmt = calculatePercentage(intrestReq, value);
      if (convertedAmt > intrestRule) {
        setError(`Max Allowed Interest  ${intrestRule}%`);
      } else {
        setUpdatedIntrest(value);
        setIntrestPercentage(convertedAmt);
      }
    } else {
      setError(`Max Allowed Interest  ${intrestRule}%`);
      setUpdatedIntrest(0);
      setIntrestPercentage(0);
    }
  };
  const handleReason = async (e) => {
    setError(``);
    const value = e.target.value;
    const Trimvalue = e.target.value.trim();

    if (!Trimvalue.length) {
      setError(`Reason is Mandotry`);
      setReason("");
    } else {
      setReason(value);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requestData = {
      waiverId: waiverData.id,
      updatedPrincipal: updatedPrincipal,
      updatedPenal: updatedPenal,
      updatedIntrest: updatedIntrest,
      reason: reason.trim(),
      isApproved: 1,
    };
    if (
      updatedPrincipal <= 0 &&
      updatedPenal <= 0 &&
      updatedIntrest <= 0 &&
      reason.length == 0
    ) {
      showAlert({
        type: "error",
        title: "Invalid Form Submission",
      });
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          "/api/users/approveWaiver", // Ensure the path starts with '/api'
          requestData
        );

        if (response.data.success == false) {
          const timer = setTimeout(() => {
            setLoading(false);
            if (response.data.success) {
              showAlert({
                type: "error",
                title: response.data.message,
              });
            }
          }, 1 * 1000); // x is the number of seconds
          return () => clearTimeout(timer);
        }
        if (response.data.success == true) {
          const timer = setTimeout(() => {
            setLoading(false);
            if (response.data.success) {
              showAlert({
                type: "success",
                title: response.data.message,
              });
            }
            navigate("/WaiverRequests");
          }, 1 * 1000); // x is the number of seconds
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const HandleReject = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requestData = {
      waiverId: waiverData.id,
      updatedPrincipal: 0,
      updatedPenal: 0,
      updatedIntrest: 0,
      reason: reason.trim(),
      isApproved: 0,
    };
    if (
      updatedPrincipal <= 0 &&
      updatedPenal <= 0 &&
      updatedIntrest <= 0 &&
      reason.length == 0
    ) {
      showAlert({
        type: "error",
        title: "Invalid Form Submission",
      });
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          "/api/users/approveWaiver", // Ensure the path starts with '/api'
          requestData
        );

        if (response.data.success == false) {
          const timer = setTimeout(() => {
            setLoading(false);
            if (response.data.success) {
              showAlert({
                type: "error",
                title: response.data.message,
              });
            }
          }, 1 * 1000); // x is the number of seconds
          return () => clearTimeout(timer);
        }
        if (response.data.success == true) {
          const timer = setTimeout(() => {
            setLoading(false);
            if (response.data.success) {
              showAlert({
                type: "success",
                title: response.data.message,
              });
            }
            navigate("/WaiverRequests");
          }, 1 * 1000); // x is the number of seconds
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (page404) {
    return <Page404 />;
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex space-x-4 text-gray-700">
            {/* Left card for customer details */}
            <div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>
              <div className="space-y-2">
                <div className="flex flex-wrap">
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Principal:</p>
                    <p className="w-1/2">
                      {waiverData.prin_overdue
                        ? waiverData.prin_overdue.toFixed(2)
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Penal:</p>
                    <p className="w-1/2">
                      {waiverData.penal_due
                        ? waiverData.penal_due.toFixed(2)
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Interest:</p>
                    <p className="w-1/2">
                      {waiverData.overdue_int
                        ? waiverData.overdue_int.toFixed(2)
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">DOB:</p>
                    <p className="w-1/2">
                      {waiverData.dob ? waiverData.dob : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">AGE:</p>
                    <p className="w-1/2">
                      {waiverData.age ? waiverData.age : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Phone:</p>
                    <p className="w-1/2">
                      {waiverData.phone_number ? waiverData.phone_number : "-"}
                    </p>
                  </div>

                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Last EMI:</p>
                    <p className="w-1/2">
                      {waiverData.last_emi_date
                        ? waiverData.last_emi_date
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Last payment:</p>
                    <p className="w-1/2">
                      {waiverData.date_of_last_payment
                        ? waiverData.date_of_last_payment
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">LoanID:</p>
                    <p className="w-1/2">{waiverData.loanId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right card for the form */}
            <div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Agency Details</h2>
              <div className="space-y-2">
                <div className="flex flex-wrap">
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Agency Name:</p>
                    <p className="w-1/2">
                      {waiverData.agencyDetails.nbfc_name}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Email:</p>
                    <p className="w-1/2">{waiverData.agencyDetails.email}</p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Phone:</p>
                    <p className="w-1/2">{waiverData.agencyDetails.mobile}</p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Requested Date:</p>
                    <p className="w-1/2">
                      {" "}
                      <ChangeDateFormate
                        date={
                          waiverData.created_date
                            ? waiverData.created_date
                            : "-"
                        }
                      />
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Products</p>
                    <p className="w-1/2">{waiverData.PoolData.product}</p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Buckets</p>
                    <p className="w-1/2">
                      {getBucketName(waiverData.PoolData.bucket)}
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Waiver Expiry</p>
                    <p className="w-1/2">
                      {" "}
                      <ChangeDateFormate
                        date={waiverData.WaiverRuleData.expiry_date}
                      />
                    </p>
                  </div>
                  <div className="w-full flex mb-2">
                    <p className="font-semibold w-1/2">Policy Expiry</p>
                    <p className="w-1/2">
                      <ChangeDateFormate date={waiverData.scheme_expiry} />
                      {waiverData.isExpired ? " (Scheme Expired)" : " (Active)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 text-gray-700 mt-2">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Waiver Details</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form className="space-y-4" onSubmit={HandleSubmit}>
                <div className="flex items-center">
                  <label className="w-3/4" htmlFor="name">
                    Principal Request (₹):
                  </label>
                  <input
                    disabled={true}
                    value={principalReq}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Max Allowed (%):
                  </label>
                  <input
                    disabled={true}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                    value={principalRule}
                  />
                  <label className="w-3/4" htmlFor="name">
                    Waiver in (%):
                  </label>
                  <input
                    disabled={true}
                    value={principalPercentage}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Principal Approved (₹):
                  </label>
                  <input
                    value={updatedPrincipal}
                    onChange={HandlePrincipal}
                    className="w-1/4 p-2 border rounded"
                    type="number"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-3/4" htmlFor="name">
                    Penal Request (₹):
                  </label>
                  <input
                    disabled={true}
                    value={penalReq}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Max Allowed (%):
                  </label>
                  <input
                    disabled={true}
                    value={penalRule}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Waiver in (%):
                  </label>
                  <input
                    disabled={true}
                    value={penalPercentage}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Penal Approved (₹):
                  </label>
                  <input
                    value={updatedPenal}
                    onChange={HandlePenal}
                    className="w-1/4 p-2 border rounded"
                    type="number"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-3/4" htmlFor="name">
                    Interest Request (₹):
                  </label>
                  <input
                    disabled={true}
                    value={intrestReq}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Max Allowed (%):
                  </label>
                  <input
                    disabled={true}
                    value={intrestRule}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Waiver in (%):
                  </label>
                  <input
                    disabled={true}
                    value={intrestPercentage}
                    className="w-1/4 p-2 border rounded"
                    type="text"
                  />
                  <label className="w-3/4" htmlFor="name">
                    Interest Approved (₹):
                  </label>
                  <input
                    value={updatedIntrest}
                    onChange={HandleIntrest}
                    className="w-1/4 p-2 border rounded"
                    type="number"
                  />
                </div>
                <div className="flex items-center">
                  <textarea
                    value={reason}
                    onChange={handleReason}
                    className="w-full p-2 border rounded"
                    type="textarea"
                    placeholder="Enter the reason for approval / rejection the waiver"
                  />
                </div>

                {!waiverData.isExpired && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={HandleReject}
                      className="px-4 py-2 text-white bg-red-500 rounded"
                    >
                      Reject
                    </button>
                    <button
                      onClick={HandleSubmit}
                      className="px-4 py-2 text-white bg-blue-500 rounded"
                    >
                      Re Approve
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WaiverDetails;
