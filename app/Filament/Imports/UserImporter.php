<?php

namespace App\Filament\Imports;

use App\Models\User;
use App\Models\Role;
use Filament\Actions\Imports\ImportColumn;
use Filament\Actions\Imports\Importer;
use Filament\Actions\Imports\Models\Import;
use Filament\Facades\Filament;
use Illuminate\Validation\Rule;

class UserImporter extends Importer
{
    protected static ?string $model = User::class;

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
        ];
    }

    public function resolveRecord(): ?User
    {
         // Skip duplicates via unique validation; always create a fresh model instance
         return new User();
    }

    public static function getCompletedNotificationBody(Import $import): string
    {
        $body = 'Your user import has completed and ' . number_format($import->successful_rows) . ' ' . str('row')->plural($import->successful_rows) . ' imported.';

        if ($failedRowsCount = $import->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to import.';
        }

        return $body;
    }

    protected function beforeSave(): void
    {
        // Normalize email for consistent matching
        if (!empty($this->data['email'])) {
            $this->data['email'] = mb_strtolower(trim((string) $this->data['email']));
        }

        // Always set default country code to +91
        $this->data['country_code'] = '+91';

        // Mirror contact_number to phone for compatibility if phone column exists
        if (!empty($this->data['contact_number'])) {
            $this->data['phone'] = $this->data['contact_number'];
        }

        // Map role (by name) to role_id
        if (!empty($this->data['role'])) {
            $roleInput = trim((string) $this->data['role']);

            // If numeric provided, accept as-is; otherwise look up by name (case-insensitive)
            if (is_numeric($roleInput)) {
                $this->data['role_id'] = (int) $roleInput;
            } else {
                $matchedRole = Role::query()
                    ->whereRaw('LOWER(name) = ?', [mb_strtolower($roleInput)])
                    ->first();

                if ($matchedRole) {
                    $this->data['role_id'] = $matchedRole->id;
                }
            }

            // Remove the non-fillable column
            unset($this->data['role']);
        }

        // Fallback: if role_id still not set, default to Student role if available
        if (empty($this->data['role_id'])) {
            $studentRoleId = Role::query()->whereRaw('LOWER(name) = ?', ['student'])->value('id');
            if (!empty($studentRoleId)) {
                $this->data['role_id'] = (int) $studentRoleId;
            }
        }

        // Set default placement center access for students and placement students
        if (in_array($this->data['role_id'], [6, 11])) {
            $this->data['placement_center_access'] = true;
            $this->record->placement_center_access = true;
            \Log::info('Setting placement center access to TRUE for user', [
                'email' => $this->data['email'] ?? 'unknown',
                'role_id' => $this->data['role_id']
            ]);
        } else {
            $this->data['placement_center_access'] = false;
            $this->record->placement_center_access = false;
            \Log::info('Setting placement center access to FALSE for user', [
                'email' => $this->data['email'] ?? 'unknown',
                'role_id' => $this->data['role_id']
            ]);
        }
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
        return 'Download the template, fill role (name), name, email, country_code, contact_number, gender, password. country_code defaults to +91 if left empty.';
    }

}
