<?php

namespace App\Filament\Resources\FeedbackFormResource\Pages;

use App\Filament\Resources\FeedbackFormResource;
use App\Models\Batch;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Filament\Notifications\Notification;

class CreateFeedbackForm extends CreateRecord
{
    protected static string $resource = FeedbackFormResource::class;

    protected function afterCreate(): void
    {
        // Access the created feedback form
        $feedbackForm = $this->record;
        $batches = $feedbackForm->batches;

        if($feedbackForm->notify_users){
            foreach($batches as $batch){
            $users = $batch->students()->get();
                Notification::make()
                ->title('Feedback Submission')
                ->body('Kindly, Please submit the assigned feedback forms')
                ->warning()
                ->sendToDatabase($users);
            }
        }
       
    }
}
