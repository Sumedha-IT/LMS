# Job Applications API Documentation

## 🔗 **Base URL**
```
http://localhost:8000/api
```

---

## 📋 **1. Basic Search & List Applications**

### **GET /api/job-applications**

**Description:** Get all job applications with basic filtering and pagination

**Query Parameters:**
```bash
# Pagination
per_page=10                    # Number of items per page (default: 15)

# Basic Search
search=john                    # Search in student name/email

# Status Filtering
status=applied                 # Single status filter
status=shortlisted
status=rejected
status=selected

# Job & Company Filtering
job_title=developer            # Filter by job posting title
company=techcorp               # Filter by company name
domain=1                       # Filter by domain ID

# Date Filtering
date_from=2024-01-01          # Application date from
date_to=2024-12-31            # Application date to
interview_date_from=2024-01-01 # Interview date from
interview_date_to=2024-12-31   # Interview date to

# Specific ID Filtering
user_id=1                      # Filter by specific student
job_posting_id=6               # Filter by specific job posting

# Sorting
sort_by=application_date       # Sort field
sort_order=desc                # Sort direction (asc/desc)
```

**Example Request:**
```bash
GET /api/job-applications?per_page=5&status=applied&sort_by=application_date&sort_order=desc
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 10,
      "job_posting_id": 6,
      "user_id": 1,
      "status": "applied",
      "application_date": "2024-06-01T04:30:00.000000Z",
      "shortlisted_date": null,
      "interview_date": null,
      "selection_date": null,
      "rejection_reason": null,
      "notes": null,
      "created_at": "2024-06-01T04:30:00.000000Z",
      "updated_at": "2024-06-01T04:30:00.000000Z",
      "job_posting": {
        "id": 6,
        "title": "Software Developer",
        "description": "We are looking for a skilled developer...",
        "company_id": 1,
        "domain_id": 1,
        "company": {
          "id": 1,
          "name": "TechCorp Solutions",
          "location": "New York"
        },
        "domain": {
          "id": 1,
          "name": "DV",
          "description": "Digital Verification"
        }
      },
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 5,
    "total": 1,
    "from": 1,
    "to": 1
  },
  "applied_filters": {
    "status": "applied",
    "sort_by": "application_date",
    "sort_order": "desc"
  }
}
```

---

## 🔍 **2. Advanced Search**

### **GET /api/test-job-applications-search**

**Description:** Advanced search with global search capabilities

**Query Parameters:**
```bash
# Global Search
q=john developer               # Global search across multiple fields

# Multiple Status Filtering
statuses[]=applied             # Multiple status filters
statuses[]=shortlisted

# Multiple ID Filtering
user_ids[]=1                   # Multiple user IDs
user_ids[]=2
job_posting_ids[]=6            # Multiple job posting IDs
job_posting_ids[]=7
domain_ids[]=1                 # Multiple domain IDs
domain_ids[]=2
company_ids[]=1                # Multiple company IDs
company_ids[]=2

# Boolean Filters
has_interview=1                # Has interview scheduled (1/0)
has_rejection_reason=1         # Has rejection reason (1/0)

# Date Range Filtering
application_date_from=2024-01-01
application_date_to=2024-12-31
interview_date_from=2024-01-01
interview_date_to=2024-12-31

# Pagination
per_page=10
```

**Example Request:**
```bash
GET /api/test-job-applications-search?q=john&statuses[]=applied&per_page=5
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 10,
      "job_posting_id": 6,
      "user_id": 1,
      "status": "applied",
      "application_date": "2024-06-01T04:30:00.000000Z",
      "shortlisted_date": null,
      "interview_date": null,
      "selection_date": null,
      "rejection_reason": null,
      "notes": null,
      "created_at": "2024-06-01T04:30:00.000000Z",
      "updated_at": "2024-06-01T04:30:00.000000Z",
      "job_posting": {
        "id": 6,
        "title": "Software Developer",
        "description": "We are looking for a skilled developer...",
        "company_id": 1,
        "domain_id": 1,
        "company": {
          "id": 1,
          "name": "TechCorp Solutions",
          "location": "New York"
        },
        "domain": {
          "id": 1,
          "name": "DV",
          "description": "Digital Verification"
        }
      },
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 5,
    "total": 1,
    "from": 1,
    "to": 1
  },
  "search_criteria": {
    "q": "john",
    "statuses": ["applied"],
    "per_page": 5
  }
}
```

