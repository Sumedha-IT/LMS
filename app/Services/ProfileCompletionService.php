<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobProfile;
use App\Models\ProfileExperience;
use App\Models\Project;
use App\Models\Certification;
use App\Models\StudentEducation;

class ProfileCompletionService
{
    /**
     * Calculate overall profile completion percentage for a user
     *
     * @param User $user
     * @return array
     */
    public function calculateProfileCompletion(User $user): array
    {
        $sections = [
            'personal' => $this->calculatePersonalDetailsCompletion($user),
            'education' => $this->calculateEducationCompletion($user),
            'projects' => $this->calculateProjectsCompletion($user),
            'certifications' => $this->calculateCertificationsCompletion($user),
            'resume' => $this->calculateResumeCompletion($user),
        ];

        // Get detailed missing fields for each section
        $missingFields = [
            'personal' => $this->getPersonalDetailsMissingFields($user),
            'education' => $this->getEducationMissingFields($user),
            'projects' => $this->getProjectsMissingFields($user),
            'certifications' => $this->getCertificationsMissingFields($user),
            'resume' => $this->getResumeMissingFields($user),
        ];

        // Calculate weighted overall percentage
        $weights = [
            'personal' => 0.35,     // 35% weight for personal details
            'education' => 0.25,    // 25% weight for education
            'projects' => 0.20,     // 20% weight for projects
            'certifications' => 0.15, // 15% weight for certifications
            'resume' => 0.05,       // 5% weight for resume upload
        ];

        $overallPercentage = 0;
        foreach ($sections as $section => $percentage) {
            $overallPercentage += $percentage * $weights[$section];
        }

        return [
            'overall_percentage' => round($overallPercentage),
            'sections' => $sections,
            'weights' => $weights,
            'is_complete' => $overallPercentage >= 100, // 100% threshold for completion
            'missing_sections' => $this->getMissingSections($sections),
            'missing_fields' => $missingFields,
        ];
    }

    /**
     * Calculate personal details completion percentage
     *
     * @param User $user
     * @return int
     */
    private function calculatePersonalDetailsCompletion(User $user): int
    {
        // Only check essential mandatory fields
        $mandatoryFields = ['name', 'email', 'gender', 'birthday', 'address', 'city', 'state_id', 'pincode', 'aadhaar_number', 'passport_photo_path'];
        
        $completedFields = 0;
        
        foreach ($mandatoryFields as $field) {
            if (!empty($user->$field)) {
                $completedFields++;
            }
        }
        
        $totalFields = count($mandatoryFields);
        return $totalFields > 0 ? round(($completedFields / $totalFields) * 100) : 0;
    }

    /**
     * Calculate education completion percentage
     *
     * @param User $user
     * @return int
     */
    private function calculateEducationCompletion(User $user): int
    {
        // Check student education
        $studentEducation = $user->studentEducation()->count();
        
        // If user has any education records, check their completeness
        if ($studentEducation > 0) {
            // Check completeness of education records
            $completedEducation = 0;
            
            // Check student education completeness
            $studentEducationRecords = $user->studentEducation()->get();
            foreach ($studentEducationRecords as $edu) {
                if ($this->isEducationRecordComplete($edu)) {
                    $completedEducation++;
                }
            }
            
            return $studentEducation > 0 ? round(($completedEducation / $studentEducation) * 100) : 0;
        }
        
        return 0;
    }

    /**
     * Calculate projects completion percentage
     *
     * @param User $user
     * @return int
     */
    private function calculateProjectsCompletion(User $user): int
    {
        $projects = $user->projects()->count();
        
        if ($projects > 0) {
            $completedProjects = 0;
            $projectRecords = $user->projects()->get();
            
            foreach ($projectRecords as $project) {
                if ($this->isProjectRecordComplete($project)) {
                    $completedProjects++;
                }
            }
            
            return round(($completedProjects / $projects) * 100);
        }
        
        return 0;
    }

    /**
     * Calculate certifications completion percentage
     *
     * @param User $user
     * @return int
     */
    private function calculateCertificationsCompletion(User $user): int
    {
        try {
            $certifications = $user->certifications()->count();
            // If user has any certifications, consider it complete
            return $certifications > 0 ? 100 : 0;
        } catch (\Exception $e) {
            // If certifications table doesn't exist, consider it optional and return 100%
            return 100;
        }
    }

    /**
     * Calculate resume completion percentage
     *
     * @param User $user
     * @return int
     */
    private function calculateResumeCompletion(User $user): int
    {
        // Check if user has uploaded a resume
        $hasResume = !empty($user->upload_resume);
        
        return $hasResume ? 100 : 0;
    }

    /**
     * Check if an education record is complete
     *
     * @param StudentEducation $education
     * @return bool
     */
    private function isEducationRecordComplete($education): bool
    {
        $requiredFields = ['degree_type_id', 'institute_name', 'percentage_cgpa'];
        
        foreach ($requiredFields as $field) {
            if (empty($education->$field)) {
                return false;
            }
        }
        
        // Check if either duration fields or year_of_passout is filled
        $hasDuration = (!empty($education->duration_from) && !empty($education->duration_to)) || !empty($education->year_of_passout);
        
        return $hasDuration;
    }



    /**
     * Check if a project record is complete
     *
     * @param Project $project
     * @return bool
     */
    private function isProjectRecordComplete($project): bool
    {
        $requiredFields = ['title', 'description', 'start_date', 'technologies'];
        
        foreach ($requiredFields as $field) {
            if (empty($project->$field)) {
                return false;
            }
        }
        
        return true;
    }



