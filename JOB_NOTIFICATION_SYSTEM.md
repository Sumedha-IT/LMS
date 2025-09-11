# Job Notification System

This document explains the job notification system implemented for the LMS.

## Overview

The job notification system automatically sends database notifications to users when:
1. A new job is created
2. A job's status is changed

Notifications are sent only to users whose course matches the job's course requirements.

## Components

### 1. JobNotification Class
**File**: `app/Notifications/JobNotification.php`

Handles the notification content and structure for both job creation and status changes.

**Features**:
- Database notifications (currently implemented)
- Email notifications (ready for future implementation)
- Different content for job creation vs status changes

### 2. JobNotificationService Class
**File**: `app/Services/JobNotificationService.php`

Service class that handles the business logic for sending notifications.

**Methods**:
- `sendJobCreatedNotification(JobPosting $jobPosting)` - Sends notifications when a job is created
- `sendJobStatusChangedNotification(JobPosting $jobPosting, string $oldStatus, string $newStatus)` - Sends notifications when job status changes
- `getEligibleUsers(JobPosting $jobPosting)` - Gets users eligible for notifications based on course

### 3. Updated JobPostingController
**File**: `app/Http/Controllers/api/JobPostingController.php`

The API controller now includes notification logic in:
- `store()` method - Sends notifications when creating new jobs
- `update()` method - Sends notifications when job status changes

## How It Works

### Job Creation Notifications
1. When a job is created via API (`POST /api/job-postings`)
2. The system identifies eligible users based on:
   - Job's `course_id` field
   - Job's `eligible_courses` array field
3. Notifications are sent to all students (role_id = 6) in matching courses
4. Notification content includes job title, company name, and location

### Job Status Change Notifications
1. When a job's status is updated via API (`PUT /api/job-postings/{id}`)
2. The system checks if the status actually changed
3. If changed, notifications are sent to eligible users
4. Notification content includes old and new status information

## User Eligibility Logic

Users receive notifications if they meet these criteria:
1. **Role**: Must be a student (role_id = 6)
2. **Course Match**: Their course_id must match:
   - The job's `course_id` field, OR
   - Any course ID in the job's `eligible_courses` array

## Notification Content

### Job Creation Notification
```json
{
  "title": "New Job Opportunity Available!",
  "body": "A new job posting 'Software Engineer' has been created by Google for your course.",
  "job_posting_id": 123,
  "company_name": "Google",
  "job_title": "Software Engineer",
  "location": "Mountain View, CA",
  "type": "job_created",
  "action_url": "/administrator/job-boards"
}
```

### Job Status Change Notification
```json
{
  "title": "Job Status Updated",
  "body": "Job posting 'Software Engineer' status has been changed from 'draft' to 'open'.",
  "job_posting_id": 123,
  "company_name": "Google",
  "job_title": "Software Engineer",
  "old_status": "draft",
  "new_status": "open",
  "type": "job_status_changed",
  "action_url": "/administrator/job-boards"
}
```

## Testing

### Test Command
Use the test command to verify the notification system:

```bash
php artisan test:job-notification {job_id}
```

Example:
```bash
php artisan test:job-notification 1
```

This will:
1. Find the job posting with ID 1
2. Send a job creation notification
3. Send a job status change notification
4. Display results in the console
5. Generate detailed logs for analysis

### Viewing Test Results
After running the test command, view the logs:

```bash
# View recent notification logs
php artisan notifications:logs

# View more log entries
php artisan notifications:logs --lines=100

# Monitor logs in real-time
tail -f storage/logs/laravel.log | grep -E "(🚀|📊|✅|❌|🔄|📝|🔍|👥|📚|📋|🎯|⚠️|ℹ️|🎉|💥)"
```

### Manual Testing
1. Create a job posting via API with a specific `course_id`
2. Check that users with matching `course_id` receive notifications
3. Update the job's status
4. Verify status change notifications are sent

## Database Structure

### Job Postings Table
The system uses these fields to determine eligibility:
- `course_id` - Direct course association
- `eligible_courses` - JSON array of course names/IDs

### Users Table
The system checks:
- `course_id` - User's enrolled course
- `role_id` - Must be 6 (student role)

### Notifications Table
Notifications are stored in the standard Laravel notifications table with:
- `type` - 'App\Notifications\JobNotification'
- `notifiable_type` - 'App\Models\User'
- `notifiable_id` - User ID
- `data` - JSON containing notification content

## Future Enhancements

1. **Email Notifications**: The system is ready to send email notifications by changing the `via()` method in `JobNotification.php`

2. **Push Notifications**: Can be integrated with the existing Firebase service

3. **Notification Preferences**: Users can opt-in/out of job notifications

4. **Batch Notifications**: For bulk job operations

5. **Notification Templates**: Customizable notification content

## API Endpoints

The notification system works with these existing endpoints:

- `POST /api/job-postings` - Creates job and sends notifications
- `PUT /api/job-postings/{id}` - Updates job and sends notifications if status changes

## Logging

The system includes comprehensive logging with emoji prefixes for easy identification:

### Log Entry Types
- 🚀 **Job Creation Process Started**
- 📊 **Eligible Users Found**
- ✅ **Notification Sent Successfully**
- ❌ **Notification Failed**
- 🔄 **Status Change Process Started**
- 📝 **Job Created/Updated in Controller**
- 🔍 **User Eligibility Check Started**
- 👥 **Users Found by Course**
- 📚 **Direct Course ID Check**
- 📋 **Eligible Courses Array Check**
- 🎯 **Processing Eligible Courses**
- ⚠️ **Warnings (No Users Found, etc.)**
- ℹ️ **Information Messages**
- 🎉 **Process Completed Successfully**
- 💥 **Critical Errors**

### Viewing Logs

#### Method 1: Using the Log Viewer Command
```bash
php artisan notifications:logs
php artisan notifications:logs --lines=100
```

#### Method 2: Direct Log File Access
```bash
tail -f storage/logs/laravel.log | grep -E "(🚀|📊|✅|❌|🔄|📝|🔍|👥|📚|📋|🎯|⚠️|ℹ️|🎉|💥)"
```

#### Method 3: Search Specific Logs
```bash
grep "JobNotification" storage/logs/laravel.log
grep "sendJobCreatedNotification" storage/logs/laravel.log
grep "sendJobStatusChangedNotification" storage/logs/laravel.log
```

### Log Information Includes
- Job ID, title, and company
- Course ID and eligible courses
- User IDs, names, and emails
- Success/failure counts
- Error messages and stack traces
- Eligibility reasons
- Performance metrics

## Troubleshooting

### No Notifications Sent
1. Check if job has `course_id` or `eligible_courses` set
2. Verify users exist with matching `course_id` and `role_id = 6`
3. Check Laravel logs for errors

### Notifications Sent to Wrong Users
1. Verify job's course associations are correct
2. Check user's `course_id` values
3. Review the eligibility logic in `JobNotificationService`

### Performance Issues
1. Consider implementing queued notifications for large user bases
2. Add database indexes on `course_id` fields
3. Implement notification batching for bulk operations
