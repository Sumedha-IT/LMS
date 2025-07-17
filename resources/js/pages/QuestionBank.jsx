import React, { useState, useEffect, useRef } from 'react';
import LoadingFallback from '../components/DashBoard/LoadingFallback';
import axios from 'axios';
import Lottie from 'lottie-react';
import questionAnimation from '../assets/animations/student.json';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

// Custom CSS animations
const uploadAnimations = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
    transform: scale(1.05);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-slide-in-up {
  animation: slide-in-up 0.5s ease-out;
}
`;

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
        'Accept': 'application/json'
    },
    withCredentials: true
});

const QuestionBank = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showIntro, setShowIntro] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [hideIntro, setHideIntro] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fullText = "Import question banks with questions from Excel/CSV files.";
    const [questionBanks, setQuestionBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [bankQuestions, setBankQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [selectedBankIds, setSelectedBankIds] = useState([]);
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [deleteModal, setDeleteModal] = useState({ open: false, bankId: null });
    const [showFormatRequirements, setShowFormatRequirements] = useState(false);

    // Show intro animation for 3 seconds, then transition
    useEffect(() => {
        const timer = setTimeout(() => {
            setHideIntro(true);
            setTimeout(() => {
                setShowIntro(false);
                setShowContent(true);
            }, 800);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let typingInterval;
        let localText = "";
        let charIndex = 0;
        function typeLoop() {
            if (charIndex < fullText.length) {
                localText += fullText[charIndex];
                setTypedText(localText);
                charIndex++;
                typingInterval = setTimeout(typeLoop, 30);
            }
        }
        typeLoop();
        return () => clearTimeout(typingInterval);
    }, []);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv'
            ];
            
            if (allowedTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please select a valid Excel (.xlsx, .xls) or CSV file.');
                setSelectedFile(null);
            }
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setError(null);

            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            const formData = new FormData();
            formData.append('file', selectedFile);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await api.post('/api/questionBanks/import', formData, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.data.success) {
                setError(null);
                // Show success message using toast instead of alert
                const message = response.data.total_questions 
                    ? `Successfully imported ${response.data.imported_count} question bank(s) with ${response.data.total_questions} questions!`
                    : `Successfully imported ${response.data.imported_count} question bank(s)!`;
                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        background: "#4caf50",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }
                });
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.getElementById('file-upload');
                if (fileInput) fileInput.value = '';
                fetchQuestionBanks();
            } else {
                setError(response.data.message || 'Import failed. Please check your file format.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const downloadTemplate = () => {
        const templateData = [
            ['Type', 'name', 'subject_name', 'question_bank_chapter', 'difficulty_name', 'question_type_name', 'description', 'question', 'question_type', 'marks', 'negative_marks', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_answer'],
            ['BANK', 'Science Quiz', 'Science', 'Physics', 'Beginner', 'MCQ - Single Correct', 'Basic science questions', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Q', '', '', '', '', '', '', 'What is the boiling point of water?', 'MCQ - Single Correct', 1, 0, '90°C', '100°C', '110°C', '120°C', '2'],
            ['Q', '', '', '', '', '', '', 'What planet is known as the Red Planet?', 'MCQ - Single Correct', 1, 0, 'Earth', 'Mars', 'Venus', 'Jupiter', '2'],
            ['Q', '', '', '', '', '', '', 'What gas do plants breathe in?', 'MCQ - Single Correct', 1, 0, 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', '3'],
            ['BANK', 'Math Quiz', 'Mathematics', 'Algebra', 'Beginner', 'MCQ - Single Correct', 'Algebra questions', '', '', '', '', '', '', '', '', ''],
            ['Q', '', '', '', '', '', '', 'What is 2+2?', 'MCQ - Single Correct', 1, 0, '3', '4', '5', '6', '2'],
            ['Q', '', '', '', '', '', '', 'What is 5x3?', 'MCQ - Single Correct', 1, 0, '12', '15', '18', '20', '2'],
            ['Q', '', '', '', '', '', '', 'What is the square root of 16?', 'MCQ - Single Correct', 1, 0, '2', '4', '6', '8', '2'],
        ];
        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Question Bank Import');
        XLSX.writeFile(wb, 'question_bank_grouped_import_sample.xlsx');
    };

    // Fetch question banks
    const fetchQuestionBanks = async () => {
        setLoadingBanks(true);
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            const response = await api.get('/api/questionBanks', {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });
            setQuestionBanks(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch question banks.');
        } finally {
            setLoadingBanks(false);
        }
    };

    useEffect(() => {
        fetchQuestionBanks();
    }, []);

    // Delete a question bank
    const handleDeleteBank = (bankId) => {
        setDeleteModal({ open: true, bankId });
    };

    const confirmDeleteBank = async () => {
        const bankId = deleteModal.bankId;
        setDeleteModal({ open: false, bankId: null });
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            await api.delete(`/api/questionBanks/${bankId}`, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });
            fetchQuestionBanks();
            toast.success('Question bank deleted successfully!', {
                position: "top-center",
                autoClose: 3000,
                style: { background: "#f44336", color: "#fff", borderRadius: "10px" }
            });
        } catch (err) {
            setError('Failed to delete question bank.');
        }
    };

    // Handle individual checkbox
    const handleSelectBank = (id) => {
        setSelectedBankIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedBankIds.length === questionBanks.length) {
            setSelectedBankIds([]);
        } else {
            setSelectedBankIds(questionBanks.map((b) => b.id));
        }
    };

    // Bulk delete
    const handleBulkDelete = () => {
        setDeleteModal({ open: true, bankId: 'bulk' });
    };

    const confirmBulkDelete = async () => {
        setDeleteModal({ open: false, bankId: null });
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            await Promise.all(selectedBankIds.map(id =>
                api.delete(`/api/questionBanks/${id}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                })
            ));
            setSelectedBankIds([]);
            fetchQuestionBanks();
            toast.success('Selected question banks deleted successfully!', {
                position: "top-center",
                autoClose: 3000,
                style: { background: "#f44336", color: "#fff", borderRadius: "10px" }
            });
        } catch (err) {
            setError('Failed to delete selected question banks.');
        }
    };

    // Fetch questions for a specific bank
    const fetchBankQuestions = async (bankId) => {
        setLoadingQuestions(true);
        try {
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);
            const response = await api.get(`/api/questions?questionBankId=${bankId}`, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });
            setBankQuestions(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch questions for this bank.');
        } finally {
            setLoadingQuestions(false);
        }
    };

    // Handle viewing questions
    const handleViewQuestions = async (bank) => {
        setSelectedBank(bank);
        setShowQuestionsModal(true);
        await fetchBankQuestions(bank.id);
    };

    // Close questions modal
    const closeQuestionsModal = () => {
        setShowQuestionsModal(false);
        setSelectedBank(null);
        setBankQuestions([]);
    };

    // Calculate paginated data
    const paginatedBanks = questionBanks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(questionBanks.length / rowsPerPage);

    // Reset to page 1 when questionBanks changes
    useEffect(() => { setCurrentPage(1); }, [questionBanks]);

    if (showIntro) {
        return (
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center transition-all duration-800 ${hideIntro ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="text-center space-y-8">
                    <div className="w-32 h-32 mx-auto">
                        <Lottie animationData={questionAnimation} loop={true} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Question Bank Import
                        </h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                            {typedText}
                            <span className="animate-pulse">|</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{uploadAnimations}</style>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4 animate-fade-in">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Question Bank Import
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Import question banks with their questions from Excel/CSV files quickly and efficiently.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Import Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100 animate-fade-in">
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* File Upload Section */}
                                    <div className="p-6 rounded-xl border border-blue-100 relative overflow-hidden animate-slide-in-up"
                                         style={{
                                             background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3c72 100%)'
                                         }}>
                                        {/* Animated Background Elements */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            {/* Floating particles */}
                                            <div className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                                            <div className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                                            <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-white/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                                            <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                                            
                                            {/* Animated lines */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
                                            
                                            {/* Glowing corners */}
                                            <div className="absolute top-0 left-0 w-4 h-4 bg-white/10 rounded-full animate-pulse-glow"></div>
                                            <div className="absolute top-0 right-0 w-4 h-4 bg-white/10 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                                            <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/10 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/10 rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-4 relative z-10">Upload Question Bank File</h3>
                                        <p className="text-blue-100 mb-6 relative z-10">Select an Excel (.xlsx, .xls) or CSV file containing your question banks and questions.</p>
                                        
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm relative group animate-pulse-glow">
                                                    {/* Upload animation overlay */}
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-white/10 rounded-lg flex items-center justify-center">
                                                            <div className="text-center">
                                                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                                                                <p className="text-white text-sm">Processing...</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <div className="relative">
                                                            <svg className="w-8 h-8 mb-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                            {/* Animated ring around icon */}
                                                            <div className="absolute inset-0 w-8 h-8 border-2 border-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                                            <div className="absolute inset-0 w-8 h-8 border-2 border-white/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                                                        </div>
                                                        <p className="mb-2 text-sm text-white group-hover:text-blue-200 transition-colors">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-blue-100">Excel (.xlsx, .xls) or CSV files only</p>
                                                    </div>
                                                    <input 
                                                        id="file-upload" 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept=".xlsx,.xls,.csv"
                                                        onChange={handleFileSelect}
                                                    />
                                                </label>
                                            </div>

                                            {selectedFile && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium text-green-800">File selected: {selectedFile.name}</p>
                                                            <p className="text-xs text-green-600">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload Progress */}
                                            {isUploading && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm text-white">
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                            Uploading...
                                                        </span>
                                                        <span className="font-medium">{uploadProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                                        <div 
                                                            className="h-3 rounded-full transition-all duration-500 ease-out relative"
                                                            style={{ 
                                                                width: `${uploadProgress}%`,
                                                                background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)'
                                                            }}
                                                        >
                                                            {/* Shimmer effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Success Animation */}
                                            {uploadProgress === 100 && !isUploading && (
                                                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 animate-fade-in">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-green-200">Upload completed successfully!</p>
                                                            <p className="text-xs text-green-300">Processing your question banks...</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleFileUpload}
                                                    disabled={!selectedFile || isUploading}
                                                    className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg"
                                                    style={{
                                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                        boxShadow: '0 2px 8px 0 rgba(235,103,7,0.10)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isUploading) {
                                                            e.target.style.background = 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)';
                                                            e.target.style.boxShadow = '0 4px 12px 0 rgba(235,103,7,0.18)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isUploading) {
                                                            e.target.style.background = 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)';
                                                            e.target.style.boxShadow = '0 2px 8px 0 rgba(235,103,7,0.10)';
                                                        }
                                                    }}
                                                >
                                                    {isUploading ? 'Uploading...' : 'Import Question Banks'}
                                                </button>
                                                <button
                                                    onClick={downloadTemplate}
                                                    className="text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg"
                                                    style={{
                                                        background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                        boxShadow: '0 2px 8px 0 rgba(235,103,7,0.10)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)';
                                                        e.target.style.boxShadow = '0 4px 12px 0 rgba(235,103,7,0.18)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)';
                                                        e.target.style.boxShadow = '0 2px 8px 0 rgba(235,103,7,0.10)';
                                                    }}
                                                >
                                                    Download Template
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instructions Section */}
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">File Format Requirements</h3>
                                            <button
                                                onClick={() => setShowFormatRequirements(!showFormatRequirements)}
                                                className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2 transition-colors"
                                            >
                                                {showFormatRequirements ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                        </svg>
                                                        Hide Details
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                        Show Details
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {showFormatRequirements && (
                                            <div className="space-y-3 text-sm text-gray-700 animate-slide-in-up">
                                            <p><strong>Question Bank Details (Required):</strong></p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li><code className="bg-gray-100 px-1 rounded">name</code> - Name of the question bank</li>
                                                <li><code className="bg-gray-100 px-1 rounded">subject_name</code> - Subject name (e.g., Mathematics, Physics)</li>
                                                <li><code className="bg-gray-100 px-1 rounded">question_bank_chapter</code> - Chapter or topic name</li>
                                                <li><code className="bg-gray-100 px-1 rounded">difficulty_name</code> - Difficulty level (Beginner, Intermediate, Difficult)</li>
                                                <li><code className="bg-gray-100 px-1 rounded">question_type_name</code> - Question type (MCQ - Single Correct, etc.)</li>
                                            </ul>
                                            <p><strong>Question Details (Required):</strong></p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li><code className="bg-gray-100 px-1 rounded">question</code> - The question text</li>
                                                <li><code className="bg-gray-100 px-1 rounded">question_type</code> - Type of question</li>
                                                <li><code className="bg-gray-100 px-1 rounded">marks</code> - Points for the question</li>
                                                <li><code className="bg-gray-100 px-1 rounded">negative_marks</code> - Negative marking value</li>
                                            </ul>
                                            <p><strong>Optional columns:</strong></p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                                <li><code className="bg-gray-100 px-1 rounded">description</code> - Question bank description</li>
                                                <li><code className="bg-gray-100 px-1 rounded">option_1</code> to <code className="bg-gray-100 px-1 rounded">option_10</code> - Multiple choice options</li>
                                                <li><code className="bg-gray-100 px-1 rounded">correct_answer</code> - Correct option number(s). Use single number (e.g., "2") for single correct answer, or comma-separated (e.g., "1,3") for multiple correct answers</li>
                                                <li><code className="bg-gray-100 px-1 rounded">hint</code> - Question hint</li>
                                                <li><code className="bg-gray-100 px-1 rounded">explanation</code> - Answer explanation</li>
                                            </ul>
                                            <p className="mt-4 text-blue-600 font-medium">💡 <strong>Tip:</strong> Multiple questions can belong to the same question bank. Just use the same question bank name, subject, and chapter for related questions. The system will automatically group them together.</p>
                                            <p className="mt-2 text-green-600 font-medium">✅ <strong>How it works:</strong> Questions with the same name, subject, and chapter will be grouped into a single question bank. Each row represents one question that will be added to its respective question bank.</p>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl relative shadow-lg animate-fade-in flex items-center gap-3">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-center items-center py-12">
                                <LoadingFallback />
                            </div>
                        )}

                        {/* Bulk Delete Button - Only show when items are selected */}
                        {selectedBankIds.length > 0 && (
                            <div className="flex justify-end mb-4">
                            <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                                onClick={handleBulkDelete}
                            >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Selected ({selectedBankIds.length})
                            </button>
                        </div>
                        )}

                        {/* List of Question Banks */}
                        <div className="bg-white/90 rounded-2xl shadow-lg p-6 mt-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Imported Question Banks</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        Total: {questionBanks.length} banks
                                    </span>
                                    {selectedBankIds.length > 0 && (
                                        <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                            Selected: {selectedBankIds.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {loadingBanks ? (
                                <div className="flex justify-center items-center py-12">
                                    <LoadingFallback />
                                </div>
                            ) : questionBanks.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">No question banks found.</p>
                                    <p className="text-gray-400 text-sm mt-2">Upload your first question bank to get started!</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                    <thead>
                                            <tr style={{
                                                background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)'
                                            }}>
                                                <th className="p-4 text-left text-white border-r border-white/20">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBankIds.length === questionBanks.length && questionBanks.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="p-4 text-left font-semibold text-white border-r border-white/20">Question Bank Name</th>
                                                <th className="p-4 text-left font-semibold text-white border-r border-white/20">Subject</th>
                                                <th className="p-4 text-left font-semibold text-white border-r border-white/20">Topic</th>
                                                <th className="p-4 text-left font-semibold text-white border-r border-white/20">Difficulty</th>
                                                <th className="p-4 text-left font-semibold text-white border-r border-white/20">Type</th>
                                                <th className="p-4 text-center font-semibold text-white border-r border-white/20">Questions</th>
                                                <th className="p-4 text-center font-semibold text-white">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedBanks.map((bank, index) => (
                                                <tr key={bank.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                    <td className="p-4 border-r border-gray-200">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBankIds.includes(bank.id)}
                                                        onChange={() => handleSelectBank(bank.id)}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                    <td className="p-4 border-r border-gray-200">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{bank.name}</p>
                                                            {bank.description && (
                                                                <p className="text-sm text-gray-500 mt-1">{bank.description}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 border-r border-gray-200">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {bank.subjectName || bank.questionBankSubjectId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-r border-gray-200">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {bank.questionBankChapter || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-r border-gray-200">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {bank.difficultyName || bank.questionBankDifficultyId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-r border-gray-200">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {bank.typeName || bank.questionBankTypeId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center border-r border-gray-200">
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {bank.questionsCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2 justify-center">
                                                    <button
                                                                className="text-white px-3 py-1.5 rounded-md transition-all duration-300 shadow-md text-sm font-medium"
                                                                style={{
                                                                    background: 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)',
                                                                    boxShadow: '0 2px 8px 0 rgba(235,103,7,0.10)'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = 'linear-gradient(270deg, #e42b12 0%, #eb6707 100%)';
                                                                    e.target.style.boxShadow = '0 4px 12px 0 rgba(235,103,7,0.18)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'linear-gradient(270deg, #eb6707 0%, #e42b12 100%)';
                                                                    e.target.style.boxShadow = '0 2px 8px 0 rgba(235,103,7,0.10)';
                                                                }}
                                                        onClick={() => handleViewQuestions(bank)}
                                                    >
                                                                View/Edit
                                                    </button>
                                                    <button
                                                                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                                        onClick={() => handleDeleteBank(bank.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                        </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-4 gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="mx-2">Page {currentPage} of {totalPages}</span>
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Modal */}
            {showQuestionsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Questions for: {selectedBank?.name}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Subject: {selectedBank?.subjectName || selectedBank?.questionBankSubjectId} | 
                                        Chapter: {selectedBank?.questionBankChapter} | 
                                        Difficulty: {selectedBank?.difficultyName || selectedBank?.questionBankDifficultyId}
                                    </p>
                                </div>
                                <button
                                    onClick={closeQuestionsModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {loadingQuestions ? (
                                <div className="flex justify-center items-center py-12">
                                    <LoadingFallback />
                                </div>
                            ) : bankQuestions.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">No questions found in this question bank.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bankQuestions.map((question, index) => (
                                        <div key={question.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Question {index + 1}
                                                </h3>
                                                <div className="flex gap-2 text-sm">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {question.question_type || 'MCQ'}
                                                    </span>
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {question.marks || 0} marks
                                                    </span>
                                                    {question.negative_marks !== 0 && question.negative_marks != null && (
                                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                                            {question.negative_marks > 0 ? '-' : ''}{Math.abs(question.negative_marks)} marks
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="prose max-w-none">
                                                <div 
                                                    className="text-gray-800 mb-4"
                                                    dangerouslySetInnerHTML={{ __html: question.question || 'No question text available' }}
                                                />
                                            </div>

                                            {/* Question Options */}
                                            {question.questions_options && question.questions_options.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">Options:</h4>
                                                    <div className="space-y-2">
                                                        {question.questions_options.map((option, optIndex) => (
                                                            <div key={option.id} className="flex items-center gap-3 p-2 bg-white rounded border">
                                                                <span className="font-medium text-gray-600 w-6">
                                                                    {String.fromCharCode(65 + optIndex)}.
                                                                </span>
                                                                <span
                                                                    className="text-gray-800"
                                                                    dangerouslySetInnerHTML={{ __html: option.option_text || `Option ${optIndex + 1}` }}
                                                                />
                                                                {option.is_correct && (
                                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                                        Correct
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Question Metadata */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    {question.hint && (
                                                        <div>
                                                            <span className="font-medium">Hint:</span> {question.hint}
                                                        </div>
                                                    )}
                                                    {question.explanation && (
                                                        <div>
                                                            <span className="font-medium">Explanation:</span> {question.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deleteModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Confirm Delete</h2>
                        <p className="mb-6 text-gray-700">
                            {deleteModal.bankId === 'bulk'
                                ? `Are you sure you want to delete ${selectedBankIds.length} question bank(s)? This action cannot be undone.`
                                : 'Are you sure you want to delete this question bank? This action cannot be undone.'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                onClick={() => setDeleteModal({ open: false, bankId: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                                onClick={deleteModal.bankId === 'bulk' ? confirmBulkDelete : confirmDeleteBank}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuestionBank; 