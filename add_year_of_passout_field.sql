-- Add year_of_passout field to student_education table
-- This field will be used for school education (10th and 12th class) instead of duration_from/duration_to

ALTER TABLE student_education 
ADD COLUMN year_of_passout VARCHAR(4) NULL AFTER duration_to;

-- Add an index for better performance when querying by year
CREATE INDEX idx_student_education_year_of_passout ON student_education(year_of_passout);

-- Optional: Add a comment to document the field purpose
ALTER TABLE student_education 
MODIFY COLUMN year_of_passout VARCHAR(4) NULL COMMENT 'Year of passout for school education (10th/12th class)';
