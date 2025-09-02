<?php

namespace App\Filament\Imports;

use App\Models\User;
use App\Models\Role;
use App\Models\Batch;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Filament\Facades\Filament;
use Illuminate\Validation\Rule;

class UserImporter extends Importer
{
    protected static ?string $model = User::class;
    
    protected $batchNameToAssign = null;

    public static function getColumns(): array
    {
        return [
            // Only the fields requested for CSV import
            ImportColumn::make('role')
                ->requiredMapping()
                ->fillRecordUsing(function (User $record, string $state): void {
                    $roleInput = trim($state);
                    if ($roleInput === '') {
                        return;
                    }
                    if (is_numeric($roleInput)) {
                        $record->role_id = (int) $roleInput;
                        return;
                    }
                    $matchedRole = Role::query()
                        ->whereRaw('LOWER(name) = ?', [mb_strtolower($roleInput)])
                        ->first();
                    if ($matchedRole) {
                        $record->role_id = $matchedRole->id;
                    }
                })
                ->rules(['required', 'max:255']),
            ImportColumn::make('name')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('email')
                ->requiredMapping()
                ->rules(['required', 'email', 'max:255', Rule::unique('users', 'email')]),
            ImportColumn::make('contact_number')
                ->fillRecordUsing(function (User $record, ?string $state): void {
                    $record->contact_number = $state ?? null;
                    $record->phone = $state ?? null;
                    // Ensure default country code is set alongside
                    $record->country_code = '+91';
                })
                ->rules(['nullable', 'max:255']),
            ImportColumn::make('gender')
                ->rules(['nullable', 'max:255']),
            ImportColumn::make('password')
                ->requiredMapping()
                ->rules(['required', 'max:255']),
            ImportColumn::make('batch_name')
                ->rules(['nullable', 'max:255']),
        ];
    }

    public function resolveRecord(): ?User
    {
         // Skip duplicates via unique validation; always create a fresh model instance
         return new User();
    }

    public function fillRecord(): void
    {
        // Remove batch_name from data before filling the record to prevent database errors
        if (isset($this->data['batch_name'])) {
            $this->batchNameToAssign = trim((string) $this->data['batch_name']);
            unset($this->data['batch_name']);
            \Log::info('batch_name removed in fillRecord method', [
                'batch_name_value' => $this->batchNameToAssign
            ]);
        }

        // Call parent method to fill the record normally
        parent::fillRecord();
    }

    protected function mutateRecordDataBeforeCreate(array $data): array
    {
        // batch_name is now handled in fillRecord method, so we just process other fields

        // Normalize email for consistent matching
        if (!empty($data['email'])) {
            $data['email'] = mb_strtolower(trim((string) $data['email']));
        }

        // Always set default country code to +91
        $data['country_code'] = '+91';

        // Mirror contact_number to phone for compatibility if phone column exists
        if (!empty($data['contact_number'])) {
            $data['phone'] = $data['contact_number'];
        }

        // Map role (by name) to role_id
        if (!empty($data['role'])) {
            $roleInput = trim((string) $data['role']);

            // If numeric provided, accept as-is; otherwise look up by name (case-insensitive)
            if (is_numeric($roleInput)) {
                $data['role_id'] = (int) $roleInput;
            } else {
                $matchedRole = Role::query()
                    ->whereRaw('LOWER(name) = ?', [mb_strtolower($roleInput)])
                    ->first();

                if ($matchedRole) {
                    $data['role_id'] = (int) $roleInput;
                }
            }

            // Remove the non-fillable column
            unset($data['role']);
        }

        // Fallback: if role_id still not set, default to Student role if available
        if (empty($data['role_id'])) {
            $studentRoleId = Role::query()->whereRaw('LOWER(name) = ?', ['student'])->value('id');
            if (!empty($studentRoleId)) {
                $data['role_id'] = (int) $studentRoleId;
            }
        }

        // Set default placement center access for students and placement students
        if (in_array($data['role_id'], [6, 11])) {
            $data['placement_center_access'] = true;
        } else {
            $data['placement_center_access'] = false;
        }

        return $data;
    }

    // mutateRecordDataBeforeFill method removed - data is now handled in fillRecord method

    // beforeSave method removed - data is now handled in fillRecord method

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your user import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }

    protected function afterSave(): void
    {
        $this->record->teams()->syncWithoutDetaching([1]);
        
        // Double-check and ensure placement center access is set correctly
        if (in_array($this->record->role_id, [6, 11]) && !$this->record->placement_center_access) {
            $this->record->update(['placement_center_access' => true]);
            \Log::info('Fixed placement center access after save for user', [
                'email' => $this->record->email,
                'role_id' => $this->record->role_id
            ]);
        }

        // Assign user to batch if batch_name is provided
        if (!empty($this->batchNameToAssign)) {
            $batchName = $this->batchNameToAssign;
            
            // Find batch by name (case-insensitive)
            $batch = Batch::query()
                ->whereRaw('LOWER(name) = ?', [mb_strtolower($batchName)])
                ->first();
            
            if ($batch) {
                // Attach user to existing batch
                $this->record->batches()->syncWithoutDetaching([$batch->id]);
                
                \Log::info('User successfully assigned to existing batch during import', [
                    'user_id' => $this->record->id,
                    'user_email' => $this->record->email,
                    'batch_id' => $batch->id,
                    'batch_name' => $batch->name
                ]);
            } else {
                // Log warning that batch doesn't exist - user will not be assigned to any batch
                \Log::warning('Batch not found during user import - user will not be assigned to any batch', [
                    'user_id' => $this->record->id,
                    'user_email' => $this->record->email,
                    'batch_name' => $batchName,
                    'message' => 'Please create the batch first or use an existing batch name'
                ]);
            }
        }
    }

    /**
     * Get the template download URL
     */
    public static function getTemplateDownloadUrl(): string
    {
        return '/templates/user_import_template.csv';
    }

    /**
     * Get template download instructions
     */
    public static function getTemplateInstructions(): string
    {
        return 'Download the template, fill role (name), name, email, contact_number, gender, password, batch_name. batch_name is optional - if provided, users will be automatically assigned to the specified EXISTING batch. IMPORTANT: Only use batch names that already exist in the system. country_code defaults to +91 if left empty.';
    }

}
