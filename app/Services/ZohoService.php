<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Models\ZohoInvoice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ZohoService
{
    public function refreshStudentPaymentDetails($user)
    {
        $data = $this->getPaymentDetailsViaZoho($user->zoho_crm_id);
        if (isset($data['response']['data'])) {
            $data = $data['response']['data'];
            $userId = $user->id;
            $currentTime = getCurrentTime();

            $data = array_map(function ($item) use ($userId, $currentTime) {
                $item['user_id'] = $userId;
                $item['created_at'] = $item['updated_at'] =  $currentTime;
                $item['payment_url'] = random_int(100, 1000000);
                return $item;
            }, $data);
            $response =  $this->savePaymentDetailsToDb($data, $userId);

            $isFeatureAccessible = $this->checkFeatureAccess($user);


            return  $response ;

        }
        return ['success' => false, 'message' => 'Zoho details not found', 'status' => 400];
    }

    protected function savePaymentDetailsToDb($data, $userId)
    {
        ZohoInvoice::where('user_id', $userId)->delete();
        try {
            ZohoInvoice::insert($data);
        } catch (\Exception $e) {
            return [
                    'success' => false,
                    'message' => $e->getMessage(),
                    'status' => 500
            ];
        }

        return [
            'success' => true,
            'message' => "DB synced SuccessFully",
            'status' => 200
        ];
    }

    protected function getPaymentDetailsViaZoho($zohoCrmId)
    {


        $apiKey = 'PHtE6r0NEezvjDV%2BpENUs6C5FsCkYdh7%2Brk1fgRAttwXA%2FIKG01VqIoqkjO%2Bq0guUPRKQfLOyIlvueyVsu3TcG%2FuNmkYWGqyqK3sx%2FVYSPOZo%2BvCvBJy6Bp1MxGfEA%3D%3D';

        $url = 'https://www.zohoapis.in/books/v3/settings/incomingwebhooks/iw_test/execute';

        $params = [
            'auth_type' => 'apikey',
            'encapiKey' => urldecode($apiKey),
            'zoho_crm_id' => $zohoCrmId,
        ];

        $fullUrl = $url . '?' . http_build_query($params);
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->get($fullUrl);
            $data = $response->json();
            if ($response->successful()) {

                $validator = Validator::make($data, [
                    'message' => 'required',
                    'message' => 'required|string',
                    'response.data' => 'required|array',
                    'response.data.*.amount' => 'required',
                    'response.data.*.invo_url' => 'required',
                    'response.data.*.invoice_num' => 'required',
                    'response.data.*.due_date' => 'required',
                    'response.data.*.invoice_id' => 'required',
                    'response.data.*.status' => 'required'
                ]);

                if ($validator->fails()) {
                    return ["message" => $validator->errors()->all()[0], 'status' => 200, 'success' => false];
                }

                return $validator->validate();
            } else {
                return response()->json([
                    'error' => 'Failed to execute webhook',
                    'status' => $response->status(),
                    'response' => $response->json(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Exception occurred',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getInvoiceDetails($user)
    {
        // Fetch the invoices for the given user
        $data = ZohoInvoice::where('user_id', $user->id)->get()->toArray();
        // Check if the data is empty, then refresh payment details
        if (empty($data)) {
            $result = $this->refreshStudentPaymentDetails($user);

            if ($result['success']) {
                $data = ZohoInvoice::where('user_id', $user->id)->get()->toArray();

                return $this->appendReceipt($data);
            } else {
                return $result;
            }
        }
        return $this->appendReceipt($data);

        // Append receipt details regardless of whether data was newly fetched or existing
    }

    public function appendReceipt($payments)
    {
        // Initialize variables
        $totalPayment = 0;
        $totalPaid = 0;
        $duePayments = [];
        foreach ($payments as &$payment) {
            // Convert amount to a float for calculations
            $amount = (float) $payment['amount'];

            // Sum up total payments
            $totalPayment += $amount;

            // Check status
            if ($payment['status'] == 'paid') {
                $totalPaid += $amount;
            } else {
                // Store due payments
                $duePayments[] = $payment;
            }
            $payment['status'] = ($payment['status'] == 'draft') ? 'Verification_Pending' : ($payment['status'] == 'sent' || $payment['status'] == 'approved' ? 'Due' : 'Paid');
        }

        // Calculate remaining due
        $totalDue = $totalPayment - $totalPaid;

        // Prepare receipt summary
        $receiptSummary = [
            'totalPayments' => number_format($totalPayment, 2),
            'totalPaid' => number_format($totalPaid, 2),
            'totalDue' => number_format($totalDue, 2),
        ];
        return [
            'amountDetails'  => $receiptSummary,
            'data' => $payments
        ];
    }

    public function syncBatchDataOnZoho($batch)
    {
        $apiKey = '1003.5105c50190027b44dced94b8203fe9e3.b1174b18ed8661575cee62db7998fdf9';

        $params = [
            'auth_type' => 'apikey',
            'zapikey' => $apiKey,
            'BatchName' => $batch->name,
            'startDate' => date('d/m/Y'),
            'endDate' => date('d/m/Y'),
            'batchManagerName' => "dummy",
            'batchManagerId' => $batch->manager_id,
            'batchLmsId' => $batch->id,
            'course_Id' => $batch->course_id
        ];

        // Build the URL with query parameters
        $url = 'https://www.zohoapis.in/crm/v2/functions/create_batches/actions/execute?' . http_build_query($params);

        // Make the API request
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->get($url);
            // Check the response
            if ($response->successful()) {
                return ['success' => true];
            } else {

                return [
                    'error' => 'Failed to create batch',
                    'status' => $response->status(),
                    'response' => $response->json(),
                    'success' => false
                ];
            }
        } catch (\Exception $e) {
            // Handle exceptions
            return [
                'error' => 'Exception occurred',
                'message' => $e->getMessage(),
                'success' => true
            ];
        }
    }

    public function deleteBatchOnZoho($batch)
    {
        $apiKey = '1003.5105c50190027b44dced94b8203fe9e3.b1174b18ed8661575cee62db7998fdf9';
    
        $params = [
            'auth_type' => 'apikey',
            'zapikey' => $apiKey,
            'batchLmsId' => $batch->id
        ];
    
        // Build the URL with query parameters for deleting a batch
        $url = 'https://www.zohoapis.in/crm/v2/functions/delete_batch/actions/execute?' . http_build_query($params);
    
        // Make the API request
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->get($url);
            
            // Check the response
            if ($response->successful()) {
                return ['success' => true];
            } else {
                return [
                    'error' => 'Failed to delete batch',
                    'status' => $response->status(),
                    'response' => $response->json(),
                    'success' => false
                ];
            }
        } catch (\Exception $e) {
            // Handle exceptions
            return [
                'error' => 'Exception occurred',
                'message' => $e->getMessage(),
                'success' => false
            ];
        }
    }

    public function checkFeatureAccess($user){
        $today = date('Y-m-d');
        $studentRoleId = Role::where('name', 'Student')->first()->id;

        $userIds= ZohoInvoice::where("user_id", $user->id)
            ->whereDate('due_date', '>=', $today)->where('status', '!=', 'paid')
            ->pluck('user_id')
            ->toArray();
        
        User::where('role_id', $studentRoleId)->where('id', array_unique($userIds))->update(['feature_access' => 0]);
    }
    
}
