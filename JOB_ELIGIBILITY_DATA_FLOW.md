# Job Eligibility Check API - Data Flow Documentation

## Overview

The Job Eligibility Check API (`/api/job-postings/{job_posting_id}/eligible-student`) determines which students are eligible for a specific job posting based on three criteria:

1. **Attendance Percentage** (minimum 75%)
2. **Exam Marks** (minimum 60%)
3. **Course Matching** (student must be enrolled in batch with matching course)

## Data Flow Requirements

### 1. Course Creation
```sql
-- First, create a course
INSERT INTO courses (name, description, ...) VALUES ('Web Development', 'Full-stack web development course', ...);
```

### 2. Batch Creation
```sql
-- Create a batch linked to the course
INSERT INTO batches (name, course_package_id, manager_id, start_date, end_date, ...) 
VALUES ('Web Dev Batch 2024', 1, 10, '2024-01-01', '2024-12-31', ...);
```

**Important**: The batch must be linked to the course via:
- `course_package_id` field

### 3. Student Enrollment
```sql
-- Enroll students in the batch
INSERT INTO batch_user (batch_id, user_id) VALUES (1, 101), (1, 102), (1, 103);
```

### 4. Exam Creation (for Exam Marks Calculation)
```sql
-- Create exams for the batch
INSERT INTO exams (title, total_marks, batch_id, exam_date, starts_at, ends_at, ...) 
VALUES ('Mid-term Exam', 100, 1, '2024-06-15', '10:00', '12:00', ...);

-- Create exam questions
INSERT INTO exam_questions (exam_id, question_id, question_bank_id, score, ...) 
VALUES (1, 101, 1, 5.0, ...);
```

### 5. Student Exam Attempts
```sql
-- Record student exam attempts
INSERT INTO exam_attempts (student_id, exam_id, score, status, ...) 
VALUES (101, 1, 85, 'completed', ...);
```

### 6. Job Posting Creation
```sql
-- Create job posting with matching course_id
INSERT INTO job_postings (title, company_id, course_id, description, ...) 
VALUES ('Frontend Developer', 5, 1, 'We are looking for a frontend developer...', ...);
```

## Database Relationships

```
courses (id, name, ...)
    ↓ (course_package_id)
batches (id, name, course_package_id, ...)
    ↓ (batch_user pivot table)    ↓ (batch_id)
users (id, name, email, role_id=6, ...)    exams (id, title, total_marks, batch_id, ...)
    ↓ (course_id - optional direct assignment)    ↓ (exam_id)
job_postings (id, title, course_id, ...)    exam_attempts (id, student_id, exam_id, score, status, ...)
```

**Complete Data Flow for Eligibility:**
1. **Course** → **Batch** → **Student** (for course matching)
2. **Batch** → **Exam** → **ExamAttempt** (for exam marks calculation)
3. **Student** → **StudentAttendance** (for attendance calculation)

## API Logic Flow

### Course Matching Logic (Updated)

The API now checks course matching through the proper batch system:

1. **Get job posting course requirement**
2. **Find student's enrolled batches**
3. **Check if any batch has the required course** (via `course_package_id`)
4. **Fallback**: Check direct course assignment (for backward compatibility)

### Eligibility Calculation

```php
// Attendance calculation
$attendancePercentage = (present_attendance / total_attendance) * 100;

// Exam marks calculation  
$examMarks = (total_score / total_possible_score) * 100;

// Course match
$courseMatch = checkCourseMatch($student, $jobPosting);

// Overall eligibility
$eligible = ($attendancePercentage >= 75) && ($examMarks >= 60) && $courseMatch;
```

## Common Issues and Solutions

### Issue 1: No Eligible Students Found
**Possible Causes:**
- Students not enrolled in any batch
- Batch not linked to correct course
- Job posting course_id doesn't match batch course
- No exams created for the batch
- No exam attempts for students
- No attendance records for students

**Solutions:**
```sql
-- Check student enrollment
SELECT u.name, b.name as batch_name, c.name as course_name
FROM users u
LEFT JOIN batch_user bu ON u.id = bu.user_id
LEFT JOIN batches b ON bu.batch_id = b.id
LEFT JOIN courses c ON b.course_package_id = c.id
WHERE u.role_id = 6;

-- Check exams for batch
SELECT e.title, e.total_marks, b.name as batch_name
FROM exams e
JOIN batches b ON e.batch_id = b.id
WHERE b.id = {batch_id};

-- Check student exam attempts
SELECT ea.score, ea.status, e.title as exam_title
FROM exam_attempts ea
JOIN exams e ON ea.exam_id = e.id
WHERE ea.student_id = {student_id} AND ea.status = 'completed';

-- Check job posting course
SELECT jp.title, c.name as course_name
FROM job_postings jp
LEFT JOIN courses c ON jp.course_id = c.id
WHERE jp.id = {job_posting_id};
```

### Issue 2: Course Mismatch
**Solution**: Ensure job posting `course_id` matches the course used in batches.

### Issue 3: No Exams Created
**Solution**: Create exams for the batch and ensure students have completed exam attempts.

### Issue 4: No Attendance/Exam Data
**Solution**: Add attendance and exam records for students.

## Testing the API

### 1. Check Data Setup
```bash
# Run the test script
php test_job_eligibility_flow.php
```

### 2. Test API Endpoint
```bash
curl -X GET "http://localhost:8000/api/job-postings/33/eligible-student"
```

### 3. Check Logs
```bash
tail -f storage/logs/laravel.log
```

## API Response Structure

```json
{
  "job_posting": {
    "id": 33,
    "title": "Frontend Developer",
    "company": "Tech Corp",
    "course_id": 1,
    "course_name": "Web Development"
  },
  "total_students": 50,
  "eligible_students": 15,
  "students": [
    {
             "student_id": 101,
       "student_name": "John Doe",
       "student_email": "john@example.com",
       "course_id": null,
       "course_name": "No Course Assigned",
             "enrolled_batches": [
         {
           "batch_id": 1,
           "batch_name": "Web Dev Batch 2024",
           "course_package_id": 1,
           "course_package_name": "Web Development"
         }
       ],
      "course_match": true,
      "course_match_reason": "Student enrolled in batch 'Web Dev Batch 2024' with required course 'Web Development'",
      "attendance_percentage": 85.5,
      "exam_marks": 78.2,
      "overall_eligible": true
    }
  ],
  "data_flow_info": {
    "message": "For proper eligibility checking, ensure: 1) Course exists, 2) Batch created with course, 3) Students enrolled in batch, 4) Exams created for batch, 5) Students have exam attempts, 6) Job posting has same course_id",
    "required_steps": [
      "Create course in courses table",
      "Create batch linked to course (course_id or course_package_id)",
      "Enroll students in batch via batch_user table",
      "Create exams for the batch",
      "Ensure students have completed exam attempts",
      "Create job posting with matching course_id"
    ]
  }
}
```

## Debugging Tips

1. **Check Laravel logs** for detailed course matching information
2. **Verify batch enrollment** using the `enrolled_batches` field in API response
3. **Ensure course consistency** between batches and job postings
4. **Add test data** for attendance and exams if needed

## Migration from Direct Course Assignment

If you were previously using direct course assignment (`users.course_id`), the API now:

1. **Primary**: Checks course matching through batch enrollment
2. **Fallback**: Uses direct course assignment for backward compatibility

This ensures a smooth transition while encouraging proper batch-based course management. 