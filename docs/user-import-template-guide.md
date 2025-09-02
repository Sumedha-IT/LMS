# User Import Template Guide

## Overview
This guide explains how to use the user import template for bulk importing users into the LMS system. The template includes all the actual fields that exist in the users table.

## Template File
Download the template file: `public/templates/user_import_template.csv`

## Required Fields
These fields are mandatory and must be provided for each user:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `role` | Text | Role name (e.g., Student, Admin, Tutor) | Student |
| `name` | Text | Full name of the user | John Doe |
| `email` | Email | Unique email address | john.doe@example.com |
| `password` | Text | User's password | password123 |

## Optional Fields
These fields are optional and can be left empty:

| Field | Type | Description | Example | Notes |
|-------|------|-------------|---------|-------|
| `contact_number` | Text | Phone number | 9876543210 | |
| `gender` | Text | Gender | Male/Female | |
| `batch_name` | Text | Batch name to assign user to | Batch A | If provided, user will be automatically assigned to the specified EXISTING batch. Only use batch names that already exist in the system. |
| `zoho_crm_id` | Text | Zoho CRM ID | CRM001 | |

## Data Validation Rules

### Required Fields
- `role`: Required; matched by name (case-insensitive). If a number is provided, it's treated as ID.
- `name`: Maximum 255 characters
- `email`: Must be valid email format, maximum 255 characters, must be unique
- `password`: Maximum 255 characters

### Optional Fields
- `country_code`: Always set to +91 automatically (not required in CSV)
- `contact_number`: Max 255 characters
- `gender`: Max 255 characters
- `batch_name`: Max 255 characters, case-insensitive matching with existing batches
- `zoho_crm_id`: Max 255 characters

## Import Process

1. **Download Template**: Use the provided CSV template file
2. **Fill Data**: Add user data following the format and validation rules
3. **Save File**: Save as CSV format
4. **Upload**: Use the import functionality in the admin panel
5. **Review**: Check the import results for any errors

## Important Notes

- **Email Uniqueness**: Each email address must be unique in the system
- **Password Security**: Passwords will be hashed automatically
- **File Uploads**: File paths should be relative to the upload directory
- **JSON Fields**: `upload_marklist` and `subject` fields accept JSON data
- **Boolean Fields**: `feature_access` uses 1 for true, 0 for false
- **Date Format**: Use YYYY-MM-DD format for dates
- **Team Assignment**: Users will automatically be assigned to the current team
- **Batch Assignment**: If `batch_name` is provided, users will be automatically assigned to the specified EXISTING batch (case-insensitive matching). Only use batch names that already exist in the system.

## Common Issues

1. **Email Already Exists**: Ensure all email addresses are unique
2. **Invalid Date Format**: Use YYYY-MM-DD format for dates
3. **Invalid Integer Fields**: Ensure numeric fields contain only numbers
4. **Aadhaar Number**: Must be exactly 12 digits
5. **File Paths**: Ensure file paths are correct and files exist

## Support

If you encounter issues with the import process, please check:
1. File format (must be CSV)
2. Required fields are filled
3. Data validation rules are followed
4. File encoding (use UTF-8)
