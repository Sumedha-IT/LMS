<?php

namespace App\Filament\Resources\PaymentDetailsResource\Pages;

use App\Filament\Resources\PaymentDetailsResource;
use Filament\Resources\Pages\Page;
use Illuminate\Support\Facades\Auth;

class MyPayments extends Page
{
    protected static string $resource = PaymentDetailsResource::class;

    protected static string $view = 'filament.resources.payment-details-resource.pages.my-payments';
    publiC $disableInteraction ;


    public function mount()
    {   
        $user = Auth::user();
        $this->disableInteraction = empty($user) ? false : ($user->feature_access == true ? false : true);
    }

}
