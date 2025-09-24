<?php

namespace App\Services;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserService
{
    public function createStudent($data)
    {
        $password = bin2hex(random_bytes(6));
        $now = getCurrentTime();
        
        // Handle team assignment only if branchLocation is provided
        $team = null;
        if (!empty($data['branchLocation'])) {
            $team = Team::all()->select("id","slug")->where(function ($item) use($data){
                if(str_contains($item['slug'], strtolower($data['branchLocation']))){
                    return $item;
                }
            })->first();
        }

        $input = [
            'email' => $data['email'],
            'name'  => $data['name'],
            'phone' => $data['phone'],
            'zoho_crm_id' => $data['zohoCustomerId'] ?? null,
            'course_name' => $data['course_name'],
            'fees' => $data['fees'],
            'lead_id' => $data['lead_id'],
            'batch_name' => $data['batchName'],
            'password' => Hash::make($password),
            'role_id' => 6
        ];


        $user =  User::updateOrCreate(['email' => $data['email'],'phone'=>$data['phone']], $input);
        $dbName = config('database.connections.mysql.database');
        
        // Get batch ID from batch name
        $batch = \App\Models\Batch::where('name', $data['batchName'])->first();
        if (!$batch) {
            throw new \Exception('Batch not found with name: ' . $data['batchName']);
        }
        
        DB::statement("INSERT INTO ".$dbName.".batch_user (batch_id, user_id, created_at, updated_at) VALUES (".$batch->id.", ".$user->id.", NOW(), NOW())");
        
        // Only add team assignment if team was found
        if ($team) {
            $query = "INSERT INTO ".$dbName.".team_user (team_id, user_id, created_at, updated_at) VALUES (".$team['id'].", ".$user->id.", NOW(), NOW())";
            DB::statement($query);
        }
       
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
            'email_sent' => $response['success'] ?? false
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
}
