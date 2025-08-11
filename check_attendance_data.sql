-- Check if there are any attendance records
SELECT COUNT(*) as total_attendance_records FROM student_attendances;

-- Check attendance records for a specific student (replace 76 with actual student ID)
SELECT 
    id,
    user_id,
    status,
    check_in_datetime,
    check_out_datetime,
    created_at
FROM student_attendances 
WHERE user_id = 76
ORDER BY check_in_datetime DESC;

-- Check all students with attendance records
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(sa.id) as attendance_count,
    COUNT(CASE WHEN sa.status = 'Present' THEN 1 END) as present_count,
    COUNT(CASE WHEN sa.status = 'Absent' THEN 1 END) as absent_count,
    COUNT(CASE WHEN sa.status = 'Late' THEN 1 END) as late_count
FROM users u
LEFT JOIN student_attendances sa ON u.id = sa.user_id
WHERE u.role_id = 6
GROUP BY u.id, u.name, u.email
HAVING attendance_count > 0
ORDER BY attendance_count DESC;

-- Check attendance table structure
DESCRIBE student_attendances; 