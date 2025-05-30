-- Student Attendance Table
CREATE TABLE student_attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_class_id ON student_attendance(class_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);

-- Add a unique constraint to prevent duplicate attendance records
ALTER TABLE student_attendance
ADD CONSTRAINT unique_student_class_date UNIQUE (student_id, class_id, date); 