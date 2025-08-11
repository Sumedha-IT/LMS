-- Add exam marks column to users table (just total marks)
ALTER TABLE users 
ADD COLUMN exam_total_marks DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN exam_last_calculated_at TIMESTAMP NULL,
ADD COLUMN exam_last_attempt_id INT NULL;

-- Add index for better performance
CREATE INDEX idx_users_exam_total_marks ON users(exam_total_marks); 