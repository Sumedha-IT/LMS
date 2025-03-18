<?php

namespace App\Filament\Pages\Auth;

use Filament\Pages\Page;
use Filament\Pages\Auth\Login as BaseLogin;
use Filament\Forms\Form;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;

class loginForm extends BaseLogin
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getRememberFormComponent(),
            ])
            ->statePath('data');
    }

    public function authenticate(): ?LoginResponse
    {
        // Get the form data
        $data = $this->form->getState();
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];
        $remember = $data['remember'] ?? false;

        // Attempt authentication
        if (!auth()->attempt($credentials, $remember)) {
            $this->throwFailureValidationException();
        }

        // Get the authenticated user and generate token
        $user = auth()->user();
        $bearerToken = $user->createToken('filament-auth-token')->plainTextToken;

        // Store the token in a cookie without encryption
        // Cookie::queue('bearer_token', $bearerToken, 60, null, null, true, true);
        Cookie::queue(cookie('bearer_token', $bearerToken, 60, null, null, true, true, false));

        // Cookie::queue('bearer_token', $bearerToken, 60, null, null, true, false); // HttpOnly false // 60 minutes, secure, HttpOnly

        // Regenerate session
        session()->regenerate();

        // Redirect to dashboard
        return app(LoginResponse::class);
    }

    protected function throwFailureValidationException(): never
    {
        throw ValidationException::withMessages([
            'data.email' => __('filament-panels::pages/auth/login.messages.failed'),
        ]);
    }
}
