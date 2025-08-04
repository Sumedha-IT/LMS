# Student Job Postings API Documentation

## 🎯 **Purpose**
This API allows students to view and search available job postings after they sign up. Students can browse jobs, search by various criteria, and get detailed information about each position.

---

## 🔗 **Base URL**
```
http://localhost:8000/api
```

---

## 📋 **1. Get All Available Jobs**

### **GET /api/job-postings**

**Description:** Get all open job postings with basic filtering and pagination

**Query Parameters:**
```bash
# Pagination
per_page=10                    # Number of items per page (default: 10)

# Basic Search
search=developer               # Search in job title, description, requirements

# Job Type Filtering
job_type=full_time             # Single job type filter
job_type=part_time
job_type=contract
job_type=internship

# Location Filtering
location=Bangalore             # Filter by job location

# Domain Filtering
domain_id=1                    # Filter by domain ID

# Company Filtering
company_id=1                   # Filter by company ID

# Salary Range Filtering
salary_min=50000               # Minimum salary filter
salary_max=100000              # Maximum salary filter

# Experience Filtering
experience_required=2-4 years  # Filter by experience level

# Vacancy Filtering
has_vacancies=1                # Only jobs with vacancies (1/0)

# Sorting
sort_by=created_at             # Sort field
sort_order=desc                # Sort direction (asc/desc)
```

**Example Request:**
```bash
GET /api/job-postings?per_page=5&location=Bangalore&sort_by=created_at&sort_order=desc
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 28,
      "company_id": 10,
      "posted_by": {
        "id": 1,
        "name": "Admin",
        "email": "admin@mylearning.live"
      },
      "title": "Frontend Developer",
      "description": "Develop modern web applications using React and Vue.js",
      "requirements": "B.Tech in Computer Science, 2+ years experience",
      "responsibilities": "Frontend Development, UI/UX Implementation",
      "job_type": "full_time",
      "location": "Bangalore",
      "salary_min": "50000.00",
      "salary_max": "80000.00",
      "experience_required": "2-4 years",
      "vacancies": 2,
      "status": "open",
      "application_deadline": "2024-12-31 23:59:59",
      "created_at": "2024-06-01T10:00:00.000000Z",
      "updated_at": "2024-06-01T10:00:00.000000Z",
      "domain_id": 1,
      "company": {
        "id": 10,
        "name": "TechCorp Solutions",
        "location": "Bangalore",
        "description": "Leading technology company"
      },
      "domain": {
        "id": 1,
        "name": "DV",
        "description": "Digital Verification"
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
  "filters_applied": {
    "location": "Bangalore",
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
```

---

## 🔍 **2. Advanced Search**

### **GET /api/job-postings/search**

**Description:** Advanced search with global search capabilities

**Query Parameters:**
```bash
# Global Search
q=react developer               # Global search across multiple fields

# Multiple Job Type Filtering
job_types[]=full_time           # Multiple job type filters
job_types[]=part_time

# Multiple Location Filtering
locations[]=Bangalore           # Multiple location filters
locations[]=Mumbai

# Multiple Domain Filtering
domain_ids[]=1                  # Multiple domain IDs
domain_ids[]=2

# Multiple Company Filtering
company_ids[]=1                 # Multiple company IDs
company_ids[]=2

# Date Range Filtering
posted_date_from=2024-01-01     # Jobs posted from date
posted_date_to=2024-12-31       # Jobs posted to date
deadline_from=2024-01-01        # Application deadline from
deadline_to=2024-12-31          # Application deadline to

# Pagination
per_page=10
```

**Example Request:**
```bash
GET /api/job-postings/search?q=react&locations[]=Bangalore&per_page=5
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 28,
      "title": "Frontend Developer",
      "description": "Develop modern web applications using React and Vue.js",
      "location": "Bangalore",
      "salary_min": "50000.00",
      "salary_max": "80000.00",
      "experience_required": "2-4 years",
      "vacancies": 2,
      "status": "open",
      "application_deadline": "2024-12-31 23:59:59",
      "company": {
        "id": 10,
        "name": "TechCorp Solutions",
        "location": "Bangalore"
      },
      "domain": {
        "id": 1,
        "name": "DV",
        "description": "Digital Verification"
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
    "q": "react",
    "locations": ["Bangalore"],
    "per_page": 5
  }
}
```

---

## 📊 **3. Job Statistics**

### **GET /api/job-postings/statistics**

**Description:** Get job posting statistics and analytics

**Query Parameters:**
```bash
# Date Range Filtering (optional)
date_from=2024-01-01
date_to=2024-12-31
```

**Example Request:**
```bash
GET /api/job-postings/statistics
```

**Response Format:**
```json
{
  "total_jobs": 15,
  "jobs_by_domain": {
    "DV": 5,
    "Web Development": 6,
    "Mobile Development": 4
  },
  "jobs_by_location": {
    "Bangalore": 8,
    "Mumbai": 4,
    "Hyderabad": 3
  },
  "jobs_by_experience": {
    "0-2 years": 3,
    "2-4 years": 8,
    "3-5 years": 4
  }
}
```

---

## 👁️ **4. Get Single Job Details**

### **GET /api/job-postings/{id}**

**Description:** Get detailed information about a specific job posting

**Example Request:**
```bash
GET /api/job-postings/28
```

