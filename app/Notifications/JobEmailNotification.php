<?php

namespace App\Notifications;

use App\Models\JobPosting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobEmailNotification extends Notification
{
    use Queueable;
    
    public $jobPosting;
    public $type;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobPosting $jobPosting, string $type, string $oldStatus = null, string $newStatus = null)
    {
        $this->jobPosting = $jobPosting;
        $this->type = $type;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $companyName = is_object($this->jobPosting->company) ? $this->jobPosting->company->name : $this->jobPosting->company;
        
        if ($this->type === 'created') {
            return (new MailMessage)
                        ->greeting('Dear ' . $notifiable->name)
                        ->subject('New Job Opportunity - ' . $this->jobPosting->title)
                        ->line('We have a new job opportunity that matches your profile!')
                        ->line('Job Title: ' . $this->jobPosting->title)
                        ->line('Company: ' . $companyName)
                        ->line('Location: ' . ($this->jobPosting->location ?? 'Not specified'))
                        ->line('Job Type: ' . ($this->jobPosting->job_type ?? 'Not specified'))
                        ->action('View Job Details', url('/student-placement'))
                        ->line('Don\'t miss this opportunity! Apply now to advance your career.')
                        ->line('Thank you for being part of our placement program!');
        } else {
            return (new MailMessage)
                        ->greeting('Dear ' . $notifiable->name)
                        ->subject('Job Status Update - ' . $this->jobPosting->title)
                        ->line('There has been an update to a job you might be interested in.')
                        ->line('Job Title: ' . $this->jobPosting->title)
                        ->line('Company: ' . $companyName)
                        ->line('Status changed from: ' . ucfirst($this->oldStatus) . ' to: ' . ucfirst($this->newStatus))
                        ->action('View Job Details', url('/student-placement'))
                        ->line('Check the updated job details and apply if interested.')
                        ->line('Thank you for being part of our placement program!');
        }
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'job_id' => $this->jobPosting->id,
            'job_title' => $this->jobPosting->title,
            'company' => is_object($this->jobPosting->company) ? $this->jobPosting->company->name : $this->jobPosting->company,
            'type' => $this->type,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
        ];
    }
}
