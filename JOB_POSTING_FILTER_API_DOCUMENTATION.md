# Job Posting Filter API Documentation

## Overview
This API allows you to filter job postings by company name and date range with advanced sorting and pagination options.

## Endpoint
```
GET /api/job-postings/filter/company-date
```

## Base URL
```
http://localhost:8000/api/job-postings/filter/company-date
```

## Query Parameters

### Filter Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `company_name` | string | No | Filter by company name (partial match) | `?company_name=Tech` |
| `start_date` | date | No | Filter jobs created from this date (inclusive) | `?start_date=2025-07-01` |
| `end_date` | date | No | Filter jobs created until this date (inclusive) | `?end_date=2025-07-31` |

### Sorting Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `sort_by` | string | No | Sort field (default: `created_at`) | `?sort_by=title` |
| `sort_order` | string | No | Sort direction: `asc` or `desc` (default: `desc`) | `?sort_order=asc` |

**Available sort fields:**
- `created_at` - Job posting creation date
- `title` - Job title
- `salary_min` - Minimum salary
- `salary_max` - Maximum salary
- `application_deadline` - Application deadline

### Pagination Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `per_page` | integer | No | Items per page (1-100, default: 10) | `?per_page=20` |

## Response Format

### Success Response (200)
```json
{
    "success": true,
    "message": "Job postings filtered successfully",
    "data": [
        {
            "id": 28,
            "company_id": 10,
            "posted_by": 1,
            "title": "General Software Developer",
            "description": "Develop software applications...",
            "requirements": "B.Tech in Computer Science...",
            "responsibilities": "Software Development...",
            "job_type": "full_time",
            "location": "Hyderabad",
            "salary_min": "45000.00",
            "salary_max": "65000.00",
            "experience_required": "1-3 years",
            "vacancies": 2,
            "status": "open",
            "application_deadline": "2024-10-15 23:59:59",
            "created_at": "2025-07-26T10:30:00.000000Z",
            "updated_at": "2025-07-26T10:30:00.000000Z",
            "course_id": 1,
            "company": {
                "id": 10,
                "name": "TechCorp Solutions",
                "email": "hr@techcorp.com",
                "phone": "+91-9876543210",
                "website": "https://techcorp.com",
                "address": "Tech Park, Hyderabad",
                "created_at": "2025-07-18T18:02:40.000000Z",
                "updated_at": "2025-07-18T18:02:40.000000Z"
            },
            "course": {
                "id": 1,
                "name": "Data Science",
                "description": "Data Science Fundamentals",
                "created_at": "2025-07-18T18:02:40.000000Z",
                "updated_at": "2025-07-18T18:02:40.000000Z"
            },
            "postedBy": {
                "id": 1,
                "name": "Admin",
                "email": "admin@mylearning.live"
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
        "company_name": "Tech",
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
    "message": "An error occurred while filtering job postings",
    "error": "Error details..."
}
```

## Usage Examples

### 1. Filter by Company Name Only
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?company_name=Tech"
```

### 2. Filter by Date Range Only
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?start_date=2025-07-01&end_date=2025-07-31"
```

### 3. Filter by Both Company and Date
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?company_name=Tech&start_date=2025-07-01&end_date=2025-07-31"
```

### 4. With Sorting
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?company_name=Tech&sort_by=title&sort_order=asc"
```

### 5. With Pagination
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?per_page=5&sort_by=created_at&sort_order=desc"
```

### 6. Complex Filter with All Parameters
```bash
curl "http://localhost:8000/api/job-postings/filter/company-date?company_name=Tech&start_date=2025-07-01&end_date=2025-07-31&sort_by=salary_min&sort_order=desc&per_page=20"
```

## PowerShell Examples

### 1. Basic Company Filter
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-postings/filter/company-date?company_name=Test" -Method GET
```

### 2. Date Range Filter
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-postings/filter/company-date?start_date=2025-07-01&end_date=2025-07-31" -Method GET
```

### 3. Combined Filter with Sorting
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/job-postings/filter/company-date?company_name=Tech&start_date=2025-07-01&end_date=2025-07-31&sort_by=title&sort_order=asc&per_page=5" -Method GET
```

## Features

### ✅ Available Features
- **Company Name Filtering**: Partial match search in company names
- **Date Range Filtering**: Filter by job posting creation date
- **Flexible Sorting**: Sort by multiple fields in ascending/descending order
- **Pagination**: Configurable items per page (1-100)
- **Combined Filters**: Use multiple filters simultaneously
- **Open Jobs Only**: Automatically filters only open job postings
- **Active Deadlines**: Only shows jobs with future application deadlines
- **Eager Loading**: Includes company, course, and posted by information
- **Validation**: Comprehensive input validation with clear error messages

### 🔍 Filter Logic
- **Company Name**: Uses `LIKE` operator for partial matching (case-insensitive)
- **Date Range**: 
  - `start_date`: Jobs created on or after this date
  - `end_date`: Jobs created on or before this date (includes time 23:59:59)
- **Base Filters**: Always applies `status = 'open'` and `application_deadline > now()`

### 📊 Response Information
- **Success Status**: Boolean indicating API success
- **Message**: Human-readable success/error message
- **Data**: Array of job posting objects with related data
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

## Testing

You can test this API using the provided test script:
```bash
php test_company_date_filter.php
```

Or use the individual PowerShell commands shown in the examples above.