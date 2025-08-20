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

    // Function to format question content with proper code formatting
    const formatQuestionContent = (content) => {
        if (!content) return 'No question text available';
        
        // Check if the content contains code-like patterns
        const hasCodePatterns = /(class\s+\w+|function\s+\w+|if\s*\(|for\s*\(|while\s*\(|switch\s*\(|try\s*\{|catch\s*\(|import\s+|export\s+|const\s+|let\s+|var\s+|public\s+|private\s+|protected\s+|static\s+|final\s+|abstract\s+|interface\s+|extends\s+|implements\s+|new\s+|return\s+|break\s+|continue\s+|throw\s+|throws\s+|package\s+|namespace\s+|using\s+|include\s+|require\s+|def\s+|end\s+|begin\s+|initial\s+|always\s+|module\s+|endmodule\s+|wire\s+|reg\s+|input\s+|output\s+|inout\s+|parameter\s+|localparam\s+|assign\s+|always_comb\s+|always_ff\s+|always_latch\s+|posedge\s+|negedge\s+|$display\s*\(|$finish\s*\(|$stop\s*\()/i;
        
        if (hasCodePatterns.test(content)) {
            // Split content into parts: code and regular text
            const parts = content.split(/(```[\s\S]*?```|`[^`]*`)/);
            
            return parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    // Already formatted code block
                    return (
                        <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            <code>{part.slice(3, -3)}</code>
                        </pre>
                    );
                } else if (part.startsWith('`') && part.endsWith('`')) {
                    // Inline code
                    return (
                        <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {part.slice(1, -1)}
                        </code>
                    );
                } else {
                    // Regular text - check if it contains code patterns
                    const lines = part.split('\n');
                    const formattedLines = lines.map((line, lineIndex) => {
                        if (hasCodePatterns.test(line.trim())) {
                            return (
                                <div key={lineIndex} className="bg-gray-100 p-2 rounded font-mono text-sm">
                                    {line}
                                </div>
                            );
                        } else {
                            return <div key={lineIndex}>{line}</div>;
                        }
                    });
                    return <div key={index}>{formattedLines}</div>;
                }
            });
        } else {
            // No code patterns, display as regular text
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
        }
    };

const QuestionBank = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
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
    
    // Edit question modal state
    const [editQuestionModal, setEditQuestionModal] = useState({ open: false, question: null });
    const [editingQuestion, setEditingQuestion] = useState({
        question: '',
        question_type: '',
        marks: 0,
        negative_marks: 0,
        hint: '',
        explanation: '',
        image: null,
        options: []
    });
    const [isSaving, setIsSaving] = useState(false);

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
            console.log('Fetched questions:', response.data.data);
            setBankQuestions(response.data.data || []);
        } catch (err) {
            console.error('Error fetching questions:', err);
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

    // Edit question functions
    const handleEditQuestion = (question) => {
        setEditingQuestion({
            id: question.id,
            question: question.question || '',
            question_type: question.question_type || '',
            marks: question.marks || 0,
            negative_marks: question.negative_marks || 0,
            hint: question.hint || '',
            explanation: question.explanation || '',
            image: question.image || null,
            options: question.questions_options ? question.questions_options.map(opt => ({
                id: opt.id,
                option: opt.option || opt.option_text || '',
                is_correct: opt.is_correct || false
            })) : []
        });
        setEditQuestionModal({ open: true, question });
    };

    const closeEditModal = () => {
        setEditQuestionModal({ open: false, question: null });
        setEditingQuestion({
            question: '',
            question_type: '',
            marks: 0,
            negative_marks: 0,
            hint: '',
            explanation: '',
            image: null,
            options: []
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEditingQuestion(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleOptionChange = (index, field, value) => {
        setEditingQuestion(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => 
                i === index ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const handleCorrectAnswerChange = (index) => {
        setEditingQuestion(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => ({
                ...opt,
                is_correct: i === index
            }))
        }));
    };

    const addOption = () => {
        setEditingQuestion(prev => ({
            ...prev,
            options: [...prev.options, { option: '', is_correct: false }]
        }));
    };

    const removeOption = (index) => {
        setEditingQuestion(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const saveQuestion = async () => {
        try {
            setIsSaving(true);
            const userInfo = getCookie("user_info");
            const userData = JSON.parse(userInfo);

            let requestData;
            let headers = {
                'Authorization': `Bearer ${userData.token}`
            };

            // If there's an image, use FormData, otherwise use JSON
            if (editingQuestion.image && editingQuestion.image instanceof File) {
                const formData = new FormData();
                formData.append('_method', 'PUT'); // Simulate PUT request
                formData.append('question', editingQuestion.question);
                formData.append('question_type', editingQuestion.question_type);
                formData.append('marks', editingQuestion.marks);
                formData.append('negative_marks', editingQuestion.negative_marks);
                formData.append('hint', editingQuestion.hint || '');
                formData.append('explanation', editingQuestion.explanation || '');
                formData.append('image', editingQuestion.image);
                
                editingQuestion.options.forEach((option, index) => {
                    formData.append(`options[${index}][option]`, option.option);
                    formData.append(`options[${index}][is_correct]`, option.is_correct ? '1' : '0');
                    if (option.id) {
                        formData.append(`options[${index}][id]`, option.id);
                    }
                });
                
                requestData = formData;
                // Use POST method but with _method=PUT to simulate PUT
                console.log('Sending FormData with image:', editingQuestion.image.name);
            } else {
                requestData = {
                    question: editingQuestion.question,
                    question_type: editingQuestion.question_type,
                    marks: editingQuestion.marks,
                    negative_marks: editingQuestion.negative_marks,
                    hint: editingQuestion.hint || '',
                    explanation: editingQuestion.explanation || '',
                    options: editingQuestion.options.map(option => ({
                        option: option.option,
                        is_correct: option.is_correct ? '1' : '0',
                        id: option.id
                    }))
                };
                headers['Content-Type'] = 'application/json';
                console.log('Sending JSON data:', requestData);
            }

            // Use POST for FormData, PUT for JSON
            const method = (editingQuestion.image && editingQuestion.image instanceof File) ? 'post' : 'put';
            const response = await api[method](`/api/questionBanks/questions/${editingQuestion.id}`, requestData, {
                headers: headers
            });

            if (response.data.success) {
                setSuccess('Question updated successfully!');
                closeEditModal();
                // Refresh questions
                if (selectedBank) {
                    fetchBankQuestions(selectedBank.id);
                }
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to update question');
            }
        } catch (error) {
            console.error('Error updating question:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = Object.values(error.response.data.errors).flat();
                setError(errorMessages.join(', '));
            } else {
                setError('Failed to update question');
            }
        } finally {
            setIsSaving(false);
        }
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

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl relative shadow-lg animate-fade-in flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="block sm:inline">{success}</span>
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
                                                <div className="flex gap-2 items-center">
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
                                                    <button
                                                        onClick={() => handleEditQuestion(question)}
                                                        className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="prose max-w-none">
                                                <div className="text-gray-800 mb-4">
                                                    {formatQuestionContent(question.question)}
                                                </div>
                                                {question.image && (
                                                    <div className="mt-4 relative inline-block">
                                                        <img 
                                                            src={`/${question.image}`} 
                                                            alt="Question" 
                                                            className="max-w-full h-auto rounded-lg border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105"
                                                            style={{ maxHeight: '400px' }}
                                                            onClick={() => {
                                                                const modal = document.createElement('div');
                                                                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                                                modal.innerHTML = `
                                                                    <div class="relative max-w-4xl max-h-full">
                                                                        <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10" onclick="this.parentElement.parentElement.remove()">
                                                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <img src="/${question.image}" alt="Question" class="max-w-full max-h-full object-contain rounded-lg" />
                                                                    </div>
                                                                `;
                                                                modal.onclick = (e) => {
                                                                    if (e.target === modal) modal.remove();
                                                                };
                                                                document.body.appendChild(modal);
                                                            }}
                                                        />
                                                        <button
                                                            className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1 transition-colors"
                                                            onClick={() => {
                                                                const modal = document.createElement('div');
                                                                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                                                modal.innerHTML = `
                                                                    <div class="relative max-w-4xl max-h-full">
                                                                        <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10" onclick="this.parentElement.parentElement.remove()">
                                                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                            </svg>
                                                                        </button>
                                                                        <img src="/${question.image}" alt="Question" class="max-w-full max-h-full object-contain rounded-lg" />
                                                                    </div>
                                                                `;
                                                                modal.onclick = (e) => {
                                                                    if (e.target === modal) modal.remove();
                                                                };
                                                                document.body.appendChild(modal);
                                                            }}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
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

            {/* Edit Question Modal */}
            {editQuestionModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Question</h2>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                            <div className="space-y-6">
                                {/* Question Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question Text *
                                    </label>
                                    <textarea
                                        value={editingQuestion.question}
                                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, question: e.target.value }))}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                {/* Question Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question Type *
                                    </label>
                                    <select
                                        value={editingQuestion.question_type}
                                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, question_type: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select question type</option>
                                        <option value="MCQ - Single Correct">MCQ - Single Correct</option>
                                        <option value="MCQ - Multiple Correct">MCQ - Multiple Correct</option>
                                        <option value="True/False">True/False</option>
                                        <option value="Fill in the Blanks">Fill in the Blanks</option>
                                        <option value="Short Answer">Short Answer</option>
                                        <option value="Long Answer">Long Answer</option>
                                    </select>
                                </div>

                                {/* Marks and Negative Marks */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Marks *
                                        </label>
                                        <input
                                            type="number"
                                            value={editingQuestion.marks}
                                            onChange={(e) => setEditingQuestion(prev => ({ ...prev, marks: parseFloat(e.target.value) || 0 }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            step="0.1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Negative Marks
                                        </label>
                                        <input
                                            type="number"
                                            value={editingQuestion.negative_marks}
                                            onChange={(e) => setEditingQuestion(prev => ({ ...prev, negative_marks: parseFloat(e.target.value) || 0 }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {editingQuestion.image && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">Selected: {editingQuestion.image.name}</p>
                                            {typeof editingQuestion.image === 'string' ? (
                                                <img 
                                                    src={`/${editingQuestion.image}`} 
                                                    alt="Current question image" 
                                                    className="mt-2 max-w-full h-auto rounded border border-gray-200"
                                                    style={{ maxHeight: '200px' }}
                                                />
                                            ) : (
                                                <p className="text-sm text-blue-600">New image will be uploaded</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Hint and Explanation */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hint
                                        </label>
                                        <textarea
                                            value={editingQuestion.hint}
                                            onChange={(e) => setEditingQuestion(prev => ({ ...prev, hint: e.target.value }))}
                                            className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Optional hint for students..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Explanation
                                        </label>
                                        <textarea
                                            value={editingQuestion.explanation}
                                            onChange={(e) => setEditingQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                                            className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Explanation of the correct answer..."
                                        />
                                    </div>
                                </div>

                                {/* Options */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Options *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addOption}
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                        >
                                            Add Option
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {editingQuestion.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={option.is_correct}
                                                    onChange={() => handleCorrectAnswerChange(index)}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <input
                                                    type="text"
                                                    value={option.option}
                                                    onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
                                                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder={`Option ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-white">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeEditModal}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveQuestion}
                                    disabled={isSaving || !editingQuestion.question || !editingQuestion.question_type || editingQuestion.options.length === 0}
                                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuestionBank; 