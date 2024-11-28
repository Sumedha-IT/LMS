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
        $team = Team::all()->select("id","slug")->where(function ($item) use($data){
            if(str_contains($item['slug'], strtolower($data['branchLocation']))){
                return $item;
            }
        })->first();

        $input = [
            'email' => $data['email'],
            'name'  => $data['name'],
            'phone' => $data['phone'],
            'zoho_crm_id' => $data['zohoCustomerId'],
            'password' => Hash::make($password),
            'role_id' => 6
        ];


        $user =  User::updateOrCreate(['email' => $data['email'],'phone'=>$data['phone']], $input);
        $dbName = config('database.connections.mysql.database');
        DB::statement("INSERT INTO ".$dbName.".batch_user (batch_id, user_id, created_at, updated_at) VALUES (".$data['batchId'].", ".$user->id.", NOW(), NOW())");
        $query = "INSERT INTO ".$dbName.".team_user (team_id, user_id, created_at, updated_at) VALUES (".$team['id'].", ".$user->id.", NOW(), NOW())";
        DB::statement($query);
       
        // $response = $this->sendUserCredentisalseViaMail($input['email'], $password);
        return ['user' => $user];
    }

    public function sendUserCredentisalseViaMail($email, $password)
    {
        $user['to'] = $email;

        Mail::send('emailTemplates.loginCredential', ['password' => $password, 'email' => $email,'supportMail' => config('services.app.supportMail')], function ($message) use ($user) {
            $message->to($user['to']);
            $message->subject("Sumedha User Login Credentials");
        });
        return ['success' => true];
     
    }
}