**Response Format:**
```json
{
  "data": {
    "id": 28,
    "company_id": 10,
    "posted_by": {
      "id": 1,
      "name": "Admin",
      "email": "admin@mylearning.live"
    },
    "title": "Frontend Developer",
    "description": "Develop modern web applications using React and Vue.js",
    "requirements": "B.Tech in Computer Science, 2+ years experience in JavaScript/React",
    "responsibilities": "Frontend Development, UI/UX Implementation, Code Review",
    "job_type": "full_time",
    "location": "Bangalore",
    "salary_min": "50000.00",
    "salary_max": "80000.00",
    "experience_required": "2-4 years",
    "vacancies": 2,
    "status": "open",
    "application_deadline": "2024-12-31 23:59:59",
    "created_at": "2024-06-01T10:00:00.000000Z",
    "updated_at": "2024-06-01T10:00:00.000000Z",
    "domain_id": 1,
    "company": {
      "id": 10,
      "name": "TechCorp Solutions",
      "location": "Bangalore",
      "description": "Leading technology company"
    },
    "domain": {
      "id": 1,
      "name": "DV",
      "description": "Digital Verification"
    }
  }
}
```

---

## 📋 **Job Types**

### **Available Job Types:**
- `full_time` - Full-time employment
- `part_time` - Part-time employment
- `contract` - Contract-based work
- `internship` - Internship positions

### **Sort Fields:**
- `created_at` - Job posting date
- `title` - Job title
- `location` - Job location
- `salary_min` - Minimum salary
- `salary_max` - Maximum salary
- `experience_required` - Experience level
- `application_deadline` - Application deadline
- `vacancies` - Number of vacancies

### **Sort Orders:**
- `asc` - Ascending order
- `desc` - Descending order

---

## ⚠️ **Error Responses**

### **400 Bad Request**
```json
{
  "error": "Invalid filter parameters"
}
```

### **404 Not Found**
```json
{
  "error": "Job posting not found"
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
- Add proper authorization for different user roles
- Implement API key validation if needed

---

## 🚀 **Quick Start Examples**

### **1. Get All Available Jobs**
```bash
curl "http://localhost:8000/api/job-postings?per_page=10"
```

### **2. Search Jobs by Location**
```bash
curl "http://localhost:8000/api/job-postings?location=Bangalore&per_page=5"
```

### **3. Search Jobs by Technology**
```bash
curl "http://localhost:8000/api/job-postings?search=React&per_page=5"
```

### **4. Filter by Job Type**
```bash
curl "http://localhost:8000/api/job-postings?job_type=full_time&per_page=5"
```

### **5. Filter by Salary Range**
```bash
curl "http://localhost:8000/api/job-postings?salary_min=50000&salary_max=100000&per_page=5"
```

### **6. Advanced Search**
```bash
curl "http://localhost:8000/api/job-postings/search?q=developer&locations[]=Bangalore&job_types[]=full_time"
```

### **7. Get Job Statistics**
```bash
curl "http://localhost:8000/api/job-postings/statistics"
```

### **8. Get Specific Job Details**
```bash
curl "http://localhost:8000/api/job-postings/28"
```

---

## 📊 **Database Schema Reference**

### **job_postings Table:**
```sql
- id (primary key)
- company_id (foreign key)
- posted_by (foreign key to users)
- title (string)
- description (text)
- requirements (text)
- responsibilities (text)
- job_type (enum: full_time, part_time, contract, internship)
- location (string)
- salary_min (decimal)
- salary_max (decimal)
- experience_required (string)
- vacancies (integer)
- status (enum: open, closed, draft)
- application_deadline (datetime)
- domain_id (foreign key, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### **Related Tables:**
- `companies` - Company details
- `domains` - Domain information
- `users` - User who posted the job

---

## 🎯 **Student Workflow**

### **1. Student Signs Up**
- Student creates account
- Student profile is created

### **2. Student Browses Jobs**
```bash
# View all available jobs
GET /api/job-postings

# Search for specific jobs
GET /api/job-postings?search=developer

# Filter by location
GET /api/job-postings?location=Bangalore

# Filter by domain
GET /api/job-postings?domain_id=1
```

### **3. Student Views Job Details**
```bash
# Get detailed job information
GET /api/job-postings/28
```

### **4. Student Applies for Job**
```bash
# Apply for the job (using job-applications API)
POST /api/job-applications
{
  "job_posting_id": 28,
  "user_id": 123,
  "status": "applied",
  "notes": "Interested in this position"
}
```

### **5. Student Tracks Applications**
```bash
# View their applications
GET /api/job-applications?user_id=123
```

---

## 🎉 **Features Summary**

### **✅ Available Features:**
- **Browse Jobs** - View all available job postings
- **Search Jobs** - Search by title, description, requirements
- **Filter Jobs** - Filter by location, domain, company, salary, experience
- **Advanced Search** - Global search across multiple fields
- **Job Statistics** - Analytics and insights
- **Pagination** - Efficient handling of large datasets
- **Sorting** - Multiple sort options
- **Job Details** - Detailed information about each position

### **🔧 Technical Features:**
- **Only Open Jobs** - Shows only jobs with status "open"
- **Deadline Filtering** - Only shows jobs before application deadline
- **Related Data** - Includes company and domain information
- **Error Handling** - Proper HTTP status codes
- **Performance** - Optimized queries with eager loading

The API is ready for students to browse and search job postings! 🚀 