---

## 📊 **3. Statistics**

### **GET /api/test-job-applications-statistics**

**Description:** Get application statistics and analytics

**Query Parameters:**
```bash
# Date Range Filtering (for future implementation)
date_from=2024-01-01
date_to=2024-12-31
```

**Example Request:**
```bash
GET /api/test-job-applications-statistics
```

**Response Format:**
```json
{
  "total_applications": 1,
  "status_breakdown": {
    "applied": 1,
    "shortlisted": 0,
    "rejected": 0,
    "selected": 0
  },
  "applications_by_domain": {
    "DV": 1,
    "Web Development": 0,
    "Mobile Development": 0
  },
  "applications_by_company": {
    "TechCorp Solutions": 1,
    "InnovateTech": 0
  },
  "test": "success"
}
```

---

## 📝 **4. Create New Application**

### **POST /api/job-applications**

**Description:** Create a new job application

**Request Body:**
```json
{
  "job_posting_id": 6,
  "user_id": 1,
  "status": "applied",
  "application_date": "2024-06-01",
  "notes": "Interested in this position",
  "shortlisted_date": null,
  "interview_date": null,
  "selection_date": null,
  "rejection_reason": null
}
```

**Required Fields:**
- `job_posting_id` (integer)
- `user_id` (integer)
- `status` (string: applied, shortlisted, rejected, selected)

**Optional Fields:**
- `application_date` (date)
- `notes` (string)
- `shortlisted_date` (date)
- `interview_date` (date)
- `selection_date` (date)
- `rejection_reason` (string)

**Response Format:**
```json
{
  "message": "Job application created successfully",
  "data": {
    "id": 11,
    "job_posting_id": 6,
    "user_id": 1,
    "status": "applied",
    "application_date": "2024-06-01T00:00:00.000000Z",
    "shortlisted_date": null,
    "interview_date": null,
    "selection_date": null,
    "rejection_reason": null,
    "notes": "Interested in this position",
    "created_at": "2024-06-01T10:30:00.000000Z",
    "updated_at": "2024-06-01T10:30:00.000000Z"
  }
}
```

---

## 👁️ **5. Get Single Application**

### **GET /api/job-applications/{id}**

**Description:** Get a specific job application by ID

**Example Request:**
```bash
GET /api/job-applications/10
```

