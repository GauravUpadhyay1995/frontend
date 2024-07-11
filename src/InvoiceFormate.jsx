import React, { useState, useEffect } from 'react';

const Invoice = React.forwardRef(({ ectraCh, month, year, data, agency, NBFC, accountDetails }, ref) => {
    const [SubTotal, setSubTotal] = useState(0);
    const [GrandTotal, setGrandTotal] = useState(0);
    const [gstTotal, setGstTotal] = useState(0);
    const [amountInWord, setAmountInWord] = useState('');
    const [extraCharge, setExtraCharge] = useState(0);
    useEffect(() => {
        let total = 0;
        let extraChargeTotal = 0;

        Object.keys(data).forEach(productKey => {
            const productData = data[productKey];
            Object.keys(productData).forEach(timeFrame => {
                const { resolved_pos, slabValue } = productData[timeFrame];
                if (slabValue?.offer_percentage) {
                    total += parseFloat(((slabValue.offer_percentage / 100) * resolved_pos).toFixed(2));
                } else if (slabValue?.fixed_percentage) {
                    total += parseFloat(((slabValue.fixed_percentage / 100) * resolved_pos).toFixed(2));
                }
            });
        });
        if (ectraCh != null) {
            Object.keys(ectraCh).forEach(Key => {
                const { waiver_approved, penalty, penalty_type } = ectraCh[Key];
                const waiver = parseFloat(waiver_approved) || 0;
                const penaltyValue = parseFloat(penalty) || 0;
                if (penalty_type == 1) {
                    if (waiver > 0) {
                        extraChargeTotal += parseFloat(waiver.toFixed(2));
                    } else {
                        extraChargeTotal += parseFloat(penaltyValue.toFixed(2));
                    }
                } else {
                    if (waiver > 0) {

                        extraChargeTotal += parseFloat(((waiver / 100) * total).toFixed(2));
                    } else {
                        extraChargeTotal += parseFloat(((penaltyValue / 100) * total).toFixed(2));
                    }

                }


            });
            setExtraCharge(extraChargeTotal);
        }

        setSubTotal(total);
    }, [data, ectraCh]); // Don't forget to add ectraCh to the dependency array



    useEffect(() => {
        const gst = (18 / 100) * (SubTotal - extraCharge);
        setGstTotal(gst);
        setGrandTotal(SubTotal + gst);
    }, [SubTotal]);

    useEffect(() => {
        const words = convertNumberToWords(parseFloat(GrandTotal).toFixed(2));
        setAmountInWord(words);
    }, [GrandTotal]);

    const renderRows = () => {


        return (
            <>
                {
                    Object.keys(data).map((productKey, index) => {
                        const productData = data[productKey];
                        return (
                            <div key={index} className="my-8">
                                <h2 className="text-xl font-semibold text-center">{productKey}</h2>
                                <table className="min-w-full mt-4 table-auto">
                                    <thead className="border-b border-gray-300 text-gray-900">
                                        <tr>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Bucket</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Total POS</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Resolved POS</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">POS</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Fixed</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Min</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Offer</th>
                                            <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Total Amt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(productData).map((timeFrame, idx) => {
                                            const { total_pos, resolved_pos, percentage_pos, slabValue } = productData[timeFrame];
                                            return (
                                                <tr key={`${index}-${idx}`} className="border-b border-gray-200">
                                                    <td className=" text-center text-sm font-medium text-gray-900">{timeFrame}</td>
                                                    <td className=" text-center text-sm text-gray-500">{parseFloat(total_pos).toFixed(2)}</td>
                                                    <td className=" text-center text-sm text-gray-500">{parseFloat(resolved_pos).toFixed(2)}</td>
                                                    <td className=" text-center text-sm text-gray-500">{parseFloat(percentage_pos).toFixed(2)}%</td>
                                                    <td className=" text-center text-sm text-gray-500">{slabValue?.fixed_percentage ? slabValue.fixed_percentage + '%' : 0}</td>
                                                    <td className=" text-center text-sm text-gray-500">{slabValue?.min_percentage ? slabValue.min_percentage + '%' : 0}</td>
                                                    <td className=" text-center text-sm text-gray-500">{slabValue?.offer_percentage ? slabValue.offer_percentage + '%' : 0}</td>
                                                    <td className=" text-center text-sm text-gray-500">{slabValue?.offer_percentage ? (parseFloat(((slabValue.offer_percentage / 100) * resolved_pos)).toFixed(2)) : slabValue?.fixed_percentage ? (parseFloat((slabValue.fixed_percentage / 100) * resolved_pos)).toFixed(2) : 0}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })


                }
                {
                    extraCharge != 0 && (

                        <div>
                            <table className="min-w-full mt-4 table-auto">
                                <thead className="border-b border-gray-300 text-gray-900">
                                    <tr>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Duration</th>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Fine Type</th>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Fine Apply</th>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Requested </th>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Approved </th>
                                        <th scope="col" className=" text-center text-sm font-semibold text-gray-900">Total </th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(ectraCh).map((timeFrame, idx) => {

                                        const { waiver_approved, penalty, penalty_type, waiver_request, fromDate, toDate } = ectraCh[timeFrame];
                                        const waiver = parseFloat(waiver_approved) || 0;
                                        const penaltyValue = parseFloat(penalty) || 0;
                                        let Total = 0;
                                        if (penalty_type == 1) {
                                            if (waiver > 0) {
                                                Total += parseFloat(waiver.toFixed(2));
                                            } else {
                                                Total += parseFloat(penaltyValue.toFixed(2));
                                            }
                                        } else {
                                            if (waiver > 0) {

                                                Total += parseFloat(((waiver / 100) * SubTotal).toFixed(2));
                                            } else {
                                                Total += parseFloat(((penaltyValue / 100) * SubTotal).toFixed(2));
                                            }

                                        }
                                        return (
                                            <tr key={`${idx}`} className="border-b border-gray-200">
                                                <td className=" text-center text-sm font-medium text-gray-900">{fromDate}<br/>{toDate}
                                                </td>
                                                <td className=" text-center text-sm font-medium text-gray-900">{penalty_type == 1 ? 'FIXED' : '%'}
                                                </td>
                                                <td className=" text-center text-sm text-gray-500">{parseFloat(penaltyValue).toFixed(2)}
                                                </td>

                                                <td className=" text-center text-sm font-medium text-gray-900">{parseFloat(waiver_request).toFixed(2)}
                                                </td>
                                                <td className=" text-center text-sm text-gray-500">{parseFloat(waiver).toFixed(2)}
                                                </td>
                                                <td className=" text-center text-sm text-gray-500">{Total}</td>


                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
            </>
        )
    };

    function convertNumberToWords(amount) {
        const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

        const zero = "Zero";
        const arab = "Arab";
        const crore = "Crore";
        const lakh = "Lakh";
        const thousand = "Thousand";
        const hundred = "Hundred";
        const currency = "Rupees";
        const paisa = "Paisa";
        const only = "Only";
        if (amount === 0) return `${zero} ${currency} ${only}`;

        function convert(num) {
            let parts = [];
            if (num >= 1e9) {
                parts.push(`${convert(Math.floor(num / 1e9))} ${arab}`);
                num %= 1e9;
            }
            if (num >= 1e7) {
                parts.push(`${convert(Math.floor(num / 1e7))} ${crore}`);
                num %= 1e7;
            }
            if (num >= 1e5) {
                parts.push(`${convert(Math.floor(num / 1e5))} ${lakh}`);
                num %= 1e5;
            }
            if (num >= 1000) {
                parts.push(`${convert(Math.floor(num / 1000))} ${thousand}`);
                num %= 1000;
            }
            if (num >= 100) {
                parts.push(`${convert(Math.floor(num / 100))} ${hundred}`);
                num %= 100;
            }
            if (num >= 20) {
                parts.push(`${tens[Math.floor(num / 10)]}`);
                if (num % 10 > 0) parts.push(units[num % 10]);
            } else if (num >= 10) {
                parts.push(`${teens[num - 10]}`);
            } else if (num > 0) {
                parts.push(`${units[num]}`);
            }
            return parts.join(" ");
        }

        let integerPart = Math.floor(amount);
        let wholeWordPart = convert(integerPart);
        let result = wholeWordPart ? `${wholeWordPart} ${currency}` : '';

        let decimalPart = Math.round((amount - integerPart) * 100);
        if (decimalPart > 0) {
            if (wholeWordPart) {
                result += " and ";
            }
            result += `${convert(decimalPart)} ${paisa}`;
        }

        return `${result} ${only}`;
    }
    function getCurrentDate() {
        // Get current date/time
        const now = new Date();

        // Format date/time
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero based
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currenctDate = `${date}/${month}/${year}-${hours}:${minutes}:${seconds}`;

        return currenctDate;
    }
    function getDueDate() {
        // Get current date/time
        const now = new Date();

        // Add 7 days to current date
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + 6);

        // Format dueDate
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
        const date = String(dueDate.getDate()).padStart(2, '0');
        const hours = String(dueDate.getHours()).padStart(2, '0');
        const minutes = String(dueDate.getMinutes()).padStart(2, '0');
        const seconds = String(dueDate.getSeconds()).padStart(2, '0');
        const formattedDueDate = `${date}/${month}/${year}-${hours}:${minutes}:${seconds}`;

        return formattedDueDate;
    }

    function generateInvoiceNumber(agencyID) {
        // Get current date/time
        const now = new Date();

        // Format date/time
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero based
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Combine agency ID and formatted date/time
        const invoiceNumber = `${agencyID}-${year}${month}${date}-${hours}${minutes}${seconds}`;

        return invoiceNumber;
    }

    return (
        <div ref={ref} className="ml-36 mr-36 mx-auto p-6 bg-white rounded shadow-sm my-6 border border-black" id="invoice">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 text-8xl text-black opacity-10 whitespace-nowrap pointer-events-none z-0">
                INVOICE
            </div>

            <div className="grid grid-cols-2 pb-3 border-b-2 border-grey-100  p-4">
                <div>
                    <img src="../public/logo.png" alt="company-logo" height="100" width="50%" />
                </div>
                <div className="text-right">
                    <p>{agency.registered_address}</p>
                    <p>{agency.office_address}</p>

                    <p className="">GSTIN : {agency.gst_number}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 items-center mt-1  border-b-4 border-green-500 pb-4">
                <div>
                    <p className="font-bold text-gray-800">Bill to :</p>
                    <p className="text-gray-500">{NBFC.registered_address}.<br />{NBFC.office_address}</p>
                    <p className="text-gray-500">{NBFC.email}</p>
                </div>

                <div className="text-right">
                    <p>Invoice No: <span className="text-gray-500">AGCY-{generateInvoiceNumber(agency.id)}</span></p>
                    <p>Invoice date: <span className="text-gray-500">{getCurrentDate()}</span><br />Due date: <span className="text-gray-500">{getDueDate()}</span><br />Month: <span className="text-gray-500">{month}-{year}</span></p>
                </div>
            </div>

            <div className="-mx-4 mt-8 ml-2 mr-2">
                {renderRows()}
            </div>
            <div className='grid  grid-cols-2 mt-8 border-t-4 border-green-500 pt-4'>
                <div className="">
                    <p className="text-lg font-semibold">Total In Words:</p>
                    <p className="text-lg font-semibold"> {amountInWord}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-semibold">Sub Total(A): <span className="text-gray-900">{parseFloat(SubTotal).toFixed(2)}</span></p>
                    <p className="text-xl font-semibold">Tot. Penalty (B): <span className="text-gray-900">{parseFloat(extraCharge).toFixed(2)}</span></p>
                    <p className="text-xl font-semibold">18% GST (C): <span className="text-gray-900">{parseFloat(gstTotal).toFixed(2)}</span></p>
                    <p className="text-xl font-semibold">Grand Total (A-B+C): <span className="text-gray-900">{parseFloat(GrandTotal).toFixed(2)}</span></p>
                </div>
            </div>
            <div className='grid  grid-cols-2 '>
                <div className="border-t-2 pt-4 text-xs text-gray-500 mt-8">
                    <p className=" font-bold">Account Details:</p>
                    <p className="">Name: {accountDetails.beneficiary_name}</p>
                    <p className="">Bank:  {accountDetails.bank_name}</p>
                    <p className="">Account No. {accountDetails.acc_number}</p>
                    <p className="">IFSC Code:  {accountDetails.ifsc}</p>
                    <p className=""> {accountDetails.branch_name}</p>
                </div>

                <div className="border-t-2 pt-4 text-xs text-gray-500 mt-8">
                    <p className=" font-bold">Terms & Conditions</p>
                    <ol className="list-decimal list-inside  ml-6">
                        <li>Payment may please be made in 7 days.</li>
                        <li>18% p.a. interest shall be levied on delayed payment.</li>
                        <li>Any discrepancy in the bill may be raised within 3 days.</li>
                    </ol>
                </div>
            </div>



            <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-2">
                This is system generated invoice. No signature required.
            </div>
        </div>

    );
});

export default React.memo(Invoice);
