-- View exam marks for all users (after running the ALTER TABLE query)
SELECT 
    id,
    name,
    email,
    exam_total_marks,
    exam_last_calculated_at,
    exam_last_attempt_id
FROM users 
WHERE exam_total_marks IS NOT NULL
ORDER BY exam_total_marks DESC;

-- View only students with exam marks
SELECT 
    id,
    name,
    email,
    exam_total_marks,
    exam_last_calculated_at
FROM users 
WHERE role_id = 6 
AND exam_total_marks IS NOT NULL
ORDER BY exam_total_marks DESC;

-- View students with negative exam marks
SELECT 
    id,
    name,
    email,
    exam_total_marks,
    exam_last_calculated_at
FROM users 
WHERE role_id = 6 
AND exam_total_marks < 0
ORDER BY exam_total_marks ASC;

-- View students with positive exam marks
SELECT 
    id,
    name,
    email,
    exam_total_marks,
    exam_last_calculated_at
FROM users 
WHERE role_id = 6 
AND exam_total_marks > 0
ORDER BY exam_total_marks DESC;

-- Count summary of exam marks
SELECT 
    COUNT(*) as total_students,
    COUNT(CASE WHEN exam_total_marks IS NOT NULL THEN 1 END) as students_with_marks,
    COUNT(CASE WHEN exam_total_marks > 0 THEN 1 END) as students_with_positive_marks,
    COUNT(CASE WHEN exam_total_marks < 0 THEN 1 END) as students_with_negative_marks,
    COUNT(CASE WHEN exam_total_marks = 0 THEN 1 END) as students_with_zero_marks,
    AVG(exam_total_marks) as average_marks
FROM users 
WHERE role_id = 6; 