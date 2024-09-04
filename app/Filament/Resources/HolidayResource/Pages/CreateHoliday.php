<?php

namespace App\Filament\Resources\HolidayResource\Pages;

use App\Filament\Resources\HolidayResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use App\Models\User;
use Filament\Notifications\Notification;


class CreateHoliday extends CreateRecord
{
    protected static string $resource = HolidayResource::class;
     protected function afterCreate(): void
    {
        $holiday = $this->record;

        // $users = User::where('team_id',$holiday->team_id)->get(); // You might want to adjust this to target specific users
        $users=User::all();

        foreach ($users as $user) {
            Notification::make()
                ->title("New Holiday Created")
                ->body("A new holiday '{$holiday->name}' has been created for {$holiday->date}.")
                ->success()
                ->sendToDatabase($user);
        }
    }
}
