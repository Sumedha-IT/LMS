-- Fix duration columns to be nullable for school education
-- This allows null values for duration_from and duration_to when using year_of_passout for school education

ALTER TABLE student_education 
MODIFY COLUMN duration_from VARCHAR(255) NULL;

ALTER TABLE student_education 
MODIFY COLUMN duration_to VARCHAR(255) NULL;

-- Add comments to document the purpose
ALTER TABLE student_education 
MODIFY COLUMN duration_from VARCHAR(255) NULL COMMENT 'Duration from date (null for school education using year_of_passout)';

ALTER TABLE student_education 
MODIFY COLUMN duration_to VARCHAR(255) NULL COMMENT 'Duration to date (null for school education using year_of_passout)';
