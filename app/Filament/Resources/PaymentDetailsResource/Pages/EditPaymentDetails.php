<?php

namespace App\Filament\Resources\PaymentDetailsResource\Pages;

use App\Filament\Resources\PaymentDetailsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPaymentDetails extends EditRecord
{
    protected static string $resource = PaymentDetailsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
