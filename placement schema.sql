-- 1. PLACEMENT CRITERIA (Admin Configurable Rules)
-- =====================================================
CREATE TABLE `placement_criteria` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,           -- Unique identifier
  `name` varchar(255) NOT NULL,                           -- Criteria name (e.g., "Standard Placement Criteria")
  `profile_completion_percentage` decimal(5,2) DEFAULT 90.00,  -- Minimum profile completion % required
  `course_completion_required` tinyint(1) DEFAULT 1,      -- 1=Yes, 0=No - Must complete course?
  `exam_standards_required` tinyint(1) DEFAULT 1,         -- 1=Yes, 0=No - Must meet exam standards?
  `attendance_percentage` decimal(5,2) DEFAULT 75.00,     -- Minimum attendance % required
  `fees_payment_required` tinyint(1) DEFAULT 1,          -- 1=Yes, 0=No - Must pay fees?
  `lab_test_cases_required` tinyint(1) DEFAULT 1,        -- 1=Yes, 0=No - Must complete lab tests?
  `assignments_required` tinyint(1) DEFAULT 1,            -- 1=Yes, 0=No - Must complete assignments?
  `is_active` tinyint(1) DEFAULT 1,                      -- 1=Active criteria, 0=Inactive
  `created_at` timestamp NULL DEFAULT NULL,               -- When criteria was created
  `updated_at` timestamp NULL DEFAULT NULL,               -- When criteria was last updated
  PRIMARY KEY (`id`)
);

-- 2. STUDENT PLACEMENT ELIGIBILITY (Student Placement Status Tracking)
-- =====================================================
CREATE TABLE `student_placement_eligibility` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,          -- Unique identifier
  `user_id` bigint UNSIGNED NOT NULL,                    -- Links to users table (student)
  `is_eligible` tinyint(1) DEFAULT 0,                    -- 1=Eligible, 0=Not eligible
  `eligibility_reasons` text,                            -- Why student is/not eligible (e.g., "Resume missing, Attendance low")
  `profile_completion_percentage` decimal(5,2) DEFAULT 0.00,  -- Calculated % from user profile data
  `course_completion_status` tinyint(1) DEFAULT 0,       -- 1=Completed, 0=Not completed
  `exam_standards_met` tinyint(1) DEFAULT 0,             -- 1=Met standards, 0=Not met
  `attendance_percentage` decimal(5,2) DEFAULT 0.00,     -- Student's actual attendance %
  `fees_payment_status` tinyint(1) DEFAULT 0,            -- 1=Paid, 0=Not paid
  `lab_test_cases_completed` tinyint(1) DEFAULT 0,       -- 1=Completed, 0=Not completed
  `assignments_completed` tinyint(1) DEFAULT 0,          -- 1=Completed, 0=Not completed
  `is_placed` tinyint(1) DEFAULT 0,                      -- 1=Got job, 0=Not placed
  `placement_date` timestamp NULL DEFAULT NULL,           -- When student got placed
  `placement_salary` decimal(10,2) DEFAULT NULL,         -- Salary offered (e.g., 50000.00)
  `placement_company` varchar(255) DEFAULT NULL,          -- Company name where placed
  `is_pap_student` tinyint(1) DEFAULT 0,                 -- 1=Placement After Payment student, 0=Regular
  `remaining_fee_amount` decimal(10,2) DEFAULT NULL,     -- Remaining fees for PAP students
  `google_review_status` enum('pending','completed','declined') DEFAULT 'pending',  -- Google review status
  `google_review_link` varchar(500) DEFAULT NULL,         -- Link to Google review
  `last_eligibility_check` timestamp NULL DEFAULT NULL,   -- When eligibility was last calculated
  `created_at` timestamp NULL DEFAULT NULL,               -- When record was created
  `updated_at` timestamp NULL DEFAULT NULL,               -- When record was last updated
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),                      -- One record per student
  KEY `is_eligible` (`is_eligible`),                     -- Index for quick filtering
  KEY `is_placed` (`is_placed`),                         -- Index for quick filtering
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- 3. COMPANIES (Recruiter/Company Information)
-- =====================================================
CREATE TABLE `companies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,          -- Unique identifier
  `name` varchar(255) NOT NULL,                          -- Company name (e.g., "Google", "Microsoft")
  `description` text,                                     -- Company description
  `website` varchar(255) DEFAULT NULL,                    -- Company website URL
  `logo_path` varchar(255) DEFAULT NULL,                  -- Path to company logo image
  `industry` varchar(255) DEFAULT NULL,                   -- Industry (e.g., "Technology", "Finance")
  `company_size` varchar(100) DEFAULT NULL,               -- Size (e.g., "1000-5000 employees")
  `contact_person` varchar(255) DEFAULT NULL,             -- HR contact name
  `contact_email` varchar(255) DEFAULT NULL,              -- HR contact email
  `contact_phone` varchar(50) DEFAULT NULL,               -- HR contact phone
  `address` text,                                         -- Company address
  `is_active` tinyint(1) DEFAULT 1,                      -- 1=Active company, 0=Inactive
  `created_at` timestamp NULL DEFAULT NULL,               -- When company was added
  `updated_at` timestamp NULL DEFAULT NULL,               -- When company info was updated
  PRIMARY KEY (`id`)
);

-- 4. JOB POSTINGS (Job Opportunities)
-- =====================================================
CREATE TABLE `job_postings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,          -- Unique identifier
  `company_id` bigint UNSIGNED NOT NULL,                 -- Links to companies table
  `posted_by` bigint UNSIGNED NOT NULL,                  -- Links to users table (job coordinator)
  `title` varchar(255) NOT NULL,                          -- Job title (e.g., "Software Engineer")
  `description` text NOT NULL,                            -- Detailed job description
  `requirements` text,                                     -- Job requirements
  `responsibilities` text,                                 -- Job responsibilities
  `job_type` enum('full_time','part_time','contract','internship') DEFAULT 'full_time',  -- Type of job
  `location` varchar(255) DEFAULT NULL,                   -- Job location (e.g., "Hyderabad", "Remote")
  `salary_min` decimal(10,2) DEFAULT NULL,                -- Minimum salary (e.g., 50000.00)
  `salary_max` decimal(10,2) DEFAULT NULL,                -- Maximum salary (e.g., 80000.00)
  `experience_required` varchar(100) DEFAULT NULL,        -- Experience needed (e.g., "0-2 years")
  `vacancies` int DEFAULT 1,                              -- Number of positions available
  `status` enum('draft','open','closed','expired') DEFAULT 'draft',  -- Job status
  `application_deadline` datetime DEFAULT NULL,           -- Last date to apply
  `created_at` timestamp NULL DEFAULT NULL,               -- When job was posted
  `updated_at` timestamp NULL DEFAULT NULL,               -- When job was updated
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),                        -- Index for company filtering
  KEY `posted_by` (`posted_by`),                         -- Index for coordinator filtering
  KEY `status` (`status`),                                -- Index for status filtering
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
);

