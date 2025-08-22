-- Add eligibility criteria fields directly to job_postings table
ALTER TABLE `job_postings` 
ADD COLUMN `btech_year_of_passout_min` INT NULL AFTER `venue_link`,
ADD COLUMN `btech_year_of_passout_max` INT NULL AFTER `btech_year_of_passout_min`,
ADD COLUMN `mtech_year_of_passout_min` INT NULL AFTER `btech_year_of_passout_max`,
ADD COLUMN `mtech_year_of_passout_max` INT NULL AFTER `mtech_year_of_passout_min`,
ADD COLUMN `btech_percentage_min` DECIMAL(5,2) NULL AFTER `mtech_year_of_passout_max`,
ADD COLUMN `mtech_percentage_min` DECIMAL(5,2) NULL AFTER `btech_percentage_min`,
ADD COLUMN `skills_required` JSON NULL AFTER `mtech_percentage_min`,
ADD COLUMN `additional_criteria` TEXT NULL AFTER `skills_required`;
