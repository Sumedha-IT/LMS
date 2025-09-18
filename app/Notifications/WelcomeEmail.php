<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Mailable;
use Carbon\Carbon;

class WelcomeEmail extends Notification implements ShouldQueue
{
    use Queueable;
    public $login_email;
    public $login_password;
    public $student_name;
    public $delay;

    /**
     * Create a new notification instance.
     */
    public function __construct($data)
    {
        $this->login_email = $data['login_email'];
        $this->login_password = $data['login_password'];
        $this->student_name = $data['student_name'] ?? 'Student';
        $this->delay = $data['delay'] ?? 1; // Delay in minutes, default is 0 (immediate)
    }

    /**
     * Get the delay for the notification.
     */
    public function delay($notifiable)
    {
        return Carbon::now()->addMinutes($this->delay);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
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
        return (new MailMessage)
                    ->subject('Welcome to SIT Placements Platform')
                    ->view('emailTemplates.sitWelcomeEmail', [
                        'student_name' => $this->student_name,
                        'login_email' => $this->login_email,
                        'login_password' => $this->login_password,
                        'login_url' => 'https://eduspark.sumedhait.com'
                    ])
                    ->salutation(''); // This removes the default "Regards, Laravel" footer
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
