<?php

namespace App\Providers\Filament;

use Filament\Pages;
use Filament\Panel;
use App\Models\Team;
use Filament\Widgets;
use Filament\PanelProvider;
use App\Filament\Pages\Dashboard;
use Filament\Navigation\MenuItem;
use Filament\Support\Colors\Color;
use App\Livewire\CustomPersonalInfo;
use Filament\Support\Enums\MaxWidth;
use App\Filament\Pages\Auth\loginForm;
use App\Livewire\MyCustomPersonalInfo;
use App\Http\Middleware\ApplyTenantScopes;
use Filament\Http\Middleware\Authenticate;
use Jeffgreco13\FilamentBreezy\BreezyCore;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Cookie\Middleware\EncryptCookies;
use App\Filament\Pages\Auth\Tenancy\EditTeamProfile;
use Hydrat\TableLayoutToggle\TableLayoutTogglePlugin;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Saade\FilamentFullCalendar\FilamentFullCalendarPlugin;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use App\Filament\Pages\MyProfilePage; // Added for React integration

class AdministratorPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->viteTheme('resources/css/filament/administrator/theme.css')
            ->id('administrator')
            ->path('administrator')
            ->login()
            ->passwordReset()
            ->sidebarCollapsibleOnDesktop()
            ->databaseNotifications()
            ->font('Poppins')
            ->plugins([
                FilamentFullCalendarPlugin::make(),
                TableLayoutTogglePlugin::make()
                    ->setDefaultLayout('grid')
                    ->persistLayoutInLocalStorage(true)
                    ->shareLayoutBetweenPages(false)
                    ->displayToggleAction()
                    ->listLayoutButtonIcon('heroicon-o-list-bullet')
                    ->gridLayoutButtonIcon('heroicon-o-squares-2x2'),
                \BezhanSalleh\FilamentShield\FilamentShieldPlugin::make(),
                BreezyCore::make()
                    ->myProfile(
                        shouldRegisterUserMenu: true,
                        shouldRegisterNavigation: false, // Set to false since we'll use a custom page
                        navigationGroup: 'Settings',
                        hasAvatars: true,
                        slug: 'my-profile-breezy' // Changed to avoid conflict with custom page
                    )
                    ->avatarUploadComponent(fn($fileUpload) => $fileUpload->disableLabel())
                    ->myProfileComponents([
                        'personal_info' => MyCustomPersonalInfo::class,
                    ])
                    ->enableTwoFactorAuthentication(
                        force: false,
                    )
            ])
            ->colors([
                'primary' => Color::Orange,
                'secondary' => Color::Blue,
            ])
            ->brandLogo(asset('images/sumedha.png'))
            ->brandLogoHeight('3rem')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
                MyProfilePage::class, // Added for React-based My Profile
            ])
            ->discoverClusters(in: app_path('Filament/Clusters'), for: 'App\\Filament\\Clusters')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                //Widgets\AccountWidget::class,
                //Widgets\FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->maxContentWidth(MaxWidth::Full)
            ->authMiddleware([
                Authenticate::class,
            ])
            ->tenant(Team::class);
    }
}