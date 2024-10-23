<?php

namespace App\Filament\Resources\PaymentDetailsResource\Pages;

use App\Filament\Resources\PaymentDetailsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPaymentDetails extends ListRecords
{
    protected static string $resource = PaymentDetailsResource::class;
    protected static string $view = 'filament.resources.exam-resource.pages.examination';

    // protected function getHeaderActions(): array
    // {
    //     return [
    //         Actions\CreateAction::make(),
    //     ];
    // }
}
