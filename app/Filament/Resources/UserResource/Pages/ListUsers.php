<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Imports\UserImporter;
use App\Filament\Resources\UserResource;
use App\Models\Branch;
use App\Models\User;
use App\Notifications\WelcomeEmail;
use Filament\Actions;
use Filament\Facades\Filament;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected $tmp_pass;

    protected function getHeaderActions(): array
    {
        //dd(Filament::getTenant());

        return [
            Actions\Action::make('downloadTemplate')
                ->label('Download sample template')
                ->icon('heroicon-m-arrow-down-tray')
                ->url(route('user.import.template'))
                ->openUrlInNewTab(),
            Actions\CreateAction::make()
                ->mutateFormDataUsing(function (array $data) {
                    $this->tmp_pass = $data['password'];
                    $data['password'] = Hash::make($data['password']);
                    
                    // Set default placement center access for students and placement students
                    if (in_array($data['role_id'], [6, 11])) {
                        $data['placement_center_access'] = true;
                    }
                    
                    return $data;
                })
                ->after(function (User $record) {

                    // $branch = Branch::find(auth()->user()->team_id);

                    // Filament::getTenant()->
                    $record->teams()->attach(Filament::getTenant());

                    $email = $record->email;
                    $password = $this->tmp_pass;

                    //dd($email, $password);

                    $notification = new WelcomeEmail(['login_email' => $email, 'login_password' => $password]);
                    \Notification::route('mail', $email)->notify($notification);
                }),

            // Actions\CreateAction::make()
            //     ->label('Add Student')
            // ->mutateFormDataUsing(function (array $data) {
            //         $data['User']['name'] = 'ddd';
            //         $data['name'] = 'ddd';
            //         return $data;
            // })
            // ->beforeFormFilled(function (array $data) {
            //     $data['User']['name'] = 'ddd';
            //     $data['name'] = 'ddd';
            //     return $data;
            //     //dd($data);
            //     //r+eturn static::getModel()::create($data);
            // })
            // ->afterFormFilled(function (array $data) {
            //     //dd($data);
            //     //return static::getModel()::create($data);
            // })
            Actions\ImportAction::make()
                ->importer(UserImporter::class),
        ];
    }

    protected function getActions(): array
    {
        return [


            // Actions\CreateAction::make()
            //     ->url(fn(): string => UserResource::getUrl('create', [
            //         'role_id' => !empty(request('tableFilters')['role']['value']) ? request('tableFilters')['role']['value'] : 0])),

            // Actions\CreateAction::make()
            //     ->label('Add Student')
            //     ->url(fn(): string => UserResource::getUrl('create', [
            //         'role_id' => !empty(request('tableFilters')['role']['value']) ? request('tableFilters')['role']['value'] : 0])),
        ];
    }

    public function getTabs(): array
    {
        return [
            'Students & Placement Students' => ListRecords\Tab::make()->query(fn($query) => User::whereHas('teams')->whereIn('role_id', [6, 11])),
            'Others' => ListRecords\Tab::make()->query(fn($query) => User::whereNotIn('role_id', [6, 11])
//                ->whereHas('teams', function ($query) {
//                    $query->where('id', Filament::getTenant());
//                })
            ),
            //null => ListRecords\Tab::make('All')
        ];
    }
}
