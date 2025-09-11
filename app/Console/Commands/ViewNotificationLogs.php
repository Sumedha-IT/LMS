<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ViewNotificationLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:logs {--lines=50 : Number of lines to show}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'View recent notification-related log entries';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $lines = $this->option('lines');
        $logPath = storage_path('logs/laravel.log');
        
        if (!File::exists($logPath)) {
            $this->error('Log file not found at: ' . $logPath);
            return;
        }

        $this->info("📋 Showing last {$lines} notification-related log entries:");
        $this->info("=" . str_repeat("=", 60));

        // Read the log file and filter for notification-related entries
        $logContent = File::get($logPath);
        $logLines = explode("\n", $logContent);
        
        // Filter for notification-related lines (with emojis we use)
        $notificationLines = array_filter($logLines, function($line) {
            return strpos($line, '🚀') !== false || 
                   strpos($line, '📊') !== false || 
                   strpos($line, '✅') !== false || 
                   strpos($line, '❌') !== false || 
                   strpos($line, '🔄') !== false || 
                   strpos($line, '📝') !== false || 
                   strpos($line, '🔍') !== false || 
                   strpos($line, '👥') !== false || 
                   strpos($line, '📚') !== false || 
                   strpos($line, '📋') !== false || 
                   strpos($line, '🎯') !== false || 
                   strpos($line, '⚠️') !== false || 
                   strpos($line, 'ℹ️') !== false || 
                   strpos($line, '🎉') !== false || 
                   strpos($line, '💥') !== false ||
                   strpos($line, 'JobNotification') !== false ||
                   strpos($line, 'sendJobCreatedNotification') !== false ||
                   strpos($line, 'sendJobStatusChangedNotification') !== false;
        });

        // Get the last N lines
        $recentLines = array_slice($notificationLines, -$lines);
        
        if (empty($recentLines)) {
            $this->warn('No notification-related log entries found.');
            $this->info('Try creating or updating a job posting to generate logs.');
            return;
        }

        foreach ($recentLines as $line) {
            // Color code based on log level
            if (strpos($line, 'ERROR') !== false || strpos($line, '❌') !== false || strpos($line, '💥') !== false) {
                $this->error($line);
            } elseif (strpos($line, 'WARNING') !== false || strpos($line, '⚠️') !== false) {
                $this->warn($line);
            } else {
                $this->line($line);
            }
        }

        $this->info("\n" . "=" . str_repeat("=", 60));
        $this->info("💡 Tip: Use 'tail -f storage/logs/laravel.log | grep -E \"(🚀|📊|✅|❌|🔄|📝|🔍|👥|📚|📋|🎯|⚠️|ℹ️|🎉|💥)\"' to monitor logs in real-time");
    }
}
