<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lead_id',
        'program',
        'total_fee',
        'no_of_installments',
        'installment_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'installment_details'
    ];

    protected $casts = [
        'total_fee' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'installment_details' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get program fee based on program name from configuration
     */
    public static function getProgramFee(string $program): float
    {
        return (float) config('program_fees.fees.' . $program, 0.00);
    }

    /**
     * Get all program fees
     */
    public static function getAllProgramFees(): array
    {
        return config('program_fees.fees', []);
    }
}
