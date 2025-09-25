import React, { useState } from "react";
import { useGetPaymentDataQuery } from "../store/service/user/UserService";
import { useEffect } from "react";
const PaymentDetails = () => {

  const [installments1, setInstallments] = useState([]);
  // Sample data for Admission/Fee
  const courseDetails = {
    // name: "PHYSICAL DESIGN",
    // registeredOn: "09/10/2023",
  };
  const { data, isLoading, isError } = useGetPaymentDataQuery();

  useEffect(() => {
    if (data?.success && data?.data) {
      setInstallments(data.data)
    }
  }, [data])


  const amountDetails = {
    // totalCost: 86480,
    // discount: 0,
    // netAmount: 86480,
    // paidAmount: 15000,
    // pendingFee: 71480,
  };

  const installments = [
    // { name: "Installment 1", status: "Cleared", dueDate: "09 Oct 2023", amount: 5000, due: 0, paidOn: "09 Oct 2023", invoice: true },
    // { name: "Installment 2", status: "Pending", dueDate: "09 Oct 2023", amount: 20000, due: 10000, paidOn: "31 Jul 2024", invoice: true },
    // { name: "Installment 3", status: "Pending", dueDate: "09 Nov 2023", amount: 20494, due: 20494, paidOn: null, invoice: true },
    // { name: "Installment 4", status: "Pending", dueDate: "09 Dec 2023", amount: 20493, due: 20493, paidOn: null, invoice: true },
    // { name: "Installment 5", status: "Pending", dueDate: "09 Jan 2024", amount: 20493, due: 20493, paidOn: null, invoice: true },
  ];

  // Sample data for Payments
  const payments = [
    // { receiptNo: "#46", paidOn: "09 Oct 2023", mode: "UPI", refNo: "", amountPaid: 5000 },
    // { receiptNo: "#56", paidOn: "31 Jul 2024", mode: "UPI", refNo: "123", amountPaid: 10000 },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading payment details</div>
        </div>
      </div>
    );
  }

  // Generate installment data from payment record
  const generateInstallments = (payment) => {
    if (!payment) return [];
    
    const installments = [];
    const totalInstallments = payment.no_of_installments;
    const installmentAmount = payment.installment_amount;
    const paidAmount = payment.paid_amount;
    const totalPaid = Math.floor(paidAmount / installmentAmount);
    
    for (let i = 1; i <= totalInstallments; i++) {
      const isPaid = i <= totalPaid;
      const isPartial = i === totalPaid + 1 && paidAmount % installmentAmount > 0;
      
      installments.push({
        id: i,
        name: `Instalment ${i}`,
        status: isPaid ? "Paid" : isPartial ? "Partial" : "Pending",
        amount: installmentAmount,
        dueDate: "9/10/24", // You can calculate this based on payment creation date
        paidOn: isPaid ? "9/10/24" : null,
        isPaid: isPaid,
        isPartial: isPartial
      });
    }
    
    return installments;
  };

  const installmentData = data?.data && data.data.length > 0 ? generateInstallments(data.data[0]) : [];
  const payment = data?.data && data.data.length > 0 ? data.data[0] : null;

  return (
    <div className="p-6 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>

      <div className="flex gap-6">
        {/* Installment Cards */}
        <div className="flex-1">
          <div className="space-y-4">
            {installmentData.length > 0 ? (
              installmentData.map((installment) => (
                <div key={installment.id} className="rounded-lg p-4 text-white shadow-lg" style={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-5 gap-4 text-sm flex-1">
                      <div>
                        <span className="text-orange-200 block mb-1 text-xs font-medium">Instalment Name</span>
                        <div className="font-semibold text-lg">{installment.name}</div>
                      </div>
                      <div>
                        <span className="text-orange-200 block mb-1 text-xs font-medium">Status</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            installment.status === "Paid" 
                              ? "bg-green-500 text-white" 
                              : installment.status === "Partial"
                              ? "bg-yellow-500 text-white"
                              : "text-white"
                          }`} style={installment.status === "Pending" ? { background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' } : {}}>
                            {installment.status}
                          </span>
                          {installment.isPaid && (
                            <span className="text-orange-200 flex items-center gap-1 text-xs">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Invoice
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-orange-200 block mb-1 text-xs font-medium">Amount</span>
                        <div className="font-semibold text-lg">₹{installment.amount}</div>
                      </div>
                      <div>
                        <span className="text-orange-200 block mb-1 text-xs font-medium">Due Date</span>
                        <div className="font-semibold text-lg">{installment.dueDate}</div>
                      </div>
                      <div>
                        <span className="text-orange-200 block mb-1 text-xs font-medium">Paid on</span>
                        <div className="font-semibold text-lg">{installment.paidOn || "-"}</div>
                      </div>
                    </div>
                    
                    {/* Action Button at the end */}
                    <div className="ml-6">
                      {installment.isPaid ? (
                        <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-bold">
                          PAID
                        </button>
                      ) : (
                        <button className="text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' }}>
                          PAY
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 text-center shadow-lg">
                <div className="text-gray-500 text-lg">No payment records found</div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Payment Summary</h4>
            
            {payment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Program:</span>
                  <span className="font-semibold text-gray-800">{payment.program}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="font-semibold text-gray-800">₹{payment.total_fee}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Installments:</span>
                  <span className="font-semibold text-gray-800">{payment.no_of_installments}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Per Installment:</span>
                  <span className="font-semibold text-gray-800">₹{payment.installment_amount}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Paid:</span>
                  <span className="font-semibold text-green-600">₹{payment.paid_amount}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Due:</span>
                  <span className="font-semibold text-red-600">₹{payment.remaining_amount}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      payment.status === "completed" 
                        ? "bg-green-100 text-green-800" 
                        : payment.status === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "text-white"
                    }`} style={payment.status === "pending" ? { background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)' } : {}}>
                      {payment.status === "completed" ? "Completed" : payment.status === "partial" ? "Partial" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No payment data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
