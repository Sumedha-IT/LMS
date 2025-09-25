-- Payment System SQL Queries
-- Created for LMS Payment Management System

-- 1. Create payments table
CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `lead_id` varchar(255) NOT NULL,
  `program` varchar(255) NOT NULL,
  `total_fee` decimal(10,2) NOT NULL,
  `no_of_installments` int NOT NULL,
  `installment_amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  `remaining_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','partial','completed') DEFAULT 'pending',
  `installment_details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_id_foreign` (`user_id`),
  KEY `payments_user_id_lead_id_index` (`user_id`,`lead_id`),
  KEY `payments_program_index` (`program`),
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Program Fee Configuration (Stored in .env file)
-- PROGRAM_FEE_RISE=126000
-- PROGRAM_FEE_STEP=99000
-- PROGRAM_FEE_PAP=0
-- PROGRAM_FEE_CEP_STEP=99000
-- PROGRAM_FEE_CD_50_50=0
-- 
-- To change fees, update the .env file and restart the application

-- 3. Sample Payment Record Creation
INSERT INTO `payments` (
    `user_id`, 
    `lead_id`, 
    `program`, 
    `total_fee`, 
    `no_of_installments`, 
    `installment_amount`, 
    `paid_amount`, 
    `remaining_amount`, 
    `status`, 
    `installment_details`, 
    `created_at`, 
    `updated_at`
) VALUES (
    1, 
    'LEAD001', 
    'RISE', 
    126000.00, 
    6, 
    21000.00, 
    0.00, 
    126000.00, 
    'pending', 
    '[]', 
    NOW(), 
    NOW()
);

-- 4. Query to get user payment details
SELECT 
    p.*,
    u.name as user_name,
    u.email as user_email,
    u.phone as user_phone
FROM payments p
JOIN users u ON p.user_id = u.id
WHERE p.user_id = ?;

-- 5. Query to get payment statistics by program
SELECT 
    program,
    COUNT(*) as total_students,
    SUM(total_fee) as total_revenue,
    SUM(paid_amount) as total_collected,
    SUM(remaining_amount) as total_outstanding,
    AVG(installment_amount) as avg_installment_amount
FROM payments
GROUP BY program;

-- 6. Query to get overdue payments (if you add due_date field later)
-- SELECT 
--     p.*,
--     u.name,
--     u.email,
--     u.phone
-- FROM payments p
-- JOIN users u ON p.user_id = u.id
-- WHERE p.status IN ('pending', 'partial')
-- AND p.due_date < CURDATE();

-- 7. Query to update payment after installment
UPDATE payments 
SET 
    paid_amount = paid_amount + ?,
    remaining_amount = total_fee - (paid_amount + ?),
    status = CASE 
        WHEN (total_fee - (paid_amount + ?)) <= 0 THEN 'completed'
        ELSE 'partial'
    END,
    installment_details = JSON_ARRAY_APPEND(
        COALESCE(installment_details, '[]'), 
        '$', 
        JSON_OBJECT(
            'amount', ?,
            'payment_method', ?,
            'transaction_id', ?,
            'notes', ?,
            'paid_at', NOW()
        )
    ),
    updated_at = NOW()
WHERE id = ?;

-- 8. Query to get installment history for a user
SELECT 
    p.id as payment_id,
    p.program,
    p.total_fee,
    p.no_of_installments,
    p.installment_amount,
    p.paid_amount,
    p.remaining_amount,
    p.status,
    JSON_EXTRACT(p.installment_details, '$') as installment_history
FROM payments p
WHERE p.user_id = ?;

-- 9. Query to get payment summary for dashboard
SELECT 
    COUNT(*) as total_payments,
    SUM(total_fee) as total_fees,
    SUM(paid_amount) as total_collected,
    SUM(remaining_amount) as total_outstanding,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN status = 'partial' THEN 1 END) as partial_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments
FROM payments;

-- 10. Query to get program-wise payment breakdown
SELECT 
    program,
    COUNT(*) as student_count,
    ROUND(SUM(total_fee), 2) as total_program_fee,
    ROUND(SUM(paid_amount), 2) as total_collected,
    ROUND(SUM(remaining_amount), 2) as total_outstanding,
    ROUND(AVG(installment_amount), 2) as avg_installment,
    ROUND((SUM(paid_amount) / SUM(total_fee)) * 100, 2) as collection_percentage
FROM payments
GROUP BY program
ORDER BY total_program_fee DESC;
