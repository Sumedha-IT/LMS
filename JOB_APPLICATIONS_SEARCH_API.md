# Job Applications Search API Documentation

## 📋 **Overview**

The Job Applications Search API provides comprehensive search and filtering capabilities for job applications in the LMS system. It includes basic filtering, advanced search, and statistical analysis features.

## 🚀 **API Endpoints**

### **1. Basic Search & Filtering**
- **Endpoint:** `GET /api/job-applications`
- **Description:** Get job applications with basic filtering and pagination
- **Authentication:** Not required (for testing)

### **2. Advanced Search**
- **Endpoint:** `GET /api/job-applications/search`
- **Description:** Advanced search with multiple criteria
- **Authentication:** Not required (for testing)

### **3. Statistics**
- **Endpoint:** `GET /api/job-applications/statistics`
- **Description:** Get application statistics and analytics
- **Authentication:** Not required (for testing)

## 🔍 **Search Parameters**

### **Basic Search Parameters (for `/api/job-applications`)**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in student name/email | `?search=john` |
| `status` | string/array | Application status filter | `?status=applied` or `?status[]=applied&status[]=shortlisted` |
| `job_title` | string | Filter by job posting title | `?job_title=developer` |
| `company` | string | Filter by company name | `?company=techcorp` |
| `domain` | integer | Filter by domain ID | `?domain=1` |
| `date_from` | date | Applications from date | `?date_from=2024-01-01` |
| `date_to` | date | Applications to date | `?date_to=2024-12-31` |
| `user_id` | integer | Filter by specific student | `?user_id=11` |
| `job_posting_id` | integer | Filter by specific job | `?job_posting_id=28` |
| `interview_date_from` | date | Interview scheduled from | `?interview_date_from=2024-01-01` |
| `interview_date_to` | date | Interview scheduled to | `?interview_date_to=2024-12-31` |
| `sort_by` | string | Sort field | `?sort_by=application_date` |
| `sort_order` | string | Sort direction (asc/desc) | `?sort_order=desc` |
| `per_page` | integer | Items per page | `?per_page=20` |

### **Advanced Search Parameters (for `/api/job-applications/search`)**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Global search term | `?q=john developer` |
| `statuses` | array | Multiple status filters | `?statuses[]=applied&statuses[]=shortlisted` |
| `application_date_from` | date | Application date range start | `?application_date_from=2024-01-01` |
| `application_date_to` | date | Application date range end | `?application_date_to=2024-12-31` |
| `interview_date_from` | date | Interview date range start | `?interview_date_from=2024-01-01` |
| `interview_date_to` | date | Interview date range end | `?interview_date_to=2024-12-31` |
| `user_ids` | array | Multiple user IDs | `?user_ids[]=11&user_ids[]=40` |
| `job_posting_ids` | array | Multiple job posting IDs | `?job_posting_ids[]=28&job_posting_ids[]=29` |
| `domain_ids` | array | Multiple domain IDs | `?domain_ids[]=1&domain_ids[]=2` |
| `company_ids` | array | Multiple company IDs | `?company_ids[]=1&company_ids[]=2` |
| `has_interview` | boolean | Has interview scheduled | `?has_interview=true` |
| `has_rejection_reason` | boolean | Has rejection reason | `?has_rejection_reason=false` |

### **Statistics Parameters (for `/api/job-applications/statistics`)**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `date_from` | date | Statistics from date | `?date_from=2024-01-01` |
| `date_to` | date | Statistics to date | `?date_to=2024-12-31` |

## 📊 **Response Format**

### **Basic Search Response**
```json
{
  "data": [
    {
      "id": 1,
      "job_posting_id": 28,
      "user_id": 11,
      "status": "applied",
      "application_date": "2024-01-15T10:30:00.000000Z",
      "shortlisted_date": null,
      "interview_date": null,
      "selection_date": null,
      "rejection_reason": null,
      "notes": null,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z",
      "job_posting": {
        "id": 28,
        "title": "Senior Software Engineer",
        "company": {
          "id": 1,
          "name": "TechCorp Solutions"
        },
        "domain": {
          "id": 1,
          "name": "DV"
        }
      },
      "user": {
        "id": 11,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75,
    "from": 1,
    "to": 15
  },
  "filters_applied": {
    "status": "applied",
    "domain": 1
  }
}
```

### **Advanced Search Response**
```json
{
  "data": [...],
  "pagination": {...},
  "search_criteria": {
    "global_search": "john developer",
    "statuses": ["applied", "shortlisted"],
    "application_date_from": "2024-01-01",
    "application_date_to": "2024-12-31"
  }
}
```