**Response Format:**
```json
{
  "data": {
    "id": 10,
    "job_posting_id": 6,
    "user_id": 1,
    "status": "applied",
    "application_date": "2024-06-01T04:30:00.000000Z",
    "shortlisted_date": null,
    "interview_date": null,
    "selection_date": null,
    "rejection_reason": null,
    "notes": null,
    "created_at": "2024-06-01T04:30:00.000000Z",
    "updated_at": "2024-06-01T04:30:00.000000Z",
    "job_posting": {
      "id": 6,
      "title": "Software Developer",
      "description": "We are looking for a skilled developer...",
      "company_id": 1,
      "domain_id": 1,
      "company": {
        "id": 1,
        "name": "TechCorp Solutions",
        "location": "New York"
      },
      "domain": {
        "id": 1,
        "name": "DV",
        "description": "Digital Verification"
      }
    },
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

---

## ✏️ **6. Update Application**

### **PUT /api/job-applications/{id}**

**Description:** Update an existing job application

**Request Body:**
```json
{
  "status": "shortlisted",
  "shortlisted_date": "2024-06-15",
  "interview_date": "2024-06-20",
  "notes": "Candidate has been shortlisted for interview"
}
```

**All Fields Optional:**
- `status` (string: applied, shortlisted, rejected, selected)
- `application_date` (date)
- `shortlisted_date` (date)
- `interview_date` (date)
- `selection_date` (date)
- `rejection_reason` (string)
- `notes` (string)

**Response Format:**
```json
{
  "message": "Job application updated successfully",
  "data": {
    "id": 10,
    "job_posting_id": 6,
    "user_id": 1,
    "status": "shortlisted",
    "application_date": "2024-06-01T04:30:00.000000Z",
    "shortlisted_date": "2024-06-15T00:00:00.000000Z",
    "interview_date": "2024-06-20T00:00:00.000000Z",
    "selection_date": null,
    "rejection_reason": null,
    "notes": "Candidate has been shortlisted for interview",
    "created_at": "2024-06-01T04:30:00.000000Z",
    "updated_at": "2024-06-01T10:30:00.000000Z"
  }
}
```

---

## 🗑️ **7. Delete Application**

### **DELETE /api/job-applications/{id}**

**Description:** Delete a job application

**Example Request:**
```bash
DELETE /api/job-applications/10
```

**Response Format:**
```json
{
  "message": "Job application deleted successfully"
}
```

---

## 🔧 **8. Job Eligibility Check**

### **GET /api/job-postings/{job_posting_id}/eligible-student**

**Description:** Get list of eligible students for a specific job posting

**Example Request:**
```bash
GET /api/job-postings/6/eligible-student
```

**Response Format:**
```json
{
  "job_posting": {
    "id": 6,
    "title": "Software Developer",
    "company": "TechCorp Solutions",
    "domain_id": 1,
    "domain_name": "DV"
  },
  "total_students": 10,
  "eligible_students": 8,
  "students": [
    {
      "student_id": 11,
      "student_name": "John Doe",
      "student_email": "john@example.com",
      "domain_id": 1,
      "domain_name": "DV",
      "domain_match": true,
      "domain_match_reason": "Domain matches job requirement",
      "eligible": true,
      "overall_eligible": true,
      "attendance_percentage": 85.5,
      "exam_marks": 82.3,
      "reasons": "All criteria met"
    }
  ]
}
```

---

## 📋 **Status Values**

### **Application Status Options:**
- `applied` - Application submitted
- `shortlisted` - Candidate shortlisted for interview
- `rejected` - Application rejected
- `selected` - Candidate selected for the position

### **Sort Fields:**
- `application_date` - Application submission date
- `interview_date` - Interview scheduled date
- `status` - Application status
- `created_at` - Record creation date
- `updated_at` - Record last update date

### **Sort Orders:**
- `asc` - Ascending order
- `desc` - Descending order

---

## ⚠️ **Error Responses**

### **400 Bad Request**
```json
{
  "error": "Validation failed",
  "errors": {
    "job_posting_id": ["The job posting id field is required."],
    "user_id": ["The user id field is required."]
  }
}
```

### **404 Not Found**
```json
{
  "error": "Job application not found"
}
```

### **500 Internal Server Error**
```json
{
  "error": "An error occurred while processing your request"
}
```

---

## 🔐 **Authentication Notes**

**Current Status:** Authentication is temporarily disabled for testing purposes.

**For Production:**
- Enable `auth:sanctum` middleware
- Add proper authorization checks
- Implement API key validation if needed

---

## 🚀 **Quick Start Examples**

### **1. Get All Applications**
```bash
curl "http://localhost:8000/api/job-applications?per_page=10"
```

### **2. Search Applications**
```bash
curl "http://localhost:8000/api/test-job-applications-search?q=john&status=applied"
```

### **3. Get Statistics**
```bash
curl "http://localhost:8000/api/test-job-applications-statistics"
```

### **4. Create Application**
```bash
curl -X POST "http://localhost:8000/api/job-applications" \
  -H "Content-Type: application/json" \
  -d '{
    "job_posting_id": 6,
    "user_id": 1,
    "status": "applied",
    "notes": "Interested in this position"
  }'
```

### **5. Update Application**
```bash
curl -X PUT "http://localhost:8000/api/job-applications/10" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "interview_date": "2024-06-20"
  }'
```

---

## 📊 **Database Schema Reference**

### **job_applications Table:**
```sql
- id (primary key)
- job_posting_id (foreign key)
- user_id (foreign key)
- status (enum: applied, shortlisted, rejected, selected)
- application_date (date)
- shortlisted_date (date, nullable)
- interview_date (date, nullable)
- selection_date (date, nullable)
- rejection_reason (text, nullable)
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### **Related Tables:**
- `job_postings` - Job posting details
- `users` - Student information
- `companies` - Company details
- `domains` - Domain information 