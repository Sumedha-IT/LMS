import { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../../utils/api';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Grid,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
    Tooltip,
    InputAdornment,
    Chip,
    Tab,
    Tabs,
    TableSortLabel,
    TablePagination,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
    Search,
    Refresh,
    Download,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    TableView,
    Info,
    FilterAlt
} from '@mui/icons-material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
);

export default function AdminAttendance() {
    const [report, setReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date())
    });
    const [tabValue, setTabValue] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [attendanceThreshold, setAttendanceThreshold] = useState(75);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportData, setExportData] = useState({
        includeDetails: true,
        dateRange: true,
        batchInfo: true
    });

    // Fetch attendance report and batches when component mounts
    useEffect(() => {
        fetchBatches();
        fetchAttendanceReport();
    }, []);

    // Update filtered report when report, search query, or selected batch changes
    useEffect(() => {
        filterReport();
    }, [report, searchQuery, selectedBatch, dateRange, attendanceThreshold]);

    const fetchBatches = async () => {
        try {
            const response = await apiRequest('/student-attendance/batches', {
                method: 'GET',
                skipCache: true
            });

            if (Array.isArray(response)) {
                setBatches(response);
            } else {
                setBatches([]);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            setBatches([]);
        }
    };

    const fetchAttendanceReport = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
                end_date: format(dateRange.endDate, 'yyyy-MM-dd')
            };

            if (selectedBatch) {
                params.batch_id = selectedBatch;
            }

            const response = await apiRequest('/student-attendance/admin-report', {
                method: 'GET',
                skipCache: true,
                params
            });

            if (Array.isArray(response)) {
                setReport(response);

                if (response.length === 0) {
                    toast.info('No student attendance records found for the selected period.');
                }
            } else {
                setReport([]);
                setError('Failed to load attendance data. Please try again later.');
            }
        } catch (error) {
            setError('Error loading attendance data: ' + (error.message || 'Unknown error'));
            setReport([]);
            toast.error('Failed to load attendance data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to filter the report based on search query and selected batch
    const filterReport = () => {
        let filtered = [...report];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                student =>
                    student.name.toLowerCase().includes(query) ||
                    student.email.toLowerCase().includes(query) ||
                    student.batch_name.toLowerCase().includes(query)
            );
        }

        // Filter by attendance threshold
        if (attendanceThreshold > 0) {
            filtered = filtered.filter(student => {
                if (attendanceThreshold === 100) {
                    return student.attendance_percentage === 100;
                } else if (attendanceThreshold === 75) {
                    return student.attendance_percentage >= 75;
                } else if (attendanceThreshold === 50) {
                    return student.attendance_percentage >= 50 && student.attendance_percentage < 75;
                } else if (attendanceThreshold === 25) {
                    return student.attendance_percentage < 50;
                }
                return true;
            });
        }

        setFilteredReport(filtered);
    };

    // Function to refresh attendance data
    const refreshAttendanceData = () => {
        fetchAttendanceReport();
    };

    // Function to handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Function to handle sort request
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Function to sort the data
    const sortedData = useMemo(() => {
        return [...filteredReport].sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];

            // Handle special cases
            if (orderBy === 'batch_name') {
                aValue = a.batch_name || '';
                bValue = b.batch_name || '';
            }

            // Compare the values
            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });
    }, [filteredReport, order, orderBy]);

    // Function to handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Function to handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Function to handle date range change
    const handleDateRangeChange = (type, date) => {
        setDateRange(prev => ({
            ...prev,
            [type]: date
        }));
    };

    // Function to apply filters
    const applyFilters = () => {
        fetchAttendanceReport();
    };

    // Function to reset filters
    const resetFilters = () => {
        setSelectedBatch('');
        setSearchQuery('');
        setDateRange({
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date())
        });
        setAttendanceThreshold(75);
        fetchAttendanceReport();
    };

    // Function to export data
    const handleExport = () => {
        // Implementation for exporting data will be added later
        setExportDialogOpen(false);
        toast.success('Export feature will be implemented soon!');
    };

    // Calculate statistics
    const statistics = useMemo(() => {
        if (!report.length) return null;

        const totalStudents = report.length;
        const totalAttendance = report.reduce((sum, student) => sum + student.attendance_percentage, 0);
        const averageAttendance = totalAttendance / totalStudents;

        const highAttendance = report.filter(student => student.attendance_percentage >= 75).length;
        const mediumAttendance = report.filter(student => student.attendance_percentage >= 50 && student.attendance_percentage < 75).length;
        const lowAttendance = report.filter(student => student.attendance_percentage < 50).length;

        return {
            totalStudents,
            averageAttendance,
            highAttendance,
            mediumAttendance,
            lowAttendance
        };
    }, [report]);

    // Prepare chart data for attendance trends
    const attendanceChartData = useMemo(() => {
        if (!report.length) return null;

        // Calculate attendance distribution
        const highAttendance = report.filter(student => student.attendance_percentage >= 75).length;
        const mediumAttendance = report.filter(student => student.attendance_percentage >= 50 && student.attendance_percentage < 75).length;
        const lowAttendance = report.filter(student => student.attendance_percentage < 50).length;

        // Group students by batch for batch comparison
        const batchGroups = {};
        report.forEach(student => {
            if (!batchGroups[student.batch_name]) {
                batchGroups[student.batch_name] = [];
            }
            batchGroups[student.batch_name].push(student);
        });

        // Calculate average attendance for each batch
        const batchLabels = Object.keys(batchGroups);
        const batchData = batchLabels.map(batchName => {
            const students = batchGroups[batchName];
            const totalAttendance = students.reduce((sum, student) => sum + student.attendance_percentage, 0);
            return totalAttendance / students.length;
        });

        // Attendance distribution data for pie chart
        const attendanceDistribution = {
            labels: ['High (≥75%)', 'Medium (50-74%)', 'Low (<50%)'],
            datasets: [
                {
                    data: [highAttendance, mediumAttendance, lowAttendance],
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                    borderWidth: 1
                }
            ]
        };

        // Batch comparison data for bar chart
        const batchComparison = {
            labels: batchLabels,
            datasets: [
                {
                    label: 'Average Attendance (%)',
                    data: batchData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        };

        return {
            attendanceDistribution,
            batchComparison
        };
    }, [report]);

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Attendance Analytics'
            }
        }
    };

    // Export dialog component
    const ExportDialog = () => (
        <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
            <DialogTitle>Export Attendance Data</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                        value={exportFormat}
                        label="Export Format"
                        onChange={(e) => setExportFormat(e.target.value)}
                    >
                        <MenuItem value="csv">CSV</MenuItem>
                        <MenuItem value="excel">Excel</MenuItem>
                        <MenuItem value="pdf">PDF</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Include in Export:</Typography>

                <FormControl component="fieldset" sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl>
                                <Tooltip title="Include detailed attendance records">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={exportData.includeDetails}
                                            onChange={(e) => setExportData({...exportData, includeDetails: e.target.checked})}
                                        />
                                        <Typography>Detailed Records</Typography>
                                    </Box>
                                </Tooltip>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <Tooltip title="Include date range information">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={exportData.dateRange}
                                            onChange={(e) => setExportData({...exportData, dateRange: e.target.checked})}
                                        />
                                        <Typography>Date Range</Typography>
                                    </Box>
                                </Tooltip>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <Tooltip title="Include batch information">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={exportData.batchInfo}
                                            onChange={(e) => setExportData({...exportData, batchInfo: e.target.checked})}
                                        />
                                        <Typography>Batch Information</Typography>
                                    </Box>
                                </Tooltip>
                            </FormControl>
                        </Grid>
                    </Grid>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleExport} variant="contained" color="primary">Export</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Main content */}
            <Card sx={{ mb: 4, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Header with title and actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            Attendance Management
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterAlt />}
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{ borderRadius: '8px' }}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={refreshAttendanceData}
                                sx={{ borderRadius: '8px' }}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                onClick={() => setExportDialogOpen(true)}
                                sx={{ borderRadius: '8px', bgcolor: '#1a237e' }}
                            >
                                Export
                            </Button>
                        </Box>
                    </Box>

                    {/* Filters section */}
                    {showFilters && (
                        <Card sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Batch</InputLabel>
                                            <Select
                                                value={selectedBatch}
                                                label="Batch"
                                                onChange={(e) => setSelectedBatch(e.target.value)}
                                            >
                                                <MenuItem value="">All Batches</MenuItem>
                                                {batches.map((batch) => (
                                                    <MenuItem key={batch.id} value={batch.id}>
                                                        {batch.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Start Date"
                                                value={dateRange.startDate}
                                                onChange={(date) => handleDateRangeChange('startDate', date)}
                                                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="End Date"
                                                value={dateRange.endDate}
                                                onChange={(date) => handleDateRangeChange('endDate', date)}
                                                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Attendance Level</InputLabel>
                                            <Select
                                                value={attendanceThreshold}
                                                label="Attendance Level"
                                                onChange={(e) => setAttendanceThreshold(e.target.value)}
                                            >
                                                <MenuItem value={0}>All Students</MenuItem>
                                                <MenuItem value={100}>Perfect (100%)</MenuItem>
                                                <MenuItem value={75}>Good (75% or above)</MenuItem>
                                                <MenuItem value={50}>Average (50-74%)</MenuItem>
                                                <MenuItem value={25}>Low (below 50%)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Search Students"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, email or batch..."
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={resetFilters}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={applyFilters}
                                            sx={{ borderRadius: '8px', bgcolor: '#1a237e' }}
                                        >
                                            Apply Filters
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tabs for different views */}
                    <Box sx={{ width: '100%', mt: 3 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="attendance views"
                                sx={{
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        minWidth: 120
                                    },
                                    '& .Mui-selected': {
                                        color: '#1a237e'
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#1a237e'
                                    }
                                }}
                            >
                                <Tab label="Table View" icon={<TableView />} iconPosition="start" />
                                <Tab label="Analytics" icon={<BarChartIcon />} iconPosition="start" />
                                <Tab label="Insights" icon={<Info />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        {/* Table View Tab */}
                        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={40} thickness={4} />
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Showing {filteredReport.length} {filteredReport.length === 1 ? 'record' : 'records'}
                                        </Typography>
                                    </Box>
                                    <TableContainer component={Paper} sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                        <Table size="medium">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'name' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'name'}
                                                            direction={orderBy === 'name' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('name')}
                                                        >
                                                            Student Name
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'email' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'email'}
                                                            direction={orderBy === 'email' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('email')}
                                                        >
                                                            Email
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'batch_name' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'batch_name'}
                                                            direction={orderBy === 'batch_name' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('batch_name')}
                                                        >
                                                            Batch
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'total_days' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'total_days'}
                                                            direction={orderBy === 'total_days' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('total_days')}
                                                        >
                                                            Total Days
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'present_days' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'present_days'}
                                                            direction={orderBy === 'present_days' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('present_days')}
                                                        >
                                                            Present Days
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ fontWeight: 'bold', py: 2 }}
                                                        sortDirection={orderBy === 'attendance_percentage' ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === 'attendance_percentage'}
                                                            direction={orderBy === 'attendance_percentage' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('attendance_percentage')}
                                                        >
                                                            Attendance Rate
                                                        </TableSortLabel>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sortedData.length > 0 ? (
                                                    sortedData
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((student, index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{
                                                                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                                                    '&:hover': { backgroundColor: '#f0f7ff' }
                                                                }}
                                                            >
                                                                <TableCell sx={{ py: 2 }}>{student.name}</TableCell>
                                                                <TableCell sx={{ py: 2 }}>{student.email}</TableCell>
                                                                <TableCell sx={{ py: 2 }}>{student.batch_name}</TableCell>
                                                                <TableCell sx={{ py: 2 }}>{student.total_days}</TableCell>
                                                                <TableCell sx={{ py: 2 }}>{student.present_days}</TableCell>
                                                                <TableCell sx={{ py: 2 }}>
                                                                    <Box
                                                                        sx={{
                                                                            px: 1.5,
                                                                            py: 0.5,
                                                                            borderRadius: 1,
                                                                            display: 'inline-block',
                                                                            fontWeight: 'medium',
                                                                            fontSize: '0.875rem',
                                                                            bgcolor: student.attendance_percentage >= 75
                                                                                ? 'success.light'
                                                                                : student.attendance_percentage >= 50
                                                                                    ? 'warning.light'
                                                                                    : 'error.light',
                                                                            color: student.attendance_percentage >= 75
                                                                                ? 'success.dark'
                                                                                : student.attendance_percentage >= 50
                                                                                    ? 'warning.dark'
                                                                                    : 'error.dark',
                                                                        }}
                                                                    >
                                                                        {student.attendance_percentage}%
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                            <Typography variant="body1" color="text.secondary">
                                                                No student attendance records found
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        component="div"
                                        count={sortedData.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            )}
                        </Box>

                        {/* Analytics Tab */}
                        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={40} thickness={4} />
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {/* Attendance Distribution Chart */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                    Attendance Distribution
                                                </Typography>
                                                <Box sx={{ height: 300 }}>
                                                    {attendanceChartData && (
                                                        <Pie
                                                            data={attendanceChartData.attendanceDistribution}
                                                            options={chartOptions}
                                                        />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Batch Comparison Chart */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                    Batch Comparison
                                                </Typography>
                                                <Box sx={{ height: 300 }}>
                                                    {attendanceChartData && (
                                                        <Bar
                                                            data={attendanceChartData.batchComparison}
                                                            options={chartOptions}
                                                        />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>

                        {/* Insights Tab */}
                        <Box role="tabpanel" hidden={tabValue !== 2} sx={{ py: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={40} thickness={4} />
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {/* Overall Statistics */}
                                    <Grid item xs={12}>
                                        <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                                    Overall Attendance Statistics
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                                                {statistics?.totalStudents || 0}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Total Students
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                                                {statistics?.averageAttendance.toFixed(2) || 0}%
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Average Attendance
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                                                {statistics?.highAttendance || 0}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                High Attendance (75% or above)
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                                                                {statistics?.lowAttendance || 0}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Low Attendance (below 50%)
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Students Requiring Attention */}
                                    <Grid item xs={12}>
                                        <Card sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                                    Students Requiring Attention
                                                </Typography>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Batch</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Attendance Rate</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {report
                                                                .filter(student => student.attendance_percentage < 50)
                                                                .slice(0, 5)
                                                                .map((student, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{student.name}</TableCell>
                                                                        <TableCell>{student.batch_name}</TableCell>
                                                                        <TableCell>{student.attendance_percentage}%</TableCell>
                                                                        <TableCell>
                                                                            <Chip
                                                                                label="Critical"
                                                                                size="small"
                                                                                color="error"
                                                                                variant="outlined"
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            {report.filter(student => student.attendance_percentage < 50).length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} align="center">
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            No students requiring attention
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Export Dialog */}
            <ExportDialog />
        </Box>
    );
}