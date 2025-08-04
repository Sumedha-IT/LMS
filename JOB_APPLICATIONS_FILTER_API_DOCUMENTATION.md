# Job Applications Filter API Documentation

## Overview
This API allows you to filter job applications by a specific job posting ID and then search within those applications by company name or date range with advanced sorting and pagination options.

## Endpoint
```
GET /api/job-applications/job_posting_id/{job_posting_id}/filter
```

## Base URL
```
http://localhost:8000/api/job-applications/job_posting_id/{job_posting_id}/filter
```

## URL Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `job_posting_id` | integer | Yes | The ID of the job posting to filter applications for | `/api/job-applications/job_posting_id/6/filter` |

## Query Parameters

### Filter Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `company_name` | string | No | Filter by company name (partial match) | `?company_name=Tech` |
| `start_date` | date | No | Filter applications submitted from this date (inclusive) | `?start_date=2025-07-01` |
| `end_date` | date | No | Filter applications submitted until this date (inclusive) | `?end_date=2025-07-31` |

### Sorting Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `sort_by` | string | No | Sort field (default: `created_at`) | `?sort_by=application_date` |
| `sort_order` | string | No | Sort direction: `asc` or `desc` (default: `desc`) | `?sort_order=asc` |

**Available sort fields:**
- `created_at` - Application creation date
- `application_date` - Application submission date
- `status` - Application status
- `user.name` - Applicant name

### Pagination Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `per_page` | integer | No | Items per page (1-100, default: 10) | `?per_page=20` |

## Response Format

### Success Response (200)
```json
{
    "success": true,
    "message": "Job applications filtered successfully",
    "job_posting_id": "6",
    "data": [
        {
            "id": 11,
            "job_posting_id": 6,
            "user_id": 11,
            "status": "applied",
            "application_date": "2024-05-31T18:30:00.000000Z",
            "shortlisted_date": null,
            "interview_date": null,
            "selection_date": null,
            "rejection_reason": null,
            "notes": "Looking forward to this opportunity.",
            "created_at": "2025-07-19T04:33:35.000000Z",
            "updated_at": "2025-07-19T04:33:35.000000Z",
            "job_posting": {
                "id": 6,
                "company_id": 2,
                "posted_by": 1,
                "title": "Frontend Developer",
                "description": "Develop modern web applications using React and Vue.js",
                "requirements": "B.Tech in Computer Science, 3+ years experience in JavaScript/React",
                "responsibilities": "Frontend Development, UI/UX Implementation, Code Review",
                "job_type": "full_time",
                "location": "Bangalore",
                "salary_min": "60000.00",
                "salary_max": "90000.00",
                "experience_required": "3-5 years",
                "vacancies": 1,
                "status": "open",
                "application_deadline": "2024-09-30 23:59:59",
                "created_at": "2025-07-18T18:02:40.000000Z",
                "updated_at": "2025-07-25T16:29:03.000000Z",
                "course_id": 1,
                "company": {
                    "id": 2,
                    "name": "Test Company",
                    "email": "hr@testcompany.com",
                    "phone": "+91-9876543210",
                    "website": "https://testcompany.com",
                    "address": "Tech Park, Bangalore",
                    "created_at": "2025-07-18T18:02:40.000000Z",
                    "updated_at": "2025-07-18T18:02:40.000000Z"
                },
                "course": {
                    "id": 1,
                    "name": "Data Science",
                    "description": "Data Science Fundamentals",
                    "created_at": "2025-07-18T18:02:40.000000Z",
                    "updated_at": "2025-07-18T18:02:40.000000Z"
                }
            },
            "user": {
                "id": 11,
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+91-9876543210",
                "created_at": "2024-02-21T18:44:06.000000Z",
                "updated_at": "2025-07-07T09:42:09.000000Z"
            }
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 1,
        "from": 1,
        "to": 1
    },
    "filters_applied": {
        "job_posting_id": 6,
        "company_name": "Test",
        "start_date": "2025-07-01",
        "end_date": "2025-07-31"
    },
    "sorting": {
        "sort_by": "created_at",
        "sort_order": "desc"
    }
}
```

