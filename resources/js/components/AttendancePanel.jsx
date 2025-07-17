import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';

// Helper function to get cookies
const getCookie = (name) => {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Create an axios instance with default config
const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const AttendancePanel = ({ selectedStudent }) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // 'all', 'week', 'month', 'custom'

    // Fetch attendance report
    const fetchAttendanceReport = useCallback(async () => {
        try {
            setLoading(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const response = await api.get(`/api/student-attendance/report?filter_type=${filterType}&student_id=${selectedStudent.id}`, {
                headers: {
                    'Authorization': userData.token
                }
            });

            if (response.data) {
                setAttendanceData(response.data);
            }
        } catch (error) {
            console.error('Error fetching attendance report:', error);
            toast.error('Failed to fetch attendance report');
        } finally {
            setLoading(false);
        }
    }, [filterType, selectedStudent]);

    // Initial data fetch
    useEffect(() => {
        if (selectedStudent) {
            fetchAttendanceReport();
        }
    }, [selectedStudent, fetchAttendanceReport]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                <div className="flex items-center space-x-4">
                    <Tooltip title="Coming Soon" arrow placement="top">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Check In
                        </button>
                    </Tooltip>
                    <Tooltip title="Coming Soon" arrow placement="top">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Check Out
                        </button>
                    </Tooltip>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg shadow-sm bg-white/90"
                    >
                        <option value="all">All Time</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-blue-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Days</p>
                            <p className="text-lg font-semibold text-gray-900">{attendanceData?.total_days || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <ClockIcon className="h-6 w-6 text-green-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Present Days</p>
                            <p className="text-lg font-semibold text-gray-900">{attendanceData?.present_days || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-purple-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Absent Days</p>
                            <p className="text-lg font-semibold text-gray-900">{attendanceData?.absent_days || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <ClockIcon className="h-6 w-6 text-yellow-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Attendance %</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {attendanceData?.total_days > 0 
                                    ? Math.round((attendanceData.present_days / attendanceData.total_days) * 100) 
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Details Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance Details</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceData?.attendance_details?.map((record, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.check_in || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.check_out || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.duration ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                record.status === 'Present' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePanel; 