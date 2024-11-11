<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use App\Models\ZohoInvoice;
use Illuminate\Console\Command;

class FeaturDisableCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feature-disable-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
  
        $today = date('Y-m-d');
        $studentRoleId = Role::where('name', 'Student')->first()->id;

        $userIds= ZohoInvoice::whereDate('due_date', '>=', $today)->where('status', '!=', 'paid')
            ->pluck('user_id')
            ->toArray();

        User::where('role_id', $studentRoleId)->whereIn('id', $userIds)->update(['feature_access' => 0]);
    }
}
