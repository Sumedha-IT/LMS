import React, { useState } from "react";
const PaymentDetails = () => {
  const [activeTab, setActiveTab] = useState("admission");

  // Sample data for Admission/Fee
  const courseDetails = {
    name: "PHYSICAL DESIGN",
    registeredOn: "09/10/2023",
  };

  const amountDetails = {
    totalCost: 86480,
    discount: 0,
    netAmount: 86480,
    paidAmount: 15000,
    pendingFee: 71480,
  };

  const installments = [
    { name: "Installment 1", status: "Cleared", dueDate: "09 Oct 2023", amount: 5000, due: 0, paidOn: "09 Oct 2023", invoice: true },
    { name: "Installment 2", status: "Pending", dueDate: "09 Oct 2023", amount: 20000, due: 10000, paidOn: "31 Jul 2024", invoice: true },
    { name: "Installment 3", status: "Pending", dueDate: "09 Nov 2023", amount: 20494, due: 20494, paidOn: null, invoice: true },
    { name: "Installment 4", status: "Pending", dueDate: "09 Dec 2023", amount: 20493, due: 20493, paidOn: null, invoice: true },
    { name: "Installment 5", status: "Pending", dueDate: "09 Jan 2024", amount: 20493, due: 20493, paidOn: null, invoice: true },
  ];

  // Sample data for Payments
  const payments = [
    { receiptNo: "#46", paidOn: "09 Oct 2023", mode: "UPI", refNo: "", amountPaid: 5000 },
    { receiptNo: "#56", paidOn: "31 Jul 2024", mode: "UPI", refNo: "123", amountPaid: 10000 },
  ];

  return (
    <div className="p-6">
   
      {/* Admission/Fee View */}
      {activeTab === "admission" && (
        <div className="flex">
          {/* Course and Installment Details */}
          <div className="w-2/3">

            {/* Course Details */}
            <div className="bg-yellow-100 p-4 mb-6 rounded shadow">
              <div className="flex items-center">
                <img src="https://via.placeholder.com/150" alt="Course" className="w-16 h-16 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">{courseDetails.name}</h3>
                  <p className="text-gray-500">Registered On: {courseDetails.registeredOn}</p>
                </div>
              </div>
            </div>

            {/* Installment Table */}
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-2 px-4">Installment Name</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Due Date</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Due</th>
                  <th className="py-2 px-4">Paid On</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              
              <tbody>
                {installments.map((installment, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{installment.name}</td>
                    <td className={`py-2 px-4 ${installment.status === "Cleared" ? "text-green-500" : "text-orange-500"}`}>
                      {installment.status}
                    </td>
                    <td className="py-2 px-4">{installment.dueDate}</td>
                    <td className="py-2 px-4">₹{installment.amount.toLocaleString()}</td>
                    <td className="py-2 px-4">₹{installment.due.toLocaleString()}</td>
                    <td className="py-2 px-4">{installment.paidOn ? installment.paidOn : "-"}</td>
                    <td className="py-2 px-4">
                      {installment.invoice && (
                        <>
                          <a href="#" className="text-orange-500 mr-2">
                            Invoice
                          </a>
                          <button className="bg-orange-500 text-white px-4 py-1 rounded">
                            Pay Now
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Amount Details */}
          <div className="w-1/3 p-4 bg-white shadow rounded ml-6">
            <h4 className="text-lg font-semibold mb-4">Amount Details</h4>
            <ul className="text-gray-700">
              <li className="flex justify-between mb-2">
                <span>Total Cost:</span>
                <span className="font-semibold">₹{amountDetails.totalCost.toLocaleString()}</span>
              </li>
              <li className="flex justify-between mb-2">
                <span>Discount:</span>
                <span className="font-semibold">- ₹{amountDetails.discount}</span>
              </li>
              <li className="flex justify-between mb-2 text-green-600">
                <span>Net Amount:</span>
                <span className="font-semibold">₹{amountDetails.netAmount.toLocaleString()}</span>
              </li>
              <li className="flex justify-between mb-2">
                <span>Paid Amount:</span>
                <span className="font-semibold">₹{amountDetails.paidAmount.toLocaleString()}</span>
              </li>
              <li className="flex justify-between mb-2 text-orange-500">
                <span>Pending Fee:</span>
                <span className="font-semibold">₹{amountDetails.pendingFee.toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentDetails;