### Error Response (422 - Validation Error)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "end_date": [
            "The end date must be a date after or equal to start date."
        ]
    }
}
```

### Error Response (500 - Server Error)
```json
{
    "success": false,
    "message": "An error occurred while filtering job applications",
    "error": "Error details..."
}
```

## Usage Examples

### 1. Filter by Job Posting ID Only
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter"
```

### 2. Filter by Job Posting ID and Company Name
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test"
```

### 3. Filter by Job Posting ID and Date Range
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?start_date=2025-07-01&end_date=2025-07-31"
```

### 4. Filter by Job Posting ID, Company Name, and Date Range
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test&start_date=2025-07-01&end_date=2025-07-31"
```

### 5. With Sorting
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test&sort_by=application_date&sort_order=desc"
```

### 6. With Pagination
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?per_page=5&sort_by=user.name&sort_order=asc"
```

### 7. Complex Filter with All Parameters
```bash
curl "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test&start_date=2025-07-01&end_date=2025-07-31&sort_by=application_date&sort_order=desc&per_page=20"
```

## PowerShell Examples

### 1. Basic Job Posting Filter
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-applications/job_posting_id/6/filter" -Method GET
```

### 2. With Company Name Filter
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test" -Method GET
```

### 3. With Date Range Filter
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-applications/job_posting_id/6/filter?start_date=2025-07-01&end_date=2025-07-31" -Method GET
```

### 4. Combined Filter with Sorting
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-applications/job_posting_id/6/filter?company_name=Test&start_date=2025-07-01&end_date=2025-07-31&sort_by=application_date&sort_order=desc&per_page=5" -Method GET
```

## Features

### ✅ Available Features
- **Job Posting ID Filtering**: Filter applications for a specific job posting
- **Company Name Filtering**: Partial match search in company names
- **Date Range Filtering**: Filter by application submission date
- **Flexible Sorting**: Sort by multiple fields in ascending/descending order
- **Pagination**: Configurable items per page (1-100)
- **Combined Filters**: Use multiple filters simultaneously
- **Eager Loading**: Includes job posting, company, course, and user information
- **Validation**: Comprehensive input validation with clear error messages

### 🔍 Filter Logic
- **Job Posting ID**: Primary filter - only shows applications for the specified job posting
- **Company Name**: Uses `LIKE` operator for partial matching (case-insensitive) on the job posting's company
- **Date Range**: 
  - `start_date`: Applications submitted on or after this date
  - `end_date`: Applications submitted on or before this date (includes time 23:59:59)

### 📊 Response Information
- **Success Status**: Boolean indicating API success
- **Message**: Human-readable success/error message
- **Job Posting ID**: The job posting ID used for filtering
- **Data**: Array of job application objects with related data
- **Pagination**: Complete pagination metadata
- **Filters Applied**: Shows which filters were actually used
- **Sorting**: Shows current sort configuration

## Error Handling

### Validation Errors (422)
- Invalid date formats
- End date before start date
- Invalid sort fields
- Invalid pagination values

### Server Errors (500)
- Database connection issues
- Query execution errors
- Unexpected exceptions

## Notes

1. **Authentication**: Currently disabled for testing. Re-enable `auth:sanctum` middleware for production.
2. **Performance**: Consider adding database indexes on frequently filtered fields.
3. **Caching**: Consider implementing Redis caching for frequently accessed filters.
4. **Rate Limiting**: API includes rate limiting (60 requests per minute).
5. **Logging**: All errors are logged for debugging purposes.
6. **Special Sorting**: The `user.name` sort field requires a JOIN operation for proper sorting.

## Testing

You can test this API using the provided test script:
```bash
php test_job_applications_filter.php
```

Or use the individual PowerShell commands shown in the examples above.

## Use Cases

1. **HR Dashboard**: View all applications for a specific job posting
2. **Company Filtering**: Filter applications by company name within a job posting
3. **Date Analysis**: Analyze application trends over time for a specific job
4. **Application Review**: Sort applications by submission date or applicant name
5. **Reporting**: Generate reports on application statistics for specific job postings