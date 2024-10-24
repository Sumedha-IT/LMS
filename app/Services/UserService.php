<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserService
{
    public function createStudent($data)
    {
        $password = bin2hex(random_bytes(6));
        $input = [
            'email' => $data['email'],
            'name'  => $data['name'],
            'phone' => $data['phone'],
            'zoho_crm_id' => $data['zohoCustomerId'],
            'password' => Hash::make($password),
            'role_id' => 6
        ];


        $user =  User::updateOrCreate(['email' => $data['email'],'phone'=>$data['phone']], $input);
        $response = $this->sendUserCredentisalseViaMail($input['email'], $password);
        return ['user' => $user];
    }

    public function sendUserCredentisalseViaMail($email, $password)
    {
        $user['to'] = $email;


        Mail::send('emailTemplates.loginCredential', ['password' => $password, 'email' => $email], function ($message) use ($user) {
            $message->to($user['to']);
            $message->subject("Sumedha User Login Credentials");
        });
        return ['success' => true];
     
    }
}
