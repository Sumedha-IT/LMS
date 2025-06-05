<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class IpVerificationService
{
    protected $allowedIps = [
        '103.41.98.114',
        '183.82.3.130',
        '122.175.11.103',
        '27.63.249.124 ',
        '127.0.0.1'  // Localhost IP
    ];

    /**
     * Verify if the current IP is allowed
     * 
     * @param string $context The context of verification (e.g., 'exam', 'attendance')
     * @return array Response array with status and message
     */
    public function verifyIp($context = 'general')
    {
        $incomingIp = request()->ip();

        if (!in_array($incomingIp, $this->allowedIps)) {
            Log::warning("IP address not matching allowed IP for {$context}", [
                'user_id' => auth()->id(),
                'incoming_ip' => $incomingIp,
                'allowed_ips' => $this->allowedIps,
                'context' => $context
            ]);

            return [
                'message' => "You must be connected to the campus WiFi network to {$context}",
                'status' => 403,
                'success' => false
            ];
        }

        return [
            'success' => true
        ];
    }

    /**
     * Get the list of allowed IPs
     * 
     * @return array
     */
    public function getAllowedIps()
    {
        return $this->allowedIps;
    }
} 