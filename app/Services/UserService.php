<?php

namespace App\Services;

use App\Models\Team;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserService
{
    public function createStudent($data)
    {
        // Use custom password if provided, otherwise generate random one
        $password = !empty($data['password']) ? $data['password'] : bin2hex(random_bytes(6));
        
        // Handle team assignment - branchLocation is now required
        $team = Team::where('name', $data['branchLocation'])->first();
        if (!$team) {
            throw new \Exception('Team not found with name: ' . $data['branchLocation']);
        }

        $input = [
            'email' => $data['email'],
            'name'  => $data['name'],
            'phone' => $data['phone'],
            'zoho_crm_id' => $data['zohoCustomerId'] ?? null,
            'course_name' => $data['course_name'],
            'fees' => $data['fees'],
            'no_of_installments' => $data['no_of_installments'],
            'program' => $data['program'],
            'lead_id' => $data['lead_id'],
            'batch_name' => $data['batchName'],
            'password' => Hash::make($password),
            'role_id' => 6,
            'is_active' => 1, // Set user as active
            'feature_access' => 1, // Enable feature access
            'receive_email_notification' => true,
            'receive_sms_notification' => true
        ];


        // Use updateOrCreate with email only to avoid conflicts
        $user = User::updateOrCreate(
            ['email' => $data['email']], 
            $input
        );
        
        // Log the user creation for debugging
        \Log::info('User created/updated:', [
            'user_id' => $user->id,
            'email' => $user->email,
            'has_password' => !empty($user->password),
            'password_length' => strlen($user->password ?? ''),
            'role_id' => $user->role_id,
            'is_active' => $user->is_active,
            'feature_access' => $user->feature_access,
            'is_student' => $user->is_student,
            'teams_count' => $user->teams()->count()
        ]);
        $dbName = config('database.connections.mysql.database');
        
        // Get batch ID from batch name
        $batch = \App\Models\Batch::where('name', $data['batchName'])->first();
        if (!$batch) {
            throw new \Exception('Batch not found with name: ' . $data['batchName']);
        }
        
        DB::statement("INSERT INTO ".$dbName.".batch_user (batch_id, user_id, created_at, updated_at) VALUES (".$batch->id.", ".$user->id.", NOW(), NOW())");
        
        // Assign user to team (team is now guaranteed to exist)
        $query = "INSERT INTO ".$dbName.".team_user (team_id, user_id, created_at, updated_at) VALUES (".$team->id.", ".$user->id.", NOW(), NOW())";
        DB::statement($query);
        
        \Log::info('User assigned to team', [
            'user_id' => $user->id,
            'team_id' => $team->id,
            'team_name' => $team->name,
            'branch_location' => $data['branchLocation']
        ]);

        // Create payment record
        $this->createPaymentRecord($user, $data);
       
        // Try to send email, but don't fail user creation if email fails
        try {
            $response = $this->sendUserCredentisalseViaMail($input['email'], $password);
        } catch (\Exception $e) {
            // Log the email error but don't fail user creation
            \Log::error('Failed to send login credentials email: ' . $e->getMessage());
            $response = ['success' => false, 'error' => 'Email sending failed: ' . $e->getMessage()];
        }
        
        return [
            'user' => $user,
            'password' => $password, // Return password in response for manual sharing
            'email_sent' => $response['success'] ?? false,
            'login_credentials' => [
                'email' => $user->email,
                'password' => $password,
                'message' => 'Save these credentials - password will not be shown again'
            ]
        ];
    }

    public function sendUserCredentisalseViaMail($email, $password)
    {
        $user['to'] = $email;

        Mail::send('emailTemplates.loginCredential', ['password' => $password, 'email' => $email,'supportMail' => config('services.app.supportMail')], function ($message) use ($user) {
            $message->from(config('mail.from.address'), config('mail.from.name'));
            $message->to($user['to']);
            $message->subject("Sumedha User Login Credentials");
        });
        return ['success' => true];
     
    }

    /**
     * Reset password for existing user who can't login
     */
    public function resetUserPassword($email)
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $newPassword = bin2hex(random_bytes(6));
        $user->password = Hash::make($newPassword);
        $user->save();

        // Try to send email
        try {
            $this->sendUserCredentisalseViaMail($user->email, $newPassword);
            $emailSent = true;
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
            $emailSent = false;
        }

        return [
            'success' => true,
            'user' => $user,
            'new_password' => $newPassword,
            'email_sent' => $emailSent,
            'message' => 'Password reset successfully'
        ];
    }

    /**
     * Create payment record for user
     */
    private function createPaymentRecord($user, $data)
    {
        $program = $data['program'];
        $noOfInstallments = $data['no_of_installments'];
        
        // Get program fee from Payment model
        $totalFee = Payment::getProgramFee($program);
        
        // Calculate installment amount
        $installmentAmount = $noOfInstallments > 0 ? $totalFee / $noOfInstallments : $totalFee;
        
        // Create payment record
        Payment::create([
            'user_id' => $user->id,
            'lead_id' => $data['lead_id'],
            'program' => $program,
            'total_fee' => $totalFee,
            'no_of_installments' => $noOfInstallments,
            'installment_amount' => round($installmentAmount, 2),
            'paid_amount' => 0,
            'remaining_amount' => $totalFee,
            'status' => 'pending',
            'installment_details' => []
        ]);

        \Log::info('Payment record created for user', [
            'user_id' => $user->id,
            'lead_id' => $data['lead_id'],
            'program' => $program,
            'total_fee' => $totalFee,
            'installments' => $noOfInstallments,
            'installment_amount' => round($installmentAmount, 2)
        ]);
    }
}
