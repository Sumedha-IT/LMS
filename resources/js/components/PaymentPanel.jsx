import React from 'react';

const PaymentPanel = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Management</h2>
                <p className="text-xl text-gray-600 mb-8">Coming Soon</p>
                <div className="w-24 h-24 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                    <span className="text-4xl">💰</span>
                </div>
                <p className="text-gray-500">We're working on bringing you a comprehensive payment management system.</p>
            </div>
        </div>
    );
};

export default PaymentPanel; 