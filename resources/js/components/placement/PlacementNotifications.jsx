import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Work as WorkIcon,
    Email as EmailIcon,
    Sms as SmsIcon,
    WhatsApp as WhatsAppIcon,
    PushPin as PushPinIcon,
    Delete as DeleteIcon,
    MarkEmailRead as MarkEmailReadIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const PlacementNotifications = ({ studentId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Mock data - replace with actual API calls
    useEffect(() => {
        setTimeout(() => {
            setNotifications([
                {
                    id: 1,
                    type: 'job_posting',
                    title: 'New Job Opportunity: Software Engineer at Google',
                    message: 'A new job posting matching your profile is available. Apply now before the deadline.',
                    notificationType: 'email',
                    status: 'unread',
                    sentAt: '2024-01-15T10:30:00',
                    jobId: 1,
                    company: 'Google',
                    deadline: '2024-02-15'
                },
                {
                    id: 2,
                    type: 'application_status',
                    title: 'Application Status Update',
                    message: 'Your application for Frontend Developer at Microsoft has been shortlisted.',
                    notificationType: 'sms',
                    status: 'read',
                    sentAt: '2024-01-14T15:45:00',
                    jobId: 2,
                    company: 'Microsoft',
                    status: 'shortlisted'
                },
                {
                    id: 3,
                    type: 'interview_scheduled',
                    title: 'Interview Scheduled',
                    message: 'Your interview for Data Analyst position at Amazon has been scheduled for January 20th.',
                    notificationType: 'whatsapp',
                    status: 'unread',
                    sentAt: '2024-01-13T09:15:00',
                    jobId: 3,
                    company: 'Amazon',
                    interviewDate: '2024-01-20'
                },
                {
                    id: 4,
                    type: 'placement_confirmed',
                    title: 'Congratulations! You\'ve been placed!',
                    message: 'You have been selected for the Software Engineer position at Google. Welcome to the team!',
                    notificationType: 'email',
                    status: 'unread',
                    sentAt: '2024-01-12T14:20:00',
                    jobId: 1,
                    company: 'Google',
                    salary: '₹10 LPA'
                },
                {
                    id: 5,
                    type: 'payment_reminder',
                    title: 'Payment Reminder',
                    message: 'Please complete your remaining fee payment of ₹25,000 to continue with placement services.',
                    notificationType: 'sms',
                    status: 'read',
                    sentAt: '2024-01-11T11:00:00',
                    amount: '₹25,000'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'job_posting': return <WorkIcon />;
            case 'application_status': return <InfoIcon />;
            case 'interview_scheduled': return <ScheduleIcon />;
            case 'placement_confirmed': return <CheckCircleIcon />;
            case 'payment_reminder': return <WarningIcon />;
            default: return <NotificationsIcon />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'job_posting': return 'primary';
            case 'application_status': return 'info';
            case 'interview_scheduled': return 'warning';
            case 'placement_confirmed': return 'success';
            case 'payment_reminder': return 'error';
            default: return 'default';
        }
    };

    const getNotificationTypeIcon = (type) => {
        switch (type) {
            case 'email': return <EmailIcon />;
            case 'sms': return <SmsIcon />;
            case 'whatsapp': return <WhatsAppIcon />;
            case 'push': return <PushPinIcon />;
            default: return <NotificationsIcon />;
        }
    };

    const markAsRead = (notificationId) => {
        setNotifications(notifications.map(notif => 
            notif.id === notificationId 
                ? { ...notif, status: 'read' }
                : notif
        ));
    };

    const deleteNotification = (notificationId) => {
        setNotifications(notifications.filter(notif => notif.id !== notificationId));
    };

    const openNotification = (notification) => {
        setSelectedNotification(notification);
        setDialogOpen(true);
        if (notification.status === 'unread') {
            markAsRead(notification.id);
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Stay updated with your placement journey
                </Typography>
                {unreadCount > 0 && (
                    <Chip 
                        label={`${unreadCount} unread`} 
                        color="primary" 
                        size="small" 
                        sx={{ mt: 1 }}
                    />
                )}
            </Box>

            {/* Notifications List */}
            <Card>
                <CardContent>
                    {notifications.length > 0 ? (
                        <List>
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem 
                                        alignItems="flex-start"
                                        sx={{
                                            backgroundColor: notification.status === 'unread' ? '#f8f9fa' : 'transparent',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    color: getNotificationColor(notification.type),
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </Box>
                                        </ListItemIcon>
                                        
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: notification.status === 'unread' ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    {notification.status === 'unread' && (
                                                        <Chip label="New" color="primary" size="small" />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" paragraph>
                                                        {notification.message}
                                                    </Typography>
                                                    <Box display="flex" gap={1} alignItems="center">
                                                        <Chip 
                                                            icon={getNotificationTypeIcon(notification.notificationType)}
                                                            label={notification.notificationType}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(notification.sentAt).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        
                                        <Box display="flex" gap={1}>
                                            <IconButton 
                                                size="small"
                                                onClick={() => openNotification(notification)}
                                            >
                                                <MarkEmailReadIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info">
                            <Typography>
                                No notifications found. You'll receive updates here when there are new job postings or status changes.
                            </Typography>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Notification Detail Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        {getNotificationIcon(selectedNotification?.type)}
                        <Typography variant="h6">
                            {selectedNotification?.title}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        {selectedNotification?.message}
                    </Typography>
                    
                    <Box display="flex" gap={2} mb={2}>
                        <Chip 
                            icon={getNotificationTypeIcon(selectedNotification?.notificationType)}
                            label={selectedNotification?.notificationType}
                            variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Sent: {selectedNotification?.sentAt ? new Date(selectedNotification.sentAt).toLocaleString() : ''}
                        </Typography>
                    </Box>

                    {selectedNotification?.type === 'job_posting' && (
                        <Alert severity="info">
                            <Typography variant="body2">
                                <strong>Company:</strong> {selectedNotification?.company}<br/>
                                <strong>Deadline:</strong> {selectedNotification?.deadline}
                            </Typography>
                        </Alert>
                    )}

                    {selectedNotification?.type === 'placement_confirmed' && (
                        <Alert severity="success">
                            <Typography variant="body2">
                                <strong>Company:</strong> {selectedNotification?.company}<br/>
                                <strong>Salary:</strong> {selectedNotification?.salary}
                            </Typography>
                        </Alert>
                    )}

                    {selectedNotification?.type === 'payment_reminder' && (
                        <Alert severity="warning">
                            <Typography variant="body2">
                                <strong>Amount Due:</strong> {selectedNotification?.amount}
                            </Typography>
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Close
                    </Button>
                    {selectedNotification?.type === 'job_posting' && (
                        <Button variant="contained">
                            View Job
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PlacementNotifications; 