-- 5. JOB ELIGIBILITY CRITERIA (Job-Specific Requirements)
-- =====================================================
CREATE TABLE `job_eligibility_criteria` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,          -- Unique identifier
  `job_posting_id` bigint UNSIGNED NOT NULL,             -- Links to job_postings table
  `btech_year_of_passout_min` int DEFAULT NULL,          -- Minimum BTech passout year (e.g., 2020)
  `btech_year_of_passout_max` int DEFAULT NULL,          -- Maximum BTech passout year (e.g., 2023)
  `mtech_year_of_passout_min` int DEFAULT NULL,           -- Minimum MTech passout year
  `mtech_year_of_passout_max` int DEFAULT NULL,           -- Maximum MTech passout year
  `btech_percentage_min` decimal(5,2) DEFAULT NULL,       -- Minimum BTech percentage (e.g., 70.00)
  `mtech_percentage_min` decimal(5,2) DEFAULT NULL,       -- Minimum MTech percentage
  `domain_id` bigint UNSIGNED DEFAULT NULL,               -- Links to domains table
  `skills_required` json DEFAULT NULL,                    -- Required skills (e.g., ["Java", "Python", "SQL"])
  `additional_criteria` text,                             -- Any other criteria
  `created_at` timestamp NULL DEFAULT NULL,               -- When criteria was created
  `updated_at` timestamp NULL DEFAULT NULL,               -- When criteria was updated
  PRIMARY KEY (`id`),
  KEY `job_posting_id` (`job_posting_id`),               -- Index for job filtering
  FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE
);