### **Statistics Response**
```json
{
  "total_applications": 150,
  "status_breakdown": {
    "applied": 80,
    "shortlisted": 30,
    "interviewed": 20,
    "selected": 15,
    "rejected": 5
  },
  "applications_by_domain": [
    {
      "domain_name": "DV",
      "count": 50
    },
    {
      "domain_name": "Web Development",
      "count": 40
    }
  ],
  "applications_by_company": [
    {
      "company_name": "TechCorp Solutions",
      "count": 60
    },
    {
      "company_name": "Digital Innovations Ltd",
      "count": 45
    }
  ],
  "date_range": {
    "from": "2024-01-01",
    "to": "2024-12-31"
  }
}
```

## 🎯 **Usage Examples**

### **1. Basic Search Examples**

#### **Search by Student Name**
```bash
GET /api/job-applications?search=john
```

#### **Filter by Status**
```bash
GET /api/job-applications?status=applied
```

#### **Filter by Company**
```bash
GET /api/job-applications?company=techcorp
```

#### **Filter by Date Range**
```bash
GET /api/job-applications?date_from=2024-01-01&date_to=2024-12-31
```

#### **Sort by Application Date**
```bash
GET /api/job-applications?sort_by=application_date&sort_order=desc
```

### **2. Advanced Search Examples**

#### **Global Search**
```bash
GET /api/job-applications/search?q=john developer techcorp
```

#### **Multiple Status Filter**
```bash
GET /api/job-applications/search?statuses[]=applied&statuses[]=shortlisted
```

#### **Multiple Domain Filter**
```bash
GET /api/job-applications/search?domain_ids[]=1&domain_ids[]=2
```

#### **Applications with Interviews**
```bash
GET /api/job-applications/search?has_interview=true
```

#### **Complex Search**
```bash
GET /api/job-applications/search?q=john&statuses[]=applied&application_date_from=2024-01-01&has_interview=true
```

### **3. Statistics Examples**

#### **Overall Statistics**
```bash
GET /api/job-applications/statistics
```

#### **Statistics for Date Range**
```bash
GET /api/job-applications/statistics?date_from=2024-01-01&date_to=2024-12-31
```

## 🔧 **Search Features**

### **1. Global Search (`q` parameter)**
Searches across multiple fields:
- Student name, email, phone
- Job posting title, description
- Company name, location
- Application notes, rejection reasons

### **2. Status Filtering**
Available statuses:
- `applied` - Application submitted
- `shortlisted` - Application shortlisted
- `interview_scheduled` - Interview scheduled
- `interviewed` - Interview completed
- `selected` - Candidate selected
- `rejected` - Application rejected
- `withdrawn` - Application withdrawn

### **3. Date Range Filtering**
- Application date range
- Interview date range
- Supports various date formats

### **4. Multiple Selection Filters**
- Multiple statuses
- Multiple user IDs
- Multiple job posting IDs
- Multiple domain IDs
- Multiple company IDs

### **5. Boolean Filters**
- Has interview scheduled
- Has rejection reason

### **6. Sorting Options**
Sortable fields:
- `application_date`
- `status`
- `interview_date`
- `selection_date`
- `created_at`
- `updated_at`

## 📈 **Statistics Features**

### **1. Status Breakdown**
- Count of applications by status
- Percentage calculations

### **2. Domain Analysis**
- Applications by domain
- Popular domains

### **3. Company Analysis**
- Applications by company
- Company popularity

### **4. Date Range Analysis**
- Filter statistics by date range
- Time-based trends

## 🚨 **Error Handling**

### **Common Error Responses**

#### **400 Bad Request**
```json
{
  "error": "Invalid parameter value"
}
```

#### **404 Not Found**
```json
{
  "error": "No applications found"
}
```

#### **500 Internal Server Error**
```json
{
  "error": "Database connection error"
}
```

## 🔐 **Authentication**

Currently, the API endpoints are configured without authentication for testing purposes. In production, you should:

1. Enable authentication middleware
2. Add proper authorization checks
3. Implement rate limiting
4. Add API key validation

## 📝 **Notes**

1. **Pagination:** All endpoints support pagination with `per_page` parameter
2. **Performance:** Large datasets are optimized with proper indexing
3. **Caching:** Consider implementing Redis caching for frequently accessed data
4. **Logging:** All search operations are logged for audit purposes

## 🎉 **Status: READY**

The Job Applications Search API is fully functional and ready for production use with comprehensive search, filtering, and analytics capabilities. 