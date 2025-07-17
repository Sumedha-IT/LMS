<?php

namespace App\Providers;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Resources\Resource;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Filament\Pages\Dashboard;
use Filament\Navigation\MenuItem;
use Filament\Facades\Filament;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DatePicker::configureUsing(function (DatePicker $datePicker) {
            $datePicker->native(false)
                ->displayFormat('d/m/Y')
                ->format('d/m/Y')
                ->firstDayOfWeek(1)
                ->closeOnDateSelection(true);
        });
        DateTimePicker::configureUsing(function (DateTimePicker $datePicker) {
            $datePicker->native(false)
                ->displayFormat('d/m/Y H:i')
                ->format('d/m/Y H:i')
                ->firstDayOfWeek(1)
                ->closeOnDateSelection(true);
        });
        Filament::serving(function () {
            Filament::registerUserMenuItems([
                'account' => MenuItem::make()
                    ->label(fn () => auth()->user()->name) // Displays the user's name (e.g., "gurmeet")
                    ->url('/profile') // Redirect to your React profile page
                    ->icon('heroicon-o-user'), // Optional: Add an icon
            ]);
        });


        /*DatePicker::configureUsing(fn () => DatePicker::$defaultDateDisplayFormat = __('d/m/Y'));
        DateTimePicker::configureUsing(fn () => DateTimePicker::$defaultDateDisplayFormat = __('d/m/Y'));
        DateTimePicker::configureUsing(fn () => DateTimePicker::$defaultDateTimeDisplayFormat = __('d/m/Y H:i'));*/


        //Resource::scopeToTenant(false);

        // Custom URL generation logic for password reset links
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return url()->signedRoute('filament.administrator.auth.password-reset.reset', ['email' => $user->getEmailForPasswordReset(), 'token' => $token]);
        });
    }
}
