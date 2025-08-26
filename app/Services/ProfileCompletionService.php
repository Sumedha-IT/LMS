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
            'is_complete' => $overallPercentage >= 90, // 90% threshold for completion
            'missing_sections' => $this->getMissingSections($sections),
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
        
        if ($sections['resume'] < 80) {
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
        
        return [
            'can_apply' => $completion['is_complete'],
            'completion_percentage' => $completion['overall_percentage'],
            'missing_sections' => $completion['missing_sections'],
            'message' => $completion['is_complete'] 
                ? 'Profile is complete. You can apply for placements.'
                : 'Profile completion must be at least 90%. Please complete the following sections: ' . implode(', ', $completion['missing_sections'])
        ];
    }
}