    /**
     * Get missing sections that need to be completed
     *
     * @param array $sections
     * @return array
     */
    private function getMissingSections(array $sections): array
    {
        $missing = [];
        
        // Only show sections that are significantly incomplete (less than 80%)
        if ($sections['personal'] < 80) {
            $missing[] = 'Personal Details';
        }
        
        if ($sections['education'] < 80) {
            $missing[] = 'Education';
        }
        
        if ($sections['projects'] < 80) {
            $missing[] = 'Projects';
        }
        
        // Don't show certifications as missing if table doesn't exist
        if ($sections['certifications'] < 80 && $sections['certifications'] > 0) {
            $missing[] = 'Certifications';
        }
        
        // Resume is always required for job applications, so always show as missing if not uploaded
        if ($sections['resume'] < 100) {
            $missing[] = 'Resume Upload';
        }
        
        return $missing;
    }

    /**
     * Check if user can apply for placements
     *
     * @param User $user
     * @return array
     */
    public function canApplyForPlacements(User $user): array
    {
        $completion = $this->calculateProfileCompletion($user);
        
        // Check if resume is uploaded - this is mandatory for job applications
        $hasResume = !empty($user->upload_resume);
        
        if (!$hasResume) {
            // Ensure Resume Upload is in missing sections if not already there
            $missingSections = $completion['missing_sections'];
            if (!in_array('Resume Upload', $missingSections)) {
                $missingSections[] = 'Resume Upload';
            }
            
            return [
                'can_apply' => false,
                'completion_percentage' => $completion['overall_percentage'],
                'missing_sections' => $missingSections,
                'message' => 'Resume is required to apply for jobs. Please upload your resume first.'
            ];
        }
        
        return [
            'can_apply' => $completion['is_complete'],
            'completion_percentage' => $completion['overall_percentage'],
            'missing_sections' => $completion['missing_sections'],
            'missing_fields' => $completion['missing_fields'],
            'message' => $completion['is_complete'] 
                ? 'Profile is complete. You can apply for placements.'
                : 'Profile completion must be 100%. Please complete the following sections: ' . implode(', ', $completion['missing_sections'])
        ];
    }

    /**
     * Get missing personal details fields
     *
     * @param User $user
     * @return array
     */
    private function getPersonalDetailsMissingFields(User $user): array
    {
        $mandatoryFields = [
            'name' => 'Full Name',
            'email' => 'Email Address',
            'gender' => 'Gender',
            'birthday' => 'Date of Birth',
            'address' => 'Address',
            'city' => 'City',
            'state_id' => 'State',
            'pincode' => 'Pincode',
            'aadhaar_number' => 'Aadhaar Number',
            'passport_photo_path' => 'Passport Photo'
        ];
        
        $missing = [];
        foreach ($mandatoryFields as $field => $label) {
            if (empty($user->$field)) {
                $missing[] = $label;
            }
        }
        
        return $missing;
    }

    /**
     * Get missing education fields
     *
     * @param User $user
     * @return array
     */
    private function getEducationMissingFields(User $user): array
    {
        $missing = [];
        $studentEducation = $user->studentEducation()->get();
        
        if ($studentEducation->isEmpty()) {
            $missing[] = 'At least one education record is required';
        } else {
            foreach ($studentEducation as $index => $edu) {
                $recordMissing = [];
                
                if (empty($edu->degree_type_id)) {
                    $recordMissing[] = 'Degree Type';
                }
                if (empty($edu->institute_name)) {
                    $recordMissing[] = 'Institute Name';
                }
                if (empty($edu->percentage_cgpa)) {
                    $recordMissing[] = 'Percentage/CGPA';
                }
                
                $hasDuration = (!empty($edu->duration_from) && !empty($edu->duration_to)) || !empty($edu->year_of_passout);
                if (!$hasDuration) {
                    $recordMissing[] = 'Duration or Year of Passout';
                }
                
                if (!empty($recordMissing)) {
                    $missing[] = 'Education Record ' . ($index + 1) . ': ' . implode(', ', $recordMissing);
                }
            }
        }
        
        return $missing;
    }

    /**
     * Get missing projects fields
     *
     * @param User $user
     * @return array
     */
    private function getProjectsMissingFields(User $user): array
    {
        $missing = [];
        $projects = $user->projects()->get();
        
        if ($projects->isEmpty()) {
            $missing[] = 'At least one project is required';
        } else {
            foreach ($projects as $index => $project) {
                $recordMissing = [];
                
                if (empty($project->title)) {
                    $recordMissing[] = 'Title';
                }
                if (empty($project->description)) {
                    $recordMissing[] = 'Description';
                }
                if (empty($project->start_date)) {
                    $recordMissing[] = 'Start Date';
                }
                if (empty($project->technologies)) {
                    $recordMissing[] = 'Technologies';
                }
                
                if (!empty($recordMissing)) {
                    $missing[] = 'Project ' . ($index + 1) . ': ' . implode(', ', $recordMissing);
                }
            }
        }
        
        return $missing;
    }

    /**
     * Get missing certifications fields
     *
     * @param User $user
     * @return array
     */
    private function getCertificationsMissingFields(User $user): array
    {
        try {
            $certifications = $user->certifications()->count();
            if ($certifications === 0) {
                return ['At least one certification is recommended'];
            }
        } catch (\Exception $e) {
            // If certifications table doesn't exist, consider it optional
            return [];
        }
        
        return [];
    }

    /**
     * Get missing resume fields
     *
     * @param User $user
     * @return array
     */
    private function getResumeMissingFields(User $user): array
    {
        $missing = [];
        
        if (empty($user->upload_resume)) {
            $missing[] = 'Resume document upload is required';
        }
        
        return $missing;
    }
}
