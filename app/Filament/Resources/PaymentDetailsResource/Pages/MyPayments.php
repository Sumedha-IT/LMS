<?php

namespace App\Filament\Resources\PaymentDetailsResource\Pages;

use App\Filament\Resources\PaymentDetailsResource;
use Filament\Resources\Pages\Page;

class MyPayments extends Page
{
    protected static string $resource = PaymentDetailsResource::class;

    protected static string $view = 'filament.resources.payment-details-resource.pages.my-payments';
}