-- 6. JOB APPLICATIONS (Student Job Applications)
-- =====================================================
CREATE TABLE `job_applications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,          -- Unique identifier
  `job_posting_id` bigint UNSIGNED NOT NULL,             -- Links to job_postings table
  `user_id` bigint UNSIGNED NOT NULL,                    -- Links to users table (student)
  `status` enum('applied','shortlisted','interview_scheduled','interviewed','selected','rejected','withdrawn') DEFAULT 'applied',  -- Application status
  `application_date` timestamp DEFAULT CURRENT_TIMESTAMP,  -- When student applied
  `shortlisted_date` timestamp NULL DEFAULT NULL,         -- When student was shortlisted
  `interview_date` timestamp NULL DEFAULT NULL,           -- When interview is scheduled
  `selection_date` timestamp NULL DEFAULT NULL,           -- When student was selected
  `rejection_reason` text,                                -- Why student was rejected
  `notes` text,                                           -- Additional notes
  `created_at` timestamp NULL DEFAULT NULL,               -- When application was created
  `updated_at` timestamp NULL DEFAULT NULL,               -- When application was updated
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application` (`job_posting_id`, `user_id`),  -- One application per student per job
  KEY `user_id` (`user_id`),                             -- Index for student filtering
  KEY `status` (`status`),                                -- Index for status filtering
  FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);





  these are the query we can do :
      --STUDENT PLACEMENT VIEW (Combines User Data + Placement Status)
-- =====================================================
CREATE VIEW `student_placement_view` AS
SELECT 
    u.id,                                                  -- Student ID
    u.name,                                                -- Student name
    u.email,                                               -- Student email
    u.phone,                                               -- Student phone
    u.qualification,                                        -- Student qualification
    u.year_of_passed_out,                                  -- Year of pass out
    u.domain_id,                                           -- Student domain
    u.upload_resume,                                        -- Resume file path
    u.passport_photo_path,                                  -- Photo file path
    u.upload_picture,                                       -- Additional picture
    u.upload_marklist,                                      -- Mark list file
    u.upload_aadhar,                                        -- Aadhar file
    u.upload_agreement,                                     -- Agreement file
    u.parent_name,                                          -- Parent name
    u.parent_contact,                                       -- Parent contact
    u.parent_email,                                         -- Parent email
    u.parent_aadhar,                                        -- Parent Aadhar
    u.parent_occupation,                                    -- Parent occupation
    u.residential_address,                                  -- Student address
    u.designation_id,                                       -- Designation
    u.experience,                                           -- Experience
    u.subject,                                              -- Subject
    u.is_active,                                            -- Active status
    -- Placement eligibility data
    spe.is_eligible,                                        -- Is eligible for placement
    spe.eligibility_reasons,                                -- Why eligible/not eligible
    spe.profile_completion_percentage,                      -- Profile completion %
    spe.course_completion_status,                           -- Course completion status
    spe.exam_standards_met,                                 -- Exam standards met
    spe.attendance_percentage,                              -- Attendance percentage
    spe.fees_payment_status,                                -- Fees payment status
    spe.lab_test_cases_completed,                           -- Lab tests completed
    spe.assignments_completed,                              -- Assignments completed
    spe.is_placed,                                          -- Is placed
    spe.placement_date,                                     -- Placement date
    spe.placement_salary,                                   -- Placement salary
    spe.placement_company,                                  -- Placement company
    spe.is_pap_student,                                     -- Is PAP student
    spe.remaining_fee_amount,                               -- Remaining fee amount
    spe.google_review_status,                               -- Google review status
    spe.google_review_link,                                 -- Google review link
    spe.last_eligibility_check                              -- Last eligibility check
FROM users u
LEFT JOIN student_placement_eligibility spe ON u.id = spe.user_id
WHERE u.role_id = 6                                        -- Student role
AND u.is_active = 1
AND u.deleted_at IS NULL;

--  PLACEMENT STATISTICS VIEW (Reporting Data)
-- =====================================================
CREATE VIEW `placement_statistics_view` AS
SELECT 
    COUNT(*) as total_students,                            -- Total number of students
    SUM(CASE WHEN spe.is_placed = 1 THEN 1 ELSE 0 END) as placed_students,  -- Number of placed students
    SUM(CASE WHEN spe.is_eligible = 1 THEN 1 ELSE 0 END) as eligible_students,  -- Number of eligible students
    SUM(CASE WHEN spe.is_eligible = 0 THEN 1 ELSE 0 END) as not_eligible_students,  -- Number of not eligible students
    ROUND((SUM(CASE WHEN spe.is_placed = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as placement_rate  -- Placement rate percentage
FROM users u
LEFT JOIN student_placement_eligibility spe ON u.id = spe.user_id
WHERE u.role_id = 6                                        -- Student role
AND u.is_active = 1
AND u.deleted_at IS NULL;

ALTER TABLE job_postings
ADD COLUMN course_id BIGINT UNSIGNED NULL,
ADD CONSTRAINT fk_job_postings_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;