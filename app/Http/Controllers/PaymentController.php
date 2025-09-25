<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Get payment details for authenticated user
     */
    public function getPaymentDetails()
    {
        $user = Auth::user();
        
        $payments = Payment::where('user_id', $user->id)
            ->with('user')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $payments,
            'message' => 'Payment details retrieved successfully'
        ]);
    }

    /**
     * Get payment details by user ID (for admin/API)
     */
    public function getPaymentByUserId($userId)
    {
        $payments = Payment::where('user_id', $userId)
            ->with('user')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $payments,
            'message' => 'Payment details retrieved successfully'
        ]);
    }

    /**
     * Record installment payment
     */
    public function recordInstallmentPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|exists:payments,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'status' => 400
            ], 400);
        }

        $payment = Payment::findOrFail($request->payment_id);
        
        // Update payment record
        $newPaidAmount = $payment->paid_amount + $request->amount;
        $newRemainingAmount = $payment->total_fee - $newPaidAmount;
        
        // Determine status
        $status = 'partial';
        if ($newRemainingAmount <= 0) {
            $status = 'completed';
        }

        // Update installment details
        $installmentDetails = $payment->installment_details ?? [];
        $installmentDetails[] = [
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'notes' => $request->notes,
            'paid_at' => now()->toISOString()
        ];

        $payment->update([
            'paid_amount' => $newPaidAmount,
            'remaining_amount' => max(0, $newRemainingAmount),
            'status' => $status,
            'installment_details' => $installmentDetails
        ]);

        return response()->json([
            'success' => true,
            'data' => $payment->fresh(),
            'message' => 'Installment payment recorded successfully'
        ]);
    }

    /**
     * Get program fees configuration
     */
    public function getProgramFees()
    {
        $fees = Payment::getAllProgramFees();

        return response()->json([
            'success' => true,
            'data' => $fees,
            'message' => 'Program fees retrieved successfully'
        ]);
    }
}
