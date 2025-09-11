<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\JobPosting;

class JobNotification extends Notification
{
    use Queueable;

    public $jobPosting;
    public $type; // 'created' or 'status_changed'
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
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        if ($this->type === 'created') {
            return (new MailMessage)
                        ->greeting('New Job Opportunity!')
                        ->line('A new job posting has been created that matches your course.')
                        ->line('Job Title: ' . $this->jobPosting->title)
                        ->line('Company: ' . $this->jobPosting->company->name)
                        ->line('Location: ' . $this->jobPosting->location)
                        ->action('View Job Details', url('/administrator/job-boards'))
                        ->line('Thank you for using our application!');
        } else {
            return (new MailMessage)
                        ->greeting('Job Status Update')
                        ->line('A job posting status has been updated.')
                        ->line('Job Title: ' . $this->jobPosting->title)
                        ->line('Company: ' . $this->jobPosting->company->name)
                        ->line('Status changed from: ' . $this->oldStatus . ' to: ' . $this->newStatus)
                        ->action('View Job Details', url('/administrator/job-boards'))
                        ->line('Thank you for using our application!');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        if ($this->type === 'created') {
            return [
                'title' => 'New Job Opportunity Available!',
                'body' => "A new job posting '{$this->jobPosting->title}' has been created by {$this->jobPosting->company->name} for your course.",
                'job_posting_id' => $this->jobPosting->id,
                'company_name' => $this->jobPosting->company->name,
                'job_title' => $this->jobPosting->title,
                'location' => $this->jobPosting->location,
                'type' => 'job_created',
                'action_url' => '/administrator/job-boards'
            ];
        } else {
            return [
                'title' => 'Job Status Updated',
                'body' => "Job posting '{$this->jobPosting->title}' status has been changed from '{$this->oldStatus}' to '{$this->newStatus}'.",
                'job_posting_id' => $this->jobPosting->id,
                'company_name' => $this->jobPosting->company->name,
                'job_title' => $this->jobPosting->title,
                'old_status' => $this->oldStatus,
                'new_status' => $this->newStatus,
                'type' => 'job_status_changed',
                'action_url' => '/administrator/job-boards'
            ];
        }
    }
}
