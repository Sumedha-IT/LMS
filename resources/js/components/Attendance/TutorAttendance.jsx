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
    Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
    Search,
    Refresh,
    FilterAlt,
    TableView,
    BarChart as BarChartIcon
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

export default function TutorAttendance() {
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

    // Fetch batches when component mounts, but don't fetch attendance report yet
    useEffect(() => {
        fetchBatches();
        // Don't fetch attendance report on initial load to avoid showing error message
        // Instead, show the welcome message prompting user to select filters
        setLoading(false);
    }, []);

    // Fetch batches assigned to the tutor
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
                toast.error('Failed to load batches. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            setBatches([]);
            toast.error('Failed to load batches. Please try again later.');
        }
    };

    // Fetch attendance report for the tutor's batches
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

            const response = await apiRequest('/student-attendance/tutor-report', {
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
            console.error('Error fetching attendance report:', error);
            setReport([]);
            setError('Failed to load attendance data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and sorting to the report data
    useEffect(() => {
        // Even if there's no report data, we still want to show the welcome message
        // So we don't return early here
        if (!report.length) {
            setFilteredReport([]);
            return;
        }

        let filtered = [...report];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                student =>
                    student.name.toLowerCase().includes(query) ||
                    student.email.toLowerCase().includes(query) ||
                    student.batch_name.toLowerCase().includes(query)
            );
        }

        // Apply attendance threshold filter
        if (attendanceThreshold > 0) {
            filtered = filtered.filter(student => {
                if (attendanceThreshold <= 100) {
                    return student.attendance_percentage >= attendanceThreshold;
                } else {
                    return student.attendance_percentage <= (attendanceThreshold - 100);
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (order === 'asc') {
                if (typeof aValue === 'string') {
                    return aValue.localeCompare(bValue);
                }
                return aValue - bValue;
            } else {
                if (typeof aValue === 'string') {
                    return bValue.localeCompare(aValue);
                }
                return bValue - aValue;
            }
        });

        setFilteredReport(filtered);
    }, [report, searchQuery, attendanceThreshold, orderBy, order]);

    // Function to refresh attendance data
    const refreshAttendanceData = () => {
        fetchAttendanceReport();
        toast.info('Refreshing attendance data...');
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

    // Prepare chart data
    const attendanceChartData = useMemo(() => {
        if (!filteredReport.length) return null;

        // Attendance distribution data
        const highAttendance = filteredReport.filter(student => student.attendance_percentage >= 75).length;
        const mediumAttendance = filteredReport.filter(student => student.attendance_percentage >= 50 && student.attendance_percentage < 75).length;
        const lowAttendance = filteredReport.filter(student => student.attendance_percentage < 50).length;

        return {
            attendanceDistribution: {
                labels: ['High (≥75%)', 'Medium (50-74%)', 'Low (<50%)'],
                datasets: [
                    {
                        data: [highAttendance, mediumAttendance, lowAttendance],
                        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                        borderWidth: 1
                    }
                ]
            }
        };
    }, [filteredReport]);

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
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

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: '12px' }}>
                <CardContent>
                    {/* Header with title and actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#F03A17' }}>
                            Tutor Attendance Management
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterAlt />}
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{
                                    borderRadius: '8px',
                                    borderColor: '#F03A17',
                                    color: '#F03A17',
                                    '&:hover': {
                                        borderColor: '#d32f2f',
                                        backgroundColor: 'rgba(240, 58, 23, 0.04)'
                                    }
                                }}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={refreshAttendanceData}
                                sx={{
                                    borderRadius: '8px',
                                    borderColor: '#F03A17',
                                    color: '#F03A17',
                                    '&:hover': {
                                        borderColor: '#d32f2f',
                                        backgroundColor: 'rgba(240, 58, 23, 0.04)'
                                    }
                                }}
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>

                    {/* Filters */}
                    {showFilters && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Batch</InputLabel>
                                        <Select
                                            value={selectedBatch}
                                            onChange={(e) => setSelectedBatch(e.target.value)}
                                            label="Batch"
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
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="End Date"
                                            value={dateRange.endDate}
                                            onChange={(date) => handleDateRangeChange('endDate', date)}
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={applyFilters}
                                            sx={{ flex: 1, bgcolor: '#F03A17', '&:hover': { bgcolor: '#d32f2f' } }}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={resetFilters}
                                            sx={{
                                                flex: 1,
                                                borderColor: '#F03A17',
                                                color: '#F03A17',
                                                '&:hover': {
                                                    borderColor: '#d32f2f',
                                                    backgroundColor: 'rgba(240, 58, 23, 0.04)'
                                                }
                                            }}
                                        >
                                            Reset
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Search bar */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by student name, email, or batch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '8px' }
                            }}
                        />
                    </Box>

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
                                        color: '#F03A17'
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#F03A17'
                                    }
                                }}
                            >
                                <Tab label="Table View" icon={<TableView />} iconPosition="start" />
                                <Tab label="Analytics" icon={<BarChartIcon />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        {/* Table View Tab */}
                        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={40} thickness={4} />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            ) : filteredReport.length === 0 && (selectedBatch || searchQuery || dateRange.startDate !== startOfMonth(new Date()) || dateRange.endDate !== endOfMonth(new Date())) ? (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    No attendance records found for the selected criteria.
                                </Alert>
                            ) : filteredReport.length === 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                        Welcome to Attendance Management
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
                                        Select a batch and date range to view attendance records for your students.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setShowFilters(true)}
                                        sx={{ bgcolor: '#F03A17', '&:hover': { bgcolor: '#d32f2f' } }}
                                    >
                                        Show Filters
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: '8px' }}>
                                        <Table sx={{ minWidth: 650 }} size="medium">
                                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={orderBy === 'name'}
                                                            direction={orderBy === 'name' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('name')}
                                                        >
                                                            Student Name
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={orderBy === 'batch_name'}
                                                            direction={orderBy === 'batch_name' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('batch_name')}
                                                        >
                                                            Batch
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell align="center">Total Days</TableCell>
                                                    <TableCell align="center">Present Days</TableCell>
                                                    <TableCell align="center">
                                                        <TableSortLabel
                                                            active={orderBy === 'attendance_percentage'}
                                                            direction={orderBy === 'attendance_percentage' ? order : 'asc'}
                                                            onClick={() => handleRequestSort('attendance_percentage')}
                                                        >
                                                            Attendance %
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell align="center">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredReport
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((student) => (
                                                        <TableRow key={student.user_id} hover>
                                                            <TableCell component="th" scope="row">
                                                                {student.name}
                                                            </TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                            <TableCell>{student.batch_name}</TableCell>
                                                            <TableCell align="center">{student.total_days}</TableCell>
                                                            <TableCell align="center">{student.present_days}</TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                                                                        <CircularProgress
                                                                            variant="determinate"
                                                                            value={student.attendance_percentage}
                                                                            size={40}
                                                                            thickness={4}
                                                                            sx={{
                                                                                color: student.attendance_percentage >= 75
                                                                                    ? '#4caf50'
                                                                                    : student.attendance_percentage >= 50
                                                                                        ? '#ff9800'
                                                                                        : '#f44336'
                                                                            }}
                                                                        />
                                                                        <Box
                                                                            sx={{
                                                                                top: 0,
                                                                                left: 0,
                                                                                bottom: 0,
                                                                                right: 0,
                                                                                position: 'absolute',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                            }}
                                                                        >
                                                                            <Typography variant="caption" component="div" color="text.secondary">
                                                                                {`${Math.round(student.attendance_percentage)}%`}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={
                                                                        student.attendance_percentage >= 75
                                                                            ? 'Good'
                                                                            : student.attendance_percentage >= 50
                                                                                ? 'Average'
                                                                                : 'Poor'
                                                                    }
                                                                    color={
                                                                        student.attendance_percentage >= 75
                                                                            ? 'success'
                                                                            : student.attendance_percentage >= 50
                                                                                ? 'warning'
                                                                                : 'error'
                                                                    }
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        component="div"
                                        count={filteredReport.length}
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
                            ) : error ? (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            ) : filteredReport.length === 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                        No Data Available
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
                                        Select a batch and date range to view attendance analytics for your students.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setShowFilters(true)}
                                        sx={{ bgcolor: '#F03A17', '&:hover': { bgcolor: '#d32f2f' } }}
                                    >
                                        Show Filters
                                    </Button>
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

                                    {/* Statistics */}
                                    <Grid item xs={12} md={6}>
                                        <Card sx={{ height: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                    Attendance Statistics
                                                </Typography>
                                                {statistics && (
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Total Students
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                                {statistics.totalStudents}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Average Attendance
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                                {statistics.averageAttendance.toFixed(2)}%
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                High Attendance
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                                {statistics.highAttendance} students
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Medium Attendance
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                                                {statistics.mediumAttendance} students
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Low Attendance
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                                                                {statistics.lowAttendance} students
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
