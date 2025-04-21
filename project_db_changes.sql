-- First, remove the columns we don't need anymore
ALTER TABLE projects
DROP COLUMN role,
DROP COLUMN team_size,
DROP COLUMN github_url;

-- Add project_files column to projects table and make technologies and project_type nullable
ALTER TABLE projects
ADD COLUMN project_files JSON NULL COMMENT 'Stores array of project files with name, path, size, and type',
MODIFY COLUMN technologies VARCHAR(255) NULL,
MODIFY COLUMN project_type VARCHAR(50) NULL;

-- Create a new table for project files
CREATE TABLE project_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT UNSIGNED,
    file_